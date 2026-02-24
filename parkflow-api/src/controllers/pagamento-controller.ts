import { Request, Response } from "express";
import { pool } from "../../config/database";
import { PagamentoCreate, PagamentoUpdate } from "../interfaces";

export const listar = async (req: Request, res: Response) => {
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT p.*,
        json_build_object(
          'id_movimentacao', m.id_movimentacao, 'valor_total', m.valor_total, 'data_entrada', m.data_entrada, 'data_saida', m.data_saida
        ) as movimentacao
      FROM pagamento p
      LEFT JOIN movimentacao m ON p.id_movimentacao = m.id_movimentacao
      ORDER BY p.data_pagamento DESC
    `
    : "SELECT * FROM pagamento ORDER BY data_pagamento DESC";
  const result = await pool.query(query);
  res.json(result.rows);
};

export const buscarPorMovimentacao = async (req: Request, res: Response) => {
  const idMovimentacao = String(req.params.idMovimentacao);
  const result = await pool.query(
    "SELECT * FROM pagamento WHERE id_movimentacao = $1",
    [idMovimentacao]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Pagamento não encontrado para esta movimentação" });
    return;
  }
  res.json(result.rows[0]);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT p.*,
        json_build_object(
          'id_movimentacao', m.id_movimentacao, 'id_veiculo', m.id_veiculo, 'id_vaga', m.id_vaga,
          'valor_total', m.valor_total, 'data_entrada', m.data_entrada, 'data_saida', m.data_saida
        ) as movimentacao
      FROM pagamento p
      LEFT JOIN movimentacao m ON p.id_movimentacao = m.id_movimentacao
      WHERE p.id_pagamento = $1
    `
    : "SELECT * FROM pagamento WHERE id_pagamento = $1";
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Pagamento não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const criar = async (req: Request, res: Response) => {
  const { id_movimentacao, forma_pagamento, data_pagamento } = req.body as PagamentoCreate;
  const result = await pool.query(
    `INSERT INTO pagamento (id_movimentacao, forma_pagamento, data_pagamento)
     VALUES ($1, $2, $3) RETURNING *`,
    [id_movimentacao, forma_pagamento, data_pagamento]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updates = req.body as PagamentoUpdate;
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;
  const fieldMap = [
    ["id_movimentacao", updates.id_movimentacao],
    ["forma_pagamento", updates.forma_pagamento],
    ["data_pagamento", updates.data_pagamento],
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
    `UPDATE pagamento SET ${fields.join(", ")} WHERE id_pagamento = $${paramCount} RETURNING *`,
    values
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Pagamento não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM pagamento WHERE id_pagamento = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Pagamento não encontrado" });
    return;
  }
  res.status(204).send();
};
