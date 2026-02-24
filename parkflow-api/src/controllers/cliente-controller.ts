import { Request, Response } from "express";
import { pool } from "../../config/database";
import { ClienteCreate, ClienteUpdate } from "../interfaces";

export const listar = async (req: Request, res: Response) => {
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT c.*,
        json_build_object('id_tipo_cliente', tc.id_tipo_cliente, 'descricao', tc.descricao) as tipo_cliente
      FROM cliente c
      LEFT JOIN tipo_cliente tc ON c.id_tipo_cliente = tc.id_tipo_cliente
      ORDER BY c.id_cliente
    `
    : "SELECT * FROM cliente ORDER BY id_cliente";
  const result = await pool.query(query);
  res.json(result.rows);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT c.*,
        json_build_object('id_tipo_cliente', tc.id_tipo_cliente, 'descricao', tc.descricao) as tipo_cliente
      FROM cliente c
      LEFT JOIN tipo_cliente tc ON c.id_tipo_cliente = tc.id_tipo_cliente
      WHERE c.id_cliente = $1
    `
    : "SELECT * FROM cliente WHERE id_cliente = $1";
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Cliente não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const criar = async (req: Request, res: Response) => {
  const { nome, cpf, telefone, email, id_tipo_cliente } = req.body as ClienteCreate;
  const result = await pool.query(
    `INSERT INTO cliente (nome, cpf, telefone, email, id_tipo_cliente)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nome, cpf, telefone ?? null, email ?? null, id_tipo_cliente]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updates = req.body as ClienteUpdate;
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;
  const fieldMap = [
    ["nome", updates.nome],
    ["cpf", updates.cpf],
    ["telefone", updates.telefone],
    ["email", updates.email],
    ["id_tipo_cliente", updates.id_tipo_cliente],
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
    `UPDATE cliente SET ${fields.join(", ")} WHERE id_cliente = $${paramCount} RETURNING *`,
    values
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Cliente não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM cliente WHERE id_cliente = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Cliente não encontrado" });
    return;
  }
  res.status(204).send();
};
