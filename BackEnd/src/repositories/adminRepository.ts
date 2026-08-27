import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';

type CountRow = RowDataPacket & { value: number };
type SchoolRow = RowDataPacket & { id: number; name: string; inepCode: string; address: string; director: string | null };

export async function getDashboard() {
  const [[evaluations], [average], [schools], [menus]] = await Promise.all([
    pool.query<CountRow[]>('SELECT COUNT(*) AS value FROM avaliacoes'),
    pool.query<CountRow[]>('SELECT COALESCE(ROUND(AVG((sabor + aparencia + temperatura + quantidade) / 4), 2), 0) AS value FROM avaliacoes'),
    pool.query<CountRow[]>('SELECT COUNT(*) AS value FROM escolas WHERE ativo = 1'),
    pool.query<CountRow[]>('SELECT COUNT(*) AS value FROM cardapios WHERE ativo = 1'),
  ]);
  return { totalEvaluations: evaluations[0].value, overallAverage: average[0].value, activeSchools: schools[0].value, activeMenus: menus[0].value };
}

export async function listSchools() {
  const [rows] = await pool.query<SchoolRow[]>(
    `SELECT id, nome AS name, codigo_inep AS inepCode, endereco AS address, diretor AS director
     FROM escolas WHERE ativo = 1 ORDER BY nome`,
  );
  return rows;
}

export async function createSchool(input: { name: string; inepCode: string; address: string; director?: string }) {
  const [result] = await pool.query(
    `INSERT INTO escolas (nome, codigo_inep, endereco, diretor) VALUES (:name, :inepCode, :address, :director)`,
    { ...input, director: input.director ?? null },
  );
  return { id: (result as { insertId: number }).insertId, ...input };
}