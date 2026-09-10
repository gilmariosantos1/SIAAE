import { pool } from "../config/database.js";
export async function createEvaluation(input) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [menus] = await connection.query(`SELECT escola_id AS schoolId FROM cardapios WHERE id = :menuId`, { menuId: input.menuId });
        if (!menus[0])
            throw Object.assign(new Error('Cardápio não encontrado.'), { code: 'MENU_NOT_FOUND' });
        const [servedResult] = await connection.query(`INSERT INTO refeicoes_servidas (cardapio_id, escola_id, turma_id, etapa_ensino)
       VALUES (:menuId, :schoolId, :classId, :educationStage)`, { ...input, schoolId: menus[0].schoolId });
        const servedId = servedResult.insertId;
        for (const ingredient of input.ingredients) {
            await connection.query(`INSERT INTO refeicoes_servidas_ingredientes (refeicao_servida_id, nome)
         VALUES (:servedId, :ingredient)`, { servedId, ingredient });
        }
        const [result] = await connection.query(`INSERT INTO avaliacoes
        (cardapio_id, escola_id, turma_id, etapa_ensino, refeicao_servida_id,
         sabor, aparencia, temperatura, quantidade, sugestao)
       VALUES (:menuId, :schoolId, :classId, :educationStage, :servedId,
         :taste, :appearance, :temperature, :quantity, :suggestion)`, { ...input, schoolId: menus[0].schoolId, servedId });
        const insertId = result.insertId;
        const [rows] = await connection.query(`SELECT a.id, a.cardapio_id AS menuId, c.nome_prato AS dish,
        ROUND((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4, 2) AS average,
        DATE_FORMAT(a.criado_em, '%Y-%m-%dT%H:%i:%sZ') AS createdAt
       FROM avaliacoes a JOIN cardapios c ON c.id = a.cardapio_id WHERE a.id = :id`, { id: insertId });
        await connection.commit();
        return rows[0];
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
export async function findEvaluationsByClass(classId) {
    const [rows] = await pool.query(`SELECT a.id, a.cardapio_id AS menuId, c.nome_prato AS dish,
      ROUND((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4, 2) AS average,
      DATE_FORMAT(a.criado_em, '%Y-%m-%dT%H:%i:%sZ') AS createdAt
     FROM avaliacoes a JOIN cardapios c ON c.id = a.cardapio_id
    WHERE a.turma_id = :classId ORDER BY a.criado_em DESC`, { classId });
    return rows;
}
