import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_usuario: 'motorista' | 'passageiro' | 'ambos';
}

export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  tipo_usuario?: 'motorista' | 'passageiro' | 'ambos';
}

export interface UsuarioUpdate {
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  tipo_usuario?: 'motorista' | 'passageiro' | 'ambos';
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private base = 'carona/usuarios';

  constructor(private api: ApiService) {}

  listar(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>(this.base);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.api.get<Usuario>(`${this.base}/${id}`);
  }

  buscarPorEmail(email: string): Observable<Usuario> {
    return this.api.get<Usuario>(`${this.base}/email/${encodeURIComponent(email)}`);
  }

  criar(dados: UsuarioCreate): Observable<Usuario> {
    return this.api.post<Usuario>(this.base, dados);
  }

  atualizar(id: number, dados: UsuarioUpdate): Observable<Usuario> {
    return this.api.put<Usuario>(`${this.base}/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`${this.base}/${id}`);
  }
}
