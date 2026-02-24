export interface Movimentacao {
  id_movimentacao: number;
  id_veiculo: number;
  id_vaga: number;
  data_entrada: string;
  data_saida: string;
  tempo_minutos: number;
  valor_total: string;
}

export interface MovimentacaoCreate {
  id_veiculo: number;
  id_vaga: number;
  data_entrada: string;
  data_saida: string;
  tempo_minutos: number;
  valor_total: number;
}

export interface MovimentacaoUpdate {
  id_veiculo?: number;
  id_vaga?: number;
  data_entrada?: string;
  data_saida?: string;
  tempo_minutos?: number;
  valor_total?: number;
}
