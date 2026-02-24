export interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  id_tipo_cliente: number;
}

export interface ClienteCreate {
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  id_tipo_cliente: number;
}

export interface ClienteUpdate {
  nome?: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  id_tipo_cliente?: number;
}
