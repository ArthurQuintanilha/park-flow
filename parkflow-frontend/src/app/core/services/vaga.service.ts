import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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

@Injectable({
  providedIn: 'root'
})
export class VagaService {
  constructor(private api: ApiService) {}

  listar(): Observable<Vaga[]> {
    return this.api.get<Vaga[]>('vagas');
  }

  buscarPorId(id: number): Observable<Vaga> {
    return this.api.get<Vaga>(`vagas/${id}`);
  }

  criar(dados: VagaCreate): Observable<Vaga> {
    return this.api.post<Vaga>('vagas', dados);
  }

  atualizar(id: number, dados: VagaUpdate): Observable<Vaga> {
    return this.api.put<Vaga>(`vagas/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`vagas/${id}`);
  }
}
