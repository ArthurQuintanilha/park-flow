import { Request, Response } from "express";
import { pool } from "../../config/database";

export const listar = async (_req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM vw_dashboard_estacionamento ORDER BY estacionamento, tipo_veiculo"
  );
  res.json(result.rows);
};
