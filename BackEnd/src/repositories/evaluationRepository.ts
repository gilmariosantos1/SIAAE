import { RowDataPacket } from "mysql2";
import { pool } from "../config/database.js";

export type EvaluationInput = {
  menuId: number;
  classId: number;
  educationStage: string;
  ingredients: string[];
  taste: number;
  appearance: number;
  temperature: number;
  quantity: number;
  suggestion?: string;
};

export type Evaluation = {
  id: number;
  menuId: number;
  dish: string;
  average: number;
  createdAt: string;
};

type EvaluationRow = RowDataPacket & Evaluation;

export async function createEvaluation(
  input: EvaluationInput,
): Promise<Evaluation> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [menus] = await connection.query<RowDataPacket[]>(
      `SELECT escola_id AS schoolId FROM cardapios WHERE id = :menuId`,
      { menuId: input.menuId },
    );
    if (!menus[0]) throw Object.assign(new Error('Cardápio não encontrado.'), { code: 'MENU_NOT_FOUND' });

    const [servedResult] = await connection.query(
      `INSERT INTO refeicoes_servidas (cardapio_id, escola_id, turma_id, etapa_ensino)
       VALUES (:menuId, :schoolId, :classId, :educationStage)`,
      { ...input, schoolId: menus[0].schoolId },
    );
    const servedId = (servedResult as { insertId: number }).insertId;

    for (const ingredient of input.ingredients) {
      await connection.query(
        `INSERT INTO refeicoes_servidas_ingredientes (refeicao_servida_id, nome)
         VALUES (:servedId, :ingredient)`,
        { servedId, ingredient },
      );
    }

    const [result] = await connection.query(
      `INSERT INTO avaliacoes
        (cardapio_id, escola_id, turma_id, etapa_ensino, refeicao_servida_id,
         sabor, aparencia, temperatura, quantidade, sugestao)
       VALUES (:menuId, :schoolId, :classId, :educationStage, :servedId,
         :taste, :appearance, :temperature, :quantity, :suggestion)`,
      { ...input, schoolId: menus[0].schoolId, servedId },
    );
    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await connection.query<EvaluationRow[]>(
      `SELECT a.id, a.cardapio_id AS menuId, c.nome_prato AS dish,
        ROUND((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4, 2) AS average,
        DATE_FORMAT(a.criado_em, '%Y-%m-%dT%H:%i:%sZ') AS createdAt
       FROM avaliacoes a JOIN cardapios c ON c.id = a.cardapio_id WHERE a.id = :id`,
      { id: insertId },
    );
    await connection.commit();
    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function findEvaluationsByClass(
  classId: number,
): Promise<Evaluation[]> {
  const [rows] = await pool.query<EvaluationRow[]>(
    `SELECT a.id, a.cardapio_id AS menuId, c.nome_prato AS dish,
      ROUND((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4, 2) AS average,
      DATE_FORMAT(a.criado_em, '%Y-%m-%dT%H:%i:%sZ') AS createdAt
     FROM avaliacoes a JOIN cardapios c ON c.id = a.cardapio_id
    WHERE a.turma_id = :classId ORDER BY a.criado_em DESC`,
      { classId },
  );
  return rows;
}
