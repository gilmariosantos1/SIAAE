import { Router } from "express";
import { body, query, validationResult } from "express-validator";
import { createMenu, findMenusByDate } from "../repositories/menuRepository.js";
export const menuRoutes = Router();
menuRoutes.get("/", query("date")
    .isISO8601()
    .withMessage("date deve estar no formato YYYY-MM-DD"), async (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    try {
        const date = request.query?.date;
        return response.json({ data: await findMenusByDate(date) });
    }
    catch (error) {
        return next(error);
    }
});
menuRoutes.post("/", body("schoolIds").isArray({ min: 1 }).withMessage("schoolIds é obrigatório"), body("schoolIds.*").isInt({ min: 1 }), body("nutritionistId").optional({ nullable: true }).isInt({ min: 1 }), body("date").isISO8601().withMessage("date deve estar no formato YYYY-MM-DD"), body("educationStage").isIn([
    "Educação Infantil - Creche",
    "Educação Infantil - Pré-Escolar",
    "Ensino Fundamental - Anos Iniciais",
    "Ensino Fundamental - Anos Finais",
    "EJA - Anos Iniciais",
    "EJA - Anos Finais",
]), body("shift").isIn(["manha", "tarde", "noite", "integral"]), body("meal").isLength({ min: 1, max: 80 }).trim(), body("dish").isLength({ min: 1, max: 160 }).trim(), body("ingredients").optional({ nullable: true }).isArray(), body("ingredients.*").optional().isString().isLength({ min: 1, max: 120 }).trim(), async (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    try {
        return response.status(201).json({ data: await createMenu(request.body) });
    }
    catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return response.status(409).json({
                message: "Já existe um cardápio para essa escola, data, turno e refeição.",
            });
        }
        return next(error);
    }
});
