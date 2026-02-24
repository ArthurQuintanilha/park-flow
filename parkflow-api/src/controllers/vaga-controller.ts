import { Request, Response } from "express";
import { pool } from "../../config/database";
import { VagaCreate, VagaUpdate } from "../interfaces";

export const listar = async (req: Request, res: Response) => {
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT v.*,
        json_build_object('id_tipo_vaga', tv.id_tipo_vaga, 'descricao', tv.descricao) as tipo_vaga,
        json_build_object('id_estacionamento', e.id_estacionamento, 'nome', e.nome, 'cidade', e.cidade) as estacionamento
      FROM vaga v
      LEFT JOIN tipo_vaga tv ON v.id_tipo_vaga = tv.id_tipo_vaga
      LEFT JOIN estacionamento e ON v.id_estacionamento = e.id_estacionamento
      ORDER BY v.id_estacionamento, v.numero
    `
    : "SELECT * FROM vaga ORDER BY id_estacionamento, numero";
  const result = await pool.query(query);
  res.json(result.rows);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT v.*,
        json_build_object('id_tipo_vaga', tv.id_tipo_vaga, 'descricao', tv.descricao) as tipo_vaga,
        json_build_object('id_estacionamento', e.id_estacionamento, 'nome', e.nome, 'endereco', e.endereco, 'cidade', e.cidade) as estacionamento
      FROM vaga v
      LEFT JOIN tipo_vaga tv ON v.id_tipo_vaga = tv.id_tipo_vaga
      LEFT JOIN estacionamento e ON v.id_estacionamento = e.id_estacionamento
      WHERE v.id_vaga = $1
    `
    : "SELECT * FROM vaga WHERE id_vaga = $1";
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Vaga não encontrada" });
    return;
  }
  res.json(result.rows[0]);
};

export const criar = async (req: Request, res: Response) => {
  const { numero, id_tipo_vaga, id_estacionamento } = req.body as VagaCreate;
  const result = await pool.query(
    "INSERT INTO vaga (numero, id_tipo_vaga, id_estacionamento) VALUES ($1, $2, $3) RETURNING *",
    [numero, id_tipo_vaga, id_estacionamento]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updates = req.body as VagaUpdate;
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;
  const fieldMap = [
    ["numero", updates.numero],
    ["id_tipo_vaga", updates.id_tipo_vaga],
    ["id_estacionamento", updates.id_estacionamento],
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
    `UPDATE vaga SET ${fields.join(", ")} WHERE id_vaga = $${paramCount} RETURNING *`,
    values
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Vaga não encontrada" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM vaga WHERE id_vaga = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Vaga não encontrada" });
    return;
  }
  res.status(204).send();
};
