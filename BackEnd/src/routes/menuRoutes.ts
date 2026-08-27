import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { findMenusByDate } from '../repositories/menuRepository.js';

export const menuRoutes = Router();

menuRoutes.get('/', query('date').isISO8601().withMessage('date deve estar no formato YYYY-MM-DD'), async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });
  try {
    const date = request.query?.date;
    return response.json({ data: await findMenusByDate(date as string) });
  } catch (error) {
    return next(error);
  }
});
