import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TipoVaga {
  id_tipo_vaga: number;
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoVagaService {
  constructor(private api: ApiService) {}

  listar(): Observable<TipoVaga[]> {
    return this.api.get<TipoVaga[]>('tipos-vaga');
  }

  buscarPorId(id: number): Observable<TipoVaga> {
    return this.api.get<TipoVaga>(`tipos-vaga/${id}`);
  }

  criar(descricao: string): Observable<TipoVaga> {
    return this.api.post<TipoVaga>('tipos-vaga', { descricao });
  }

  atualizar(id: number, descricao: string): Observable<TipoVaga> {
    return this.api.put<TipoVaga>(`tipos-vaga/${id}`, { descricao });
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`tipos-vaga/${id}`);
  }
}
