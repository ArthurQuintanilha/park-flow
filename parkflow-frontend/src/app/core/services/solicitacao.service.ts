import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Solicitacao {
  id_solicitacao: number;
  data_solicitacao: string;
  status: 'pendente' | 'aceita' | 'recusada';
  id_carona: number;
  id_passageiro: number;
  origem?: string;
  destino?: string;
  data?: string;
  horario?: string;
  passageiro_nome?: string;
  passageiro_telefone?: string;
  passageiro_email?: string;
  motorista_nome?: string;
}

export interface SolicitacaoCreate {
  id_carona: number;
  id_passageiro: number;
}

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private base = 'carona/solicitacoes';

  constructor(private api: ApiService) {}

  listar(): Observable<Solicitacao[]> {
    return this.api.get<Solicitacao[]>(this.base);
  }

  listarPorCarona(idCarona: number): Observable<Solicitacao[]> {
    return this.api.get<Solicitacao[]>(`${this.base}/carona/${idCarona}`);
  }

  listarPorPassageiro(idPassageiro: number): Observable<Solicitacao[]> {
    return this.api.get<Solicitacao[]>(`${this.base}/passageiro/${idPassageiro}`);
  }

  buscarPorId(id: number): Observable<Solicitacao> {
    return this.api.get<Solicitacao>(`${this.base}/${id}`);
  }

  criar(dados: SolicitacaoCreate): Observable<Solicitacao> {
    return this.api.post<Solicitacao>(this.base, dados);
  }

  atualizarStatus(id: number, status: 'pendente' | 'aceita' | 'recusada'): Observable<Solicitacao> {
    return this.api.put<Solicitacao>(`${this.base}/${id}`, { status });
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`${this.base}/${id}`);
  }
}
