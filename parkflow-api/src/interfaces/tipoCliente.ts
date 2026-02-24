export interface TipoCliente {
  id_tipo_cliente: number;
  descricao: string;
}

export interface TipoClienteCreate {
  descricao: string;
}

export interface TipoClienteUpdate {
  descricao?: string;
}
