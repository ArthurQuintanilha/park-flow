import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Pagamento {
  id_pagamento: number;
  id_movimentacao: number;
  forma_pagamento: string;
  data_pagamento: string;
}

export interface PagamentoCreate {
  id_movimentacao: number;
  forma_pagamento: string;
  data_pagamento: string;
}

export interface PagamentoUpdate {
  id_movimentacao?: number;
  forma_pagamento?: string;
  data_pagamento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  constructor(private api: ApiService) {}

  listar(): Observable<Pagamento[]> {
    return this.api.get<Pagamento[]>('pagamentos');
  }

  buscarPorMovimentacao(idMovimentacao: number): Observable<Pagamento[]> {
    return this.api.get<Pagamento[]>(`pagamentos/movimentacao/${idMovimentacao}`);
  }

  buscarPorId(id: number): Observable<Pagamento> {
    return this.api.get<Pagamento>(`pagamentos/${id}`);
  }

  criar(dados: PagamentoCreate): Observable<Pagamento> {
    return this.api.post<Pagamento>('pagamentos', dados);
  }

  atualizar(id: number, dados: PagamentoUpdate): Observable<Pagamento> {
    return this.api.put<Pagamento>(`pagamentos/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`pagamentos/${id}`);
  }
}
