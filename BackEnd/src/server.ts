import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { pool } from "./config/database.js";
import { menuRoutes } from "./routes/menuRoutes.js";
import { studentRoutes } from "./routes/studentRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";

const app = express();
const port = Number(process.env.PORT ?? 3333);

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:8100" }));
app.use(express.json({ limit: "100kb" }));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.get("/", (_request, response) =>
  response.json({ status: "ok", service: "siaae-api" }),
);
app.use("/api/menus", menuRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  (
    error: Error,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    response
      .status(500)
      .json({ message: "Não foi possível concluir a operação." });
  },
);

async function startServer() {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.query("SELECT 1");
    console.log("Conexão com o banco de dados estabelecida.");

    app.listen(port, () =>
      console.log(`SIAAE API disponível em http://localhost:${port}`),
    );       

  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
    await pool.end();
    process.exit(1);
  } finally {
    connection?.release();
  }
}

void startServer();
