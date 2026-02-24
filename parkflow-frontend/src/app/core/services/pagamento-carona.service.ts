import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PagamentoCarona {
  id_pagamento: number;
  valor: number;
  forma_pagamento: string;
  status: 'processando' | 'pago' | 'falhou';
  data_pagamento: string;
  id_solicitacao: number;
}

export interface PagamentoCaronaCreate {
  valor: number;
  forma_pagamento: string;
  id_solicitacao: number;
}

@Injectable({ providedIn: 'root' })
export class PagamentoCaronaService {
  private base = 'carona/pagamentos';

  constructor(private api: ApiService) {}

  listar(): Observable<PagamentoCarona[]> {
    return this.api.get<PagamentoCarona[]>(this.base);
  }

  buscarPorSolicitacao(idSolicitacao: number): Observable<PagamentoCarona> {
    return this.api.get<PagamentoCarona>(`${this.base}/solicitacao/${idSolicitacao}`);
  }

  buscarPorId(id: number): Observable<PagamentoCarona> {
    return this.api.get<PagamentoCarona>(`${this.base}/${id}`);
  }

  criar(dados: PagamentoCaronaCreate): Observable<PagamentoCarona> {
    return this.api.post<PagamentoCarona>(this.base, dados);
  }
}
