import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {
  constructor(private api: ApiService) {}

  listar(): Observable<Movimentacao[]> {
    return this.api.get<Movimentacao[]>('movimentacoes');
  }

  listarPorVeiculo(idVeiculo: number): Observable<Movimentacao[]> {
    return this.api.get<Movimentacao[]>(`movimentacoes/veiculo/${idVeiculo}`);
  }

  buscarPorId(id: number): Observable<Movimentacao> {
    return this.api.get<Movimentacao>(`movimentacoes/${id}`);
  }

  criar(dados: MovimentacaoCreate): Observable<Movimentacao> {
    return this.api.post<Movimentacao>('movimentacoes', dados);
  }

  atualizar(id: number, dados: MovimentacaoUpdate): Observable<Movimentacao> {
    return this.api.put<Movimentacao>(`movimentacoes/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`movimentacoes/${id}`);
  }
}
