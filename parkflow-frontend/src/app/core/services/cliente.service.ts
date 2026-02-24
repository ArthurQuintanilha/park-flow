import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  id_tipo_cliente: number;
}

export interface ClienteCreate {
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  id_tipo_cliente: number;
}

export interface ClienteUpdate {
  nome?: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  id_tipo_cliente?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(private api: ApiService) {}

  listar(expand = false): Observable<Cliente[]> {
    return this.api.get<Cliente[]>('clientes', expand ? { expand: 'true' } : undefined);
  }

  buscarPorId(id: number, expand = false): Observable<Cliente> {
    return this.api.get<Cliente>(`clientes/${id}`, expand ? { expand: 'true' } : undefined);
  }

  criar(dados: ClienteCreate): Observable<Cliente> {
    return this.api.post<Cliente>('clientes', dados);
  }

  atualizar(id: number, dados: ClienteUpdate): Observable<Cliente> {
    return this.api.put<Cliente>(`clientes/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`clientes/${id}`);
  }
}
