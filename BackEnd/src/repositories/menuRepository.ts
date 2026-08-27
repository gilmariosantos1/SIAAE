import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';

export type Menu = {
  id: number;
  date: string;
  school: string;
  shift: string;
  meal: string;
  dish: string;
  ingredients: string | null;
};

type MenuRow = RowDataPacket & Menu;

export async function findMenusByDate(date: string): Promise<Menu[]> {
  const [rows] = await pool.query<MenuRow[]>(
    `SELECT c.id, DATE_FORMAT(c.data, '%Y-%m-%d') AS date,
      e.nome AS school, c.turno AS shift, c.refeicao AS meal,
      c.nome_prato AS dish, c.ingredientes AS ingredients
     FROM cardapios c JOIN escolas e ON e.id = c.escola_id
     WHERE c.data = :date AND c.ativo = 1 ORDER BY e.nome, c.turno`,
    { date },
  );
  return rows;
}
