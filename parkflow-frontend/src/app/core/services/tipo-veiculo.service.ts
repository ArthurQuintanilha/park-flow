import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TipoVeiculo {
  id_tipo_veiculo: number;
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoVeiculoService {
  constructor(private api: ApiService) {}

  listar(): Observable<TipoVeiculo[]> {
    return this.api.get<TipoVeiculo[]>('tipos-veiculo');
  }

  buscarPorId(id: number): Observable<TipoVeiculo> {
    return this.api.get<TipoVeiculo>(`tipos-veiculo/${id}`);
  }

  criar(descricao: string): Observable<TipoVeiculo> {
    return this.api.post<TipoVeiculo>('tipos-veiculo', { descricao });
  }

  atualizar(id: number, descricao: string): Observable<TipoVeiculo> {
    return this.api.put<TipoVeiculo>(`tipos-veiculo/${id}`, { descricao });
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`tipos-veiculo/${id}`);
  }
}
