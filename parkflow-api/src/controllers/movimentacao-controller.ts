import { Request, Response } from "express";
import { pool } from "../../config/database";
import { MovimentacaoCreate, MovimentacaoUpdate } from "../interfaces";

export const listar = async (req: Request, res: Response) => {
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT m.*,
        json_build_object('id_veiculo', v.id_veiculo, 'placa', v.placa, 'marca', v.marca, 'modelo', v.modelo) as veiculo,
        json_build_object('id_vaga', vg.id_vaga, 'numero', vg.numero) as vaga
      FROM movimentacao m
      LEFT JOIN veiculo v ON m.id_veiculo = v.id_veiculo
      LEFT JOIN vaga vg ON m.id_vaga = vg.id_vaga
      ORDER BY m.data_entrada DESC
    `
    : "SELECT * FROM movimentacao ORDER BY data_entrada DESC";
  const result = await pool.query(query);
  res.json(result.rows);
};

export const listarPorVeiculo = async (req: Request, res: Response) => {
  const idVeiculo = String(req.params.idVeiculo);
  const result = await pool.query(
    "SELECT * FROM movimentacao WHERE id_veiculo = $1 ORDER BY data_entrada DESC",
    [idVeiculo]
  );
  res.json(result.rows);
};

export const buscarPorId = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const expand = req.query.expand === "true";
  const query = expand
    ? `
      SELECT m.*,
        json_build_object('id_veiculo', v.id_veiculo, 'placa', v.placa, 'marca', v.marca, 'modelo', v.modelo) as veiculo,
        json_build_object('id_vaga', vg.id_vaga, 'numero', vg.numero, 'id_estacionamento', e.id_estacionamento, 'estacionamento_nome', e.nome) as vaga
      FROM movimentacao m
      LEFT JOIN veiculo v ON m.id_veiculo = v.id_veiculo
      LEFT JOIN vaga vg ON m.id_vaga = vg.id_vaga
      LEFT JOIN estacionamento e ON vg.id_estacionamento = e.id_estacionamento
      WHERE m.id_movimentacao = $1
    `
    : "SELECT * FROM movimentacao WHERE id_movimentacao = $1";
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Movimentação não encontrada" });
    return;
  }
  res.json(result.rows[0]);
};

export const criar = async (req: Request, res: Response) => {
  const { id_veiculo, id_vaga, data_entrada, data_saida, tempo_minutos, valor_total } =
    req.body as MovimentacaoCreate;
  const result = await pool.query(
    `INSERT INTO movimentacao (id_veiculo, id_vaga, data_entrada, data_saida, tempo_minutos, valor_total)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [id_veiculo, id_vaga, data_entrada, data_saida, tempo_minutos, valor_total]
  );
  res.status(201).json(result.rows[0]);
};

export const atualizar = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updates = req.body as MovimentacaoUpdate;
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;
  const fieldMap = [
    ["id_veiculo", updates.id_veiculo],
    ["id_vaga", updates.id_vaga],
    ["data_entrada", updates.data_entrada],
    ["data_saida", updates.data_saida],
    ["tempo_minutos", updates.tempo_minutos],
    ["valor_total", updates.valor_total],
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
    `UPDATE movimentacao SET ${fields.join(", ")} WHERE id_movimentacao = $${paramCount} RETURNING *`,
    values
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Movimentação não encontrada" });
    return;
  }
  res.json(result.rows[0]);
};

export const excluir = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await pool.query(
    "DELETE FROM movimentacao WHERE id_movimentacao = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Movimentação não encontrada" });
    return;
  }
  res.status(204).send();
};
