import 'dotenv/config';
import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    database: process.env.DB_NAME ?? 'siaae',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
});
