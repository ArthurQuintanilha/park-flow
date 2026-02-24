export interface TipoVaga {
  id_tipo_vaga: number;
  descricao: string;
}

export interface TipoVagaCreate {
  descricao: string;
}

export interface TipoVagaUpdate {
  descricao?: string;
}
