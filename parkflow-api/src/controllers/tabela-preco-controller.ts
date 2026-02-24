import { Request, Response } from "express";
import { pool } from "../../config/database";
import { TabelaPrecoCreate, TabelaPrecoUpdate } from "../interfaces";

export const listar = async (req: Request, res: Response) => {
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT tp.*,
        json_build_object('id_tipo_veiculo', tv.id_tipo_veiculo, 'descricao', tv.descricao) as tipo_veiculo
      FROM tabela_preco tp
      LEFT JOIN tipo_veiculo tv ON tp.id_tipo_veiculo = tv.id_tipo_veiculo
      ORDER BY tp.id_preco
    `
    : "SELECT * FROM tabela_preco ORDER BY id_preco";
  const result = await pool.query(query);
  res.json(result.rows);
};

export const buscarPorTipoVeiculo = async (req: Request, res: Response) => {
  const idTipoVeiculo = String(req.params.idTipoVeiculo);
  const result = await pool.query(
    "SELECT * FROM tabela_preco WHERE id_tipo_veiculo = $1",
    [idTipoVeiculo]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Preço não encontrado para este tipo de veículo" });
    return;
  }
  res.json(result.rows[0]);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT tp.*,
        json_build_object('id_tipo_veiculo', tv.id_tipo_veiculo, 'descricao', tv.descricao) as tipo_veiculo
      FROM tabela_preco tp
      LEFT JOIN tipo_veiculo tv ON tp.id_tipo_veiculo = tv.id_tipo_veiculo
      WHERE tp.id_preco = $1
    `
    : "SELECT * FROM tabela_preco WHERE id_preco = $1";
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Preço não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const criar = async (req: Request, res: Response) => {
  const { id_tipo_veiculo, valor_hora } = req.body as TabelaPrecoCreate;
  const result = await pool.query(
    "INSERT INTO tabela_preco (id_tipo_veiculo, valor_hora) VALUES ($1, $2) RETURNING *",
    [id_tipo_veiculo, valor_hora]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updates = req.body as TabelaPrecoUpdate;
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;
  const fieldMap = [
    ["id_tipo_veiculo", updates.id_tipo_veiculo],
    ["valor_hora", updates.valor_hora],
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
    `UPDATE tabela_preco SET ${fields.join(", ")} WHERE id_preco = $${paramCount} RETURNING *`,
    values
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Preço não encontrado" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM tabela_preco WHERE id_preco = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Preço não encontrado" });
    return;
  }
  res.status(204).send();
};
