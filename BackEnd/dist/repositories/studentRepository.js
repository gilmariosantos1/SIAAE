import { pool } from "../config/database.js";
export async function findClasses(schoolId, educationStage) {
    const filters = ["ativo = 1"];
    const params = {};
    if (schoolId) {
        filters.push("escola_id = :schoolId");
        params.schoolId = schoolId;
    }
    if (educationStage) {
        filters.push("etapa_ensino = :educationStage");
        params.educationStage = educationStage;
    }
    const [rows] = await pool.query(`SELECT id, nome AS name, etapa_ensino AS educationStage, escola_id AS schoolId
     FROM turmas
     WHERE ${filters.join(" AND ")}
     ORDER BY nome`, params);
    return rows;
}
