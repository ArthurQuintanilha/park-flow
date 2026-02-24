import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface VeiculoCarona {
  id_veiculo: number;
  marca: string;
  modelo: string;
  placa: string;
  cor: string | null;
  capacidade: number;
  id_usuario: number;
}

export interface VeiculoCaronaCreate {
  marca: string;
  modelo: string;
  placa: string;
  cor?: string;
  capacidade?: number;
  id_usuario: number;
}

export interface VeiculoCaronaUpdate {
  marca?: string;
  modelo?: string;
  placa?: string;
  cor?: string;
  capacidade?: number;
}

@Injectable({ providedIn: 'root' })
export class VeiculoCaronaService {
  private base = 'carona/veiculos';

  constructor(private api: ApiService) {}

  listar(): Observable<VeiculoCarona[]> {
    return this.api.get<VeiculoCarona[]>(this.base);
  }

  listarPorUsuario(idUsuario: number): Observable<VeiculoCarona[]> {
    return this.api.get<VeiculoCarona[]>(`${this.base}/usuario/${idUsuario}`);
  }

  buscarPorId(id: number): Observable<VeiculoCarona> {
    return this.api.get<VeiculoCarona>(`${this.base}/${id}`);
  }

  criar(dados: VeiculoCaronaCreate): Observable<VeiculoCarona> {
    return this.api.post<VeiculoCarona>(this.base, dados);
  }

  atualizar(id: number, dados: VeiculoCaronaUpdate): Observable<VeiculoCarona> {
    return this.api.put<VeiculoCarona>(`${this.base}/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`${this.base}/${id}`);
  }
}
