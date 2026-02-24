import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Carona {
  id_carona: number;
  origem: string;
  destino: string;
  data: string;
  horario: string;
  vagas: number;
  status: 'ativa' | 'concluida' | 'cancelada';
  id_motorista: number;
  id_veiculo: number;
  motorista_nome?: string;
  motorista_telefone?: string;
  marca?: string;
  modelo?: string;
  placa?: string;
  cor?: string;
  capacidade?: number;
}

export interface CaronaCreate {
  origem: string;
  destino: string;
  data: string;
  horario: string;
  vagas: number;
  id_motorista: number;
  id_veiculo: number;
}

export interface CaronaUpdate {
  origem?: string;
  destino?: string;
  data?: string;
  horario?: string;
  vagas?: number;
  status?: 'ativa' | 'concluida' | 'cancelada';
}

@Injectable({ providedIn: 'root' })
export class CaronaService {
  private base = 'carona/caronas';

  constructor(private api: ApiService) {}

  listar(filtros?: { origem?: string; destino?: string; data?: string; status?: string }): Observable<Carona[]> {
    const params: Record<string, string> = {};
    if (filtros?.origem) params['origem'] = filtros.origem;
    if (filtros?.destino) params['destino'] = filtros.destino;
    if (filtros?.data) params['data'] = filtros.data;
    if (filtros?.status) params['status'] = filtros.status;
    return this.api.get<Carona[]>(this.base, Object.keys(params).length ? params : undefined);
  }

  listarPorMotorista(idMotorista: number): Observable<Carona[]> {
    return this.api.get<Carona[]>(`${this.base}/motorista/${idMotorista}`);
  }

  buscarPorId(id: number): Observable<Carona> {
    return this.api.get<Carona>(`${this.base}/${id}`);
  }

  criar(dados: CaronaCreate): Observable<Carona> {
    return this.api.post<Carona>(this.base, dados);
  }

  atualizar(id: number, dados: CaronaUpdate): Observable<Carona> {
    return this.api.put<Carona>(`${this.base}/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.api.delete(`${this.base}/${id}`);
  }
}
