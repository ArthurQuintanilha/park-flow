import { Request, Response } from "express";
import { pool } from "../../config/database";
import { EstacionamentoCreate, EstacionamentoUpdate } from "../interfaces";

export const listar = async (_req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM estacionamento ORDER BY id_estacionamento"
  );
  res.json(result.rows);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "SELECT * FROM estacionamento WHERE id_estacionamento = $1",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Estacionamento não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const listarVagas = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    `SELECT v.*, tv.descricao as tipo_vaga_descricao
     FROM vaga v
     LEFT JOIN tipo_vaga tv ON v.id_tipo_vaga = tv.id_tipo_vaga
     WHERE v.id_estacionamento = $1
     ORDER BY v.numero`,
    [id]
  );
  res.json(result.rows);
};

export const criar = async (req: Request, res: Response) => {
  const { nome, endereco, cidade } = req.body as EstacionamentoCreate;
  const result = await pool.query(
    "INSERT INTO estacionamento (nome, endereco, cidade) VALUES ($1, $2, $3) RETURNING *",
    [nome, endereco, cidade]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updates = req.body as EstacionamentoUpdate;
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;
  const fieldMap = [
    ["nome", updates.nome],
    ["endereco", updates.endereco],
    ["cidade", updates.cidade],
  ] as const;
  for (const [field, value] of fieldMap) {
    if (value !== undefined) {
      fields.push(`${field} = $${paramCount++}`);
      values.push(value);
    }
  }
  if (fields.length === 0) {
    res.status(400).json({ error: "Nenhum campo para atualizar" });
    return;
  }
  values.push(id);
  const result = await pool.query(
    `UPDATE estacionamento SET ${fields.join(", ")} WHERE id_estacionamento = $${paramCount} RETURNING *`,
    values
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Estacionamento não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM estacionamento WHERE id_estacionamento = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Estacionamento não encontrado" });
    return;
  }
  res.status(204).send();
};
