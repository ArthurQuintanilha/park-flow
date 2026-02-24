import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TabelaPreco {
  id_preco: number;
  id_tipo_veiculo: number;
  valor_hora: string;
}

export interface TabelaPrecoCreate {
  id_tipo_veiculo: number;
  valor_hora: number;
}

export interface TabelaPrecoUpdate {
  id_tipo_veiculo?: number;
  valor_hora?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TabelaPrecoService {
  constructor(private api: ApiService) {}

  listar(): Observable<TabelaPreco[]> {
    return this.api.get<TabelaPreco[]>('tabela-preco');
  }

  buscarPorTipoVeiculo(idTipoVeiculo: number): Observable<TabelaPreco[]> {
    return this.api.get<TabelaPreco[]>(`tabela-preco/tipo-veiculo/${idTipoVeiculo}`);
  }

  buscarPorId(id: number): Observable<TabelaPreco> {
    return this.api.get<TabelaPreco>(`tabela-preco/${id}`);
  }

  criar(dados: TabelaPrecoCreate): Observable<TabelaPreco> {
    return this.api.post<TabelaPreco>('tabela-preco', dados);
  }

  atualizar(id: number, dados: TabelaPrecoUpdate): Observable<TabelaPreco> {
    return this.api.put<TabelaPreco>(`tabela-preco/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`tabela-preco/${id}`);
  }
}
