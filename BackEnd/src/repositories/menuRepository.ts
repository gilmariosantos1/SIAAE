import { RowDataPacket } from "mysql2";
import { pool } from "../config/database.js";

export type Menu = {
  id: number;
  schoolId: number;
  date: string;
  school: string;
  educationStage: string;
  shift: string;
  meal: string;
  dish: string;
  ingredients: string[];
};

type MenuRow = RowDataPacket & Omit<Menu, "ingredients"> & { ingredients: string | null };

export async function findMenusByDate(date: string): Promise<Menu[]> {
  const [rows] = await pool.query<MenuRow[]>(
    `SELECT c.id, c.escola_id AS schoolId, DATE_FORMAT(c.data, '%Y-%m-%d') AS date,
      e.nome AS school, c.etapa_ensino AS educationStage,
      c.turno AS shift, c.refeicao AS meal,
      c.nome_prato AS dish,
      COALESCE(GROUP_CONCAT(ci.nome ORDER BY ci.id SEPARATOR '||'), c.ingredientes, '') AS ingredients
         FROM cardapios c JOIN escolas e ON e.id = c.escola_id
         LEFT JOIN cardapio_ingredientes ci ON ci.cardapio_id = c.id
         WHERE c.data = :date AND c.ativo = 1
         GROUP BY c.id, c.escola_id, c.data, e.nome, c.etapa_ensino, c.turno,
           c.refeicao, c.nome_prato, c.ingredientes
         ORDER BY e.nome, c.turno`,
    { date },
  );
  return rows.map((row) => ({
    ...row,
    ingredients: row.ingredients?.split(row.ingredients.includes('||') ? '||' : ',').map((ingredient) => ingredient.trim()).filter(Boolean) ?? [],
  }));
}

export type CreateMenuInput = {
  schoolIds: number[];
  nutritionistId?: number | null;
  date: string;
  educationStage: string;
  shift: "manha" | "tarde" | "noite" | "integral";
  meal: string;
  dish: string;
  ingredients?: string[] | null;
};

export async function createMenu(input: CreateMenuInput) {
  const connection = await pool.getConnection();
  const ids: number[] = [];

  try {
    await connection.beginTransaction();
    for (const schoolId of input.schoolIds) {
      const [result] = await connection.query(
        `INSERT INTO cardapios
          (escola_id, nutricionista_id, data, etapa_ensino, turno, refeicao, nome_prato, ingredientes)
         VALUES (:schoolId, :nutritionistId, :date, :educationStage, :shift, :meal, :dish, :ingredients)`,
        {
          schoolId,
          nutritionistId: input.nutritionistId ?? null,
          date: input.date,
          educationStage: input.educationStage,
          shift: input.shift,
          meal: input.meal,
          dish: input.dish,
          ingredients: null,
        },
      );
      const menuId = (result as { insertId: number }).insertId;
      for (const ingredient of input.ingredients ?? []) {
        await connection.query(
          `INSERT INTO cardapio_ingredientes (cardapio_id, nome) VALUES (:menuId, :ingredient)`,
          { menuId, ingredient },
        );
      }
      ids.push(menuId);
    }
    await connection.commit();
    return { ids };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
