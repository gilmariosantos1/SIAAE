import { pool } from "../config/database.js";
export async function getDashboard() {
    const [[evaluations], [average], [schools], [menus], [scoreSummary], [schoolAcceptance], [menuAcceptance], [period], [lowestMenus]] = await Promise.all([
        pool.query("SELECT COUNT(*) AS value FROM avaliacoes"),
        pool.query("SELECT COALESCE(ROUND(AVG((sabor + aparencia + temperatura + quantidade) / 4), 2), 0) AS value FROM avaliacoes"),
        pool.query("SELECT COUNT(*) AS value FROM escolas WHERE ativo = 1"),
        pool.query("SELECT COUNT(*) AS value FROM cardapios WHERE ativo = 1"),
        pool.query(`SELECT
        COALESCE(ROUND(AVG((sabor + aparencia + temperatura + quantidade) / 4) / 5 * 100, 1), 0) AS acceptability,
        COALESCE(ROUND(AVG(CASE WHEN (sabor + aparencia + temperatura + quantidade) / 4 >= 3 THEN 1 ELSE 0 END) * 100, 1), 0) AS approval,
        COALESCE(ROUND(AVG(CASE WHEN (sabor + aparencia + temperatura + quantidade) / 4 < 3 THEN 1 ELSE 0 END) * 100, 1), 0) AS rejection
       FROM avaliacoes`),
        pool.query(`SELECT e.nome AS name,
        ROUND(AVG((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4), 2) AS average,
        COUNT(*) AS evaluations
       FROM avaliacoes a JOIN escolas e ON e.id = a.escola_id
       GROUP BY e.id, e.nome ORDER BY average DESC`),
        pool.query(`SELECT c.nome_prato AS dish, c.refeicao AS meal,
        ROUND(AVG((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4), 2) AS average,
        COUNT(*) AS evaluations
       FROM avaliacoes a JOIN cardapios c ON c.id = a.cardapio_id
       GROUP BY c.id, c.nome_prato, c.refeicao ORDER BY average DESC`),
        pool.query(`SELECT DATE_FORMAT(criado_em, '%Y-%m-%d') AS date, COUNT(*) AS evaluations
       FROM avaliacoes
       WHERE criado_em >= CURRENT_DATE - INTERVAL 6 DAY
       GROUP BY DATE_FORMAT(criado_em, '%Y-%m-%d') ORDER BY date`),
        pool.query(`SELECT c.nome_prato AS dish, c.refeicao AS meal,
        ROUND(AVG((a.sabor + a.aparencia + a.temperatura + a.quantidade) / 4), 2) AS average,
        COUNT(*) AS evaluations
       FROM avaliacoes a JOIN cardapios c ON c.id = a.cardapio_id
       GROUP BY c.id, c.nome_prato, c.refeicao
       HAVING average < 3 ORDER BY average ASC LIMIT 5`),
    ]);
    return {
        totalEvaluations: evaluations[0].value,
        overallAverage: average[0].value,
        activeSchools: schools[0].value,
        activeMenus: menus[0].value,
        acceptability: scoreSummary[0].acceptability,
        approval: scoreSummary[0].approval,
        rejection: scoreSummary[0].rejection,
        schoolAcceptance,
        menuAcceptance,
        evaluationsByPeriod: period,
        lowestMenus,
    };
}
export async function listSchools() {
    const [rows] = await pool.query(`SELECT id, nome AS name, codigo_inep AS inepCode, endereco AS address, diretor AS director
     FROM escolas WHERE ativo = 1 ORDER BY nome`);
    return rows;
}
export async function createSchool(input) {
    const [result] = await pool.query(`INSERT INTO escolas (nome, codigo_inep, endereco, diretor) VALUES (:name, :inepCode, :address, :director)`, { ...input, director: input.director ?? null });
    return { id: result.insertId, ...input };
}
