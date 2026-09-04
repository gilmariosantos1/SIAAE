import { pool } from "../config/database.js";
export async function createFeedback(input) {
    await pool.query(`INSERT INTO feedbacks (tipo, mensagem, escola_id, aluno_id)
     VALUES (:type, :message, :schoolId, :studentId)`, {
        type: input.type,
        message: input.message,
        schoolId: input.schoolId ?? null,
        studentId: input.studentId ?? null,
    });
}
