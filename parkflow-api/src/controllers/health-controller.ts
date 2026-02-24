import { Request, Response } from "express";
import { pool } from "../../config/database";

export const healthCheck = async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT NOW()");
  res.json({
    status: "OK",
    database: "Conectado",
    timestamp: result.rows[0].now,
  });
};
