export interface Estacionamento {
  id_estacionamento: number;
  nome: string;
  endereco: string;
  cidade: string;
}

export interface EstacionamentoCreate {
  nome: string;
  endereco: string;
  cidade: string;
}

export interface EstacionamentoUpdate {
  nome?: string;
  endereco?: string;
  cidade?: string;
}
