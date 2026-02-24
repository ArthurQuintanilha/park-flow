import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TipoCliente {
  id_tipo_cliente: number;
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoClienteService {
  constructor(private api: ApiService) {}

  listar(): Observable<TipoCliente[]> {
    return this.api.get<TipoCliente[]>('tipos-cliente');
  }

  buscarPorId(id: number): Observable<TipoCliente> {
    return this.api.get<TipoCliente>(`tipos-cliente/${id}`);
  }

  criar(descricao: string): Observable<TipoCliente> {
    return this.api.post<TipoCliente>('tipos-cliente', { descricao });
  }

  atualizar(id: number, descricao: string): Observable<TipoCliente> {
    return this.api.put<TipoCliente>(`tipos-cliente/${id}`, { descricao });
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`tipos-cliente/${id}`);
  }
}
