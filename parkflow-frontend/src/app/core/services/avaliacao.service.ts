import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Avaliacao {
  id_avaliacao: number;
  nota: number;
  comentario: string | null;
  data: string;
  id_avaliador: number;
  id_avaliado: number;
  avaliador_nome?: string;
  avaliado_nome?: string;
}

export interface AvaliacaoCreate {
  nota: number;
  comentario?: string;
  id_avaliador: number;
  id_avaliado: number;
}

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private base = 'carona/avaliacoes';

  constructor(private api: ApiService) {}

  listar(): Observable<Avaliacao[]> {
    return this.api.get<Avaliacao[]>(this.base);
  }

  listarPorAvaliado(idAvaliado: number): Observable<Avaliacao[]> {
    return this.api.get<Avaliacao[]>(`${this.base}/avaliado/${idAvaliado}`);
  }

  buscarPorId(id: number): Observable<Avaliacao> {
    return this.api.get<Avaliacao>(`${this.base}/${id}`);
  }

  criar(dados: AvaliacaoCreate): Observable<Avaliacao> {
    return this.api.post<Avaliacao>(this.base, dados);
  }
}
