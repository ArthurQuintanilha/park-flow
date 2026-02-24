import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Veiculo {
  id_veiculo: number;
  placa: string;
  marca: string;
  modelo: string;
  cor: string | null;
  id_tipo_veiculo: number;
  id_cliente: number;
}

export interface VeiculoCreate {
  placa: string;
  marca: string;
  modelo: string;
  cor?: string;
  id_tipo_veiculo: number;
  id_cliente: number;
}

export interface VeiculoUpdate {
  placa?: string;
  marca?: string;
  modelo?: string;
  cor?: string;
  id_tipo_veiculo?: number;
  id_cliente?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  constructor(private api: ApiService) {}

  listar(expand = false): Observable<Veiculo[]> {
    return this.api.get<Veiculo[]>('veiculos', expand ? { expand: 'true' } : undefined);
  }

  listarPorCliente(idCliente: number): Observable<Veiculo[]> {
    return this.api.get<Veiculo[]>(`veiculos/cliente/${idCliente}`);
  }

  buscarPorId(id: number, expand = false): Observable<Veiculo> {
    return this.api.get<Veiculo>(`veiculos/${id}`, expand ? { expand: 'true' } : undefined);
  }

  criar(dados: VeiculoCreate): Observable<Veiculo> {
    return this.api.post<Veiculo>('veiculos', dados);
  }

  atualizar(id: number, dados: VeiculoUpdate): Observable<Veiculo> {
    return this.api.put<Veiculo>(`veiculos/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`veiculos/${id}`);
  }
}
