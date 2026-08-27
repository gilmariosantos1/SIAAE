import { pool } from '../config/database.js';
export async function createEvaluation(input) {
    const [result] = await pool.query(`INSERT INTO avaliacoes
      (cardapio_id, aluno_id, sabor, aparencia, temperatura, quantidade, sugestao)
     VALUES (:menuId, :studentId, :taste, :appearance, :temperature, :quantity, :suggestion)`, input);
    const insertId = result.insertId;
    const [rows] = await pool.query(`SELECT a.id, a.cardapio_id AS menuId, c.nome_prato AS dish,
      ROUND((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4, 2) AS average,
      DATE_FORMAT(a.criado_em, '%Y-%m-%dT%H:%i:%sZ') AS createdAt
     FROM avaliacoes a JOIN cardapios c ON c.id = a.cardapio_id WHERE a.id = :id`, { id: insertId });
    return rows[0];
}
export async function findEvaluationsByStudent(studentId) {
    const [rows] = await pool.query(`SELECT a.id, a.cardapio_id AS menuId, c.nome_prato AS dish,
      ROUND((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4, 2) AS average,
      DATE_FORMAT(a.criado_em, '%Y-%m-%dT%H:%i:%sZ') AS createdAt
     FROM avaliacoes a JOIN cardapios c ON c.id = a.cardapio_id
     WHERE a.aluno_id = :studentId ORDER BY a.criado_em DESC`, { studentId });
    return rows;
}
