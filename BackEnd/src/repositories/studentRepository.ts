import { RowDataPacket } from "mysql2";
import { pool } from "../config/database.js";

export type StudentClass = {
  id: number;
  name: string;
  educationStage: string;
  schoolId: number;
};

type StudentClassRow = RowDataPacket & StudentClass;

export async function findClasses(schoolId?: number, educationStage?: string): Promise<StudentClass[]> {
  const filters: string[] = ["ativo = 1"];
  const params: Record<string, number | string> = {};
  if (schoolId) {
    filters.push("escola_id = :schoolId");
    params.schoolId = schoolId;
  }
  if (educationStage) {
    filters.push("etapa_ensino = :educationStage");
    params.educationStage = educationStage;
  }
  const [rows] = await pool.query<StudentClassRow[]>(
    `SELECT id, nome AS name, etapa_ensino AS educationStage, escola_id AS schoolId
     FROM turmas
     WHERE ${filters.join(" AND ")}
     ORDER BY nome`,
    params,
  );
  return rows;
}