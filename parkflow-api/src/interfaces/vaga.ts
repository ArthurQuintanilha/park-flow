export interface Vaga {
  id_vaga: number;
  numero: number;
  id_tipo_vaga: number;
  id_estacionamento: number;
}

export interface VagaCreate {
  numero: number;
  id_tipo_vaga: number;
  id_estacionamento: number;
}

export interface VagaUpdate {
  numero?: number;
  id_tipo_vaga?: number;
  id_estacionamento?: number;
}
