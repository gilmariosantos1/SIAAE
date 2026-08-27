import { pool } from '../config/database.js';
export async function findMenusByDate(date) {
    const [rows] = await pool.query(`SELECT c.id, DATE_FORMAT(c.data, '%Y-%m-%d') AS date,
      e.nome AS school, c.turno AS shift, c.refeicao AS meal,
      c.nome_prato AS dish, c.ingredientes AS ingredients
     FROM cardapios c JOIN escolas e ON e.id = c.escola_id
     WHERE c.data = :date AND c.ativo = 1 ORDER BY e.nome, c.turno`, { date });
    return rows;
}
