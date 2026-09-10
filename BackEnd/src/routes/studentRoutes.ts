import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import {
  createEvaluation,
  findEvaluationsByClass,
} from "../repositories/evaluationRepository.js";
import { createFeedback } from "../repositories/feedbackRepository.js";
import { findClasses } from "../repositories/studentRepository.js";

export const studentRoutes = Router();
const validate = (
  request: Parameters<typeof validationResult>[0],
  response: any,
  next: any,
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  return next();
};

studentRoutes.get(
  "/classes",
  query("schoolId").optional().isInt({ min: 1 }),
  query("educationStage").optional().isLength({ min: 1, max: 80 }),
  validate,
  async (request, response, next) => {
    try {
      const schoolId = request.query?.schoolId;
      const educationStage = request.query?.educationStage;
      return response.json({
        data: await findClasses(
          schoolId ? Number(schoolId) : undefined,
          educationStage ? String(educationStage) : undefined,
        ),
      });
    } catch (error) {
      return next(error);
    }
  },
);

studentRoutes.post(
  "/evaluations",
  body("menuId").isInt({ min: 1 }),
  body("classId").isInt({ min: 1 }),
  body("educationStage").isLength({ min: 1, max: 80 }).trim(),
  body("ingredients").isArray({ min: 1 }),
  body("ingredients.*").isString().isLength({ min: 1, max: 120 }).trim(),
  body(["taste", "appearance", "temperature", "quantity"]).isInt({
    min: 1,
    max: 5,
  }),
  body("suggestion").optional().isLength({ max: 500 }),
  validate,
  async (request, response, next) => {
    try {
      const evaluation = await createEvaluation({
        ...request.body,
      });
      return response
        .status(201)
        .json({
          data: evaluation,
          message: "Avaliação registrada com sucesso.",
        });
    } catch (error: any) {
      if (error?.code === "ER_DUP_ENTRY")
        return response
          .status(409)
          .json({ message: "Esta refeição já foi avaliada." });
      return next(error);
    }
  },
);

studentRoutes.get(
  "/evaluations/class/:classId",
  param("classId").isInt({ min: 1 }),
  validate,
  async (request, response, next) => {
    try {
      return response.json({
        data: await findEvaluationsByClass(Number(request.params?.classId)),
      });
    } catch (error) {
      return next(error);
    }
  },
);

studentRoutes.post(
  "/feedback",
  body("type").isIn(["sugestao", "reclamacao", "elogio"]),
  body("message").isLength({ min: 3, max: 1000 }),
  body("schoolId").optional().isInt({ min: 1 }),
  body("studentId").optional().isInt({ min: 1 }),
  validate,
  async (request, response, next) => {
    try {
      await createFeedback(request.body);
      return response
        .status(201)
        .json({ message: "Mensagem enviada para a nutrição." });
    } catch (error) {
      return next(error);
    }
  },
);
