import "dotenv/config";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import mysql, { type Connection, type RowDataPacket } from "mysql2/promise";

const databaseName = process.env.DB_NAME ?? "siaae";
const databaseConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "dev",
  password: process.env.DB_PASSWORD ?? "Lab@2203",
  multipleStatements: true,
};

const databaseDirectory = dirname(new URL(import.meta.url).pathname);
const schemaFile = resolve(databaseDirectory, "schema.sql");
const baselineVersion = 3;

type MigrationRow = RowDataPacket & {
  name: string;
  checksum: string;
};

type MigrationFile = {
  name: string;
  version: number;
  path: string;
};

function quoteIdentifier(identifier: string): string {
  return `\`${identifier.replaceAll("`", "``")}\``;
}

function getMigrationFiles(files: string[]): MigrationFile[] {
  return files
    .map((name) => {
      const match = /^(\d+)_.*\.sql$/i.exec(name);
      if (!match) return undefined;

      return {
        name,
        version: Number(match[1]),
        path: resolve(databaseDirectory, name),
      };
    })
    .filter((migration): migration is MigrationFile => migration !== undefined)
    .sort((left, right) => left.version - right.version || left.name.localeCompare(right.name));
}

function checksum(contents: string): string {
  return createHash("sha256").update(contents).digest("hex");
}

async function createDatabase(connection: Connection): Promise<void> {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(databaseName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
}

async function ensureMigrationTable(connection: Connection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      checksum CHAR(64) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
}

async function getAppliedMigrations(connection: Connection): Promise<Map<string, string>> {
  const [rows] = await connection.query<MigrationRow[]>(
    "SELECT name, checksum FROM schema_migrations ORDER BY name",
  );
  return new Map(rows.map((row) => [row.name, row.checksum]));
}

async function recordMigration(
  connection: Connection,
  name: string,
  migrationChecksum: string,
): Promise<void> {
  await connection.execute(
    "INSERT INTO schema_migrations (name, checksum) VALUES (?, ?)",
    [name, migrationChecksum],
  );
}

async function hasApplicationTables(connection: Connection): Promise<boolean> {
  const [tables] = await connection.query<RowDataPacket[]>(
    `
      SELECT TABLE_NAME
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME <> 'schema_migrations'
      LIMIT 1
    `,
    [databaseName],
  );
  return tables.length > 0;
}

async function run(): Promise<void> {
  const files = await readdir(databaseDirectory);
  const migrationFiles = getMigrationFiles(files);
  const schemaContents = await readFile(schemaFile, "utf8");
  const connection = await mysql.createConnection(databaseConfig);

  try {
    await createDatabase(connection);
    await connection.changeUser({ database: databaseName });
    await ensureMigrationTable(connection);

    const appliedMigrations = await getAppliedMigrations(connection);
    const schemaChecksum = checksum(schemaContents);
    const applicationTablesExist = await hasApplicationTables(connection);
    const appliedSchemaChecksum = appliedMigrations.get("schema.sql");

    if (!applicationTablesExist) {
      console.log("Aplicando schema.sql...");
      await connection.query(schemaContents);

      if (!appliedSchemaChecksum) {
        await recordMigration(connection, "schema.sql", schemaChecksum);
      }
    } else if (!appliedSchemaChecksum) {
      console.log("Schema existente detectado; registrando schema.sql como baseline.");
      await recordMigration(connection, "schema.sql", schemaChecksum);
    } else if (appliedSchemaChecksum !== schemaChecksum) {
      throw new Error("schema.sql foi alterado depois de aplicado; crie uma nova migration.");
    }

    for (const migration of migrationFiles) {
      const contents = await readFile(migration.path, "utf8");
      const migrationChecksum = checksum(contents);
      const appliedChecksum = appliedMigrations.get(migration.name);

      if (appliedChecksum) {
        if (appliedChecksum !== migrationChecksum) {
          throw new Error(`A migration ${migration.name} foi alterada depois de aplicada.`);
        }
        continue;
      }

      if (migration.version <= baselineVersion) {
        console.log(`Registrando ${migration.name} como migration histórica do baseline.`);
        await recordMigration(connection, migration.name, migrationChecksum);
        continue;
      }

      console.log(`Aplicando ${migration.name}...`);
      await connection.query(contents);
      await recordMigration(connection, migration.name, migrationChecksum);
    }

    console.log("Migrações concluídas com sucesso.");
  } finally {
    await connection.end();
  }
}

run().catch((error: unknown) => {
  console.error("Falha ao migrar o banco de dados:", error);
  process.exitCode = 1;
});
