import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { menuRoutes } from './routes/menuRoutes.js';
const app = express();
const port = Number(process.env.PORT ?? 3333);
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
app.get('/health', (_request, response) => response.json({ status: 'ok', service: 'siaae-api' }));
app.use('/api/menus', menuRoutes);
app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({ message: 'Não foi possível concluir a operação.' });
});
app.listen(port, () => console.log(`SIAAE API disponível em http://localhost:${port}`));
