import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Estacionamento {
  id_estacionamento: number;
  nome: string;
  endereco: string;
  cidade: string;
}

export interface EstacionamentoCreate {
  nome: string;
  endereco: string;
  cidade: string;
}

export interface EstacionamentoUpdate {
  nome?: string;
  endereco?: string;
  cidade?: string;
}

export interface VagaComTipo {
  id_vaga: number;
  numero: number;
  id_tipo_vaga: number;
  id_estacionamento: number;
  tipo_vaga_descricao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EstacionamentoService {
  constructor(private api: ApiService) {}

  listar(): Observable<Estacionamento[]> {
    return this.api.get<Estacionamento[]>('estacionamentos');
  }

  buscarPorId(id: number): Observable<Estacionamento> {
    return this.api.get<Estacionamento>(`estacionamentos/${id}`);
  }

  listarVagas(idEstacionamento: number): Observable<VagaComTipo[]> {
    return this.api.get<VagaComTipo[]>(`estacionamentos/${idEstacionamento}/vagas`);
  }

  criar(dados: EstacionamentoCreate): Observable<Estacionamento> {
    return this.api.post<Estacionamento>('estacionamentos', dados);
  }

  atualizar(id: number, dados: EstacionamentoUpdate): Observable<Estacionamento> {
    return this.api.put<Estacionamento>(`estacionamentos/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`estacionamentos/${id}`);
  }
}
