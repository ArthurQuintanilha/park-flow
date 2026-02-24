import { Request, Response } from "express";
import { pool } from "../../config/database";
import { VeiculoCreate, VeiculoUpdate } from "../interfaces";

export const listar = async (req: Request, res: Response) => {
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT v.*,
        json_build_object('id_tipo_veiculo', tv.id_tipo_veiculo, 'descricao', tv.descricao) as tipo_veiculo,
        json_build_object('id_cliente', c.id_cliente, 'nome', c.nome, 'cpf', c.cpf) as cliente
      FROM veiculo v
      LEFT JOIN tipo_veiculo tv ON v.id_tipo_veiculo = tv.id_tipo_veiculo
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      ORDER BY v.id_veiculo
    `
    : "SELECT * FROM veiculo ORDER BY id_veiculo";
  const result = await pool.query(query);
  res.json(result.rows);
};

export const listarPorCliente = async (req: Request, res: Response) => {
  const idCliente = String(req.params.idCliente);
  const result = await pool.query(
    `SELECT v.*, tv.descricao as tipo_veiculo_descricao
     FROM veiculo v
     LEFT JOIN tipo_veiculo tv ON v.id_tipo_veiculo = tv.id_tipo_veiculo
     WHERE v.id_cliente = $1
     ORDER BY v.placa`,
    [idCliente]
  );
  res.json(result.rows);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT v.*,
        json_build_object('id_tipo_veiculo', tv.id_tipo_veiculo, 'descricao', tv.descricao) as tipo_veiculo,
        json_build_object('id_cliente', c.id_cliente, 'nome', c.nome, 'cpf', c.cpf, 'email', c.email) as cliente
      FROM veiculo v
      LEFT JOIN tipo_veiculo tv ON v.id_tipo_veiculo = tv.id_tipo_veiculo
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      WHERE v.id_veiculo = $1
    `
    : "SELECT * FROM veiculo WHERE id_veiculo = $1";
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Veículo não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const criar = async (req: Request, res: Response) => {
  const { placa, marca, modelo, cor, id_tipo_veiculo, id_cliente } = req.body as VeiculoCreate;
  const result = await pool.query(
    `INSERT INTO veiculo (placa, marca, modelo, cor, id_tipo_veiculo, id_cliente)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [placa, marca, modelo, cor ?? null, id_tipo_veiculo, id_cliente]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updates = req.body as VeiculoUpdate;
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;
  const fieldMap = [
    ["placa", updates.placa],
    ["marca", updates.marca],
    ["modelo", updates.modelo],
    ["cor", updates.cor],
    ["id_tipo_veiculo", updates.id_tipo_veiculo],
    ["id_cliente", updates.id_cliente],
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
    `UPDATE veiculo SET ${fields.join(", ")} WHERE id_veiculo = $${paramCount} RETURNING *`,
    values
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Veículo não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM veiculo WHERE id_veiculo = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Veículo não encontrado" });
    return;
  }
  res.status(204).send();
};
