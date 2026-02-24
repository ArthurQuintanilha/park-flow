export interface Veiculo {
  id_veiculo: number;
  placa: string;
  marca: string;
  modelo: string;
  cor: string | null;
  id_tipo_veiculo: number;
  id_cliente: number;
}

export interface VeiculoCreate {
  placa: string;
  marca: string;
  modelo: string;
  cor?: string;
  id_tipo_veiculo: number;
  id_cliente: number;
}

export interface VeiculoUpdate {
  placa?: string;
  marca?: string;
  modelo?: string;
  cor?: string;
  id_tipo_veiculo?: number;
  id_cliente?: number;
}
