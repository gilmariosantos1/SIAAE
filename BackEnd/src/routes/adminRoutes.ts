import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  createSchool,
  getDashboard,
  listSchools,
} from "../repositories/adminRepository.js";

export const adminRoutes = Router();
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

adminRoutes.get("/dashboard", async (_request, response, next) => {
  try {
    return response.json({ data: await getDashboard() });
  } catch (error) {
    return next(error);
  }
});
adminRoutes.get("/schools", async (_request, response, next) => {
  try {
    return response.json({ data: await listSchools() });
  } catch (error) {
    return next(error);
  }
});
adminRoutes.post(
  "/schools",
  body("name").isLength({ min: 2, max: 160 }),
  body("inepCode").isLength({ min: 1, max: 20 }),
  body("address").isLength({ min: 3, max: 255 }),
  body("director").optional().isLength({ max: 160 }),
  validate,
  async (request, response, next) => {
    try {
      return response
        .status(201)
        .json({ data: await createSchool(request.body) });
    } catch (error) {
      return next(error);
    }
  },
);
