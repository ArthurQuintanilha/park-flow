import { Request, Response } from "express";
import { pool } from "../../config/database";
import { TipoClienteCreate, TipoClienteUpdate } from "../interfaces";

export const listar = async (_req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM tipo_cliente ORDER BY id_tipo_cliente"
  );
  res.json(result.rows);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "SELECT * FROM tipo_cliente WHERE id_tipo_cliente = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Tipo de cliente não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const criar = async (req: Request, res: Response) => {
  const { descricao } = req.body as TipoClienteCreate;
  const result = await pool.query(
    "INSERT INTO tipo_cliente (descricao) VALUES ($1) RETURNING *",
    [descricao]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { descricao } = req.body as TipoClienteUpdate;
  if (descricao === undefined) {
    res.status(400).json({ error: "Nenhum campo para atualizar" });
    return;
  }
  const result = await pool.query(
    "UPDATE tipo_cliente SET descricao = $1 WHERE id_tipo_cliente = $2 RETURNING *",
    [descricao, id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Tipo de cliente não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM tipo_cliente WHERE id_tipo_cliente = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Tipo de cliente não encontrado" });
    return;
  }
  res.status(204).send();
};
