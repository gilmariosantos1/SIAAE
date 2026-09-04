import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { createEvaluation, findEvaluationsByStudent, } from "../repositories/evaluationRepository.js";
import { createFeedback } from "../repositories/feedbackRepository.js";
export const studentRoutes = Router();
const validate = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    return next();
};
studentRoutes.post("/evaluations", body("menuId").isInt({ min: 1 }), body("studentId").optional().isInt({ min: 1 }), body(["taste", "appearance", "temperature", "quantity"]).isInt({
    min: 1,
    max: 5,
}), body("suggestion").optional().isLength({ max: 500 }), validate, async (request, response, next) => {
    try {
        const evaluation = await createEvaluation({
            ...request.body,
            studentId: request.body.studentId ?? 1,
        });
        return response
            .status(201)
            .json({
            data: evaluation,
            message: "Avaliação registrada com sucesso.",
        });
    }
    catch (error) {
        if (error?.code === "ER_DUP_ENTRY")
            return response
                .status(409)
                .json({ message: "Esta refeição já foi avaliada." });
        return next(error);
    }
});
studentRoutes.get("/evaluations/:studentId", param("studentId").isInt({ min: 1 }), validate, async (request, response, next) => {
    try {
        return response.json({
            data: await findEvaluationsByStudent(Number(request.params?.studentId)),
        });
    }
    catch (error) {
        return next(error);
    }
});
studentRoutes.post("/feedback", body("type").isIn(["sugestao", "reclamacao", "elogio"]), body("message").isLength({ min: 3, max: 1000 }), body("schoolId").optional().isInt({ min: 1 }), body("studentId").optional().isInt({ min: 1 }), validate, async (request, response, next) => {
    try {
        await createFeedback(request.body);
        return response
            .status(201)
            .json({ message: "Mensagem enviada para a nutrição." });
    }
    catch (error) {
        return next(error);
    }
});
