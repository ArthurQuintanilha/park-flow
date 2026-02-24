import { Request, Response } from "express";
import { pool } from "../../config/database";
import { TipoVagaCreate, TipoVagaUpdate } from "../interfaces";

export const listar = async (_req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM tipo_vaga ORDER BY id_tipo_vaga"
  );
  res.json(result.rows);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "SELECT * FROM tipo_vaga WHERE id_tipo_vaga = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Tipo de vaga não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const criar = async (req: Request, res: Response) => {
  const { descricao } = req.body as TipoVagaCreate;
  const result = await pool.query(
    "INSERT INTO tipo_vaga (descricao) VALUES ($1) RETURNING *",
    [descricao]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { descricao } = req.body as TipoVagaUpdate;
  if (descricao === undefined) {
    res.status(400).json({ error: "Nenhum campo para atualizar" });
    return;
  }
  const result = await pool.query(
    "UPDATE tipo_vaga SET descricao = $1 WHERE id_tipo_vaga = $2 RETURNING *",
    [descricao, id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Tipo de vaga não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM tipo_vaga WHERE id_tipo_vaga = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Tipo de vaga não encontrado" });
    return;
  }
  res.status(204).send();
};
