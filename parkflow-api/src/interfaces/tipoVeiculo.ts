export interface TipoVeiculo {
  id_tipo_veiculo: number;
  descricao: string;
}

export interface TipoVeiculoCreate {
  descricao: string;
}

export interface TipoVeiculoUpdate {
  descricao?: string;
}
