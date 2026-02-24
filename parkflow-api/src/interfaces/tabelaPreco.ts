export interface TabelaPreco {
  id_preco: number;
  id_tipo_veiculo: number;
  valor_hora: string;
}

export interface TabelaPrecoCreate {
  id_tipo_veiculo: number;
  valor_hora: number;
}

export interface TabelaPrecoUpdate {
  id_tipo_veiculo?: number;
  valor_hora?: number;
}
