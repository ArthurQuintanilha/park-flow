import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardEstacionamento {
  id_estacionamento: number;
  estacionamento: string;
  tipo_veiculo: string;
  total_movimentacoes: string;
  total_veiculos_distintos: string;
  faturamento_total: string;
  ticket_medio: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private api: ApiService) {}

  listar(): Observable<DashboardEstacionamento[]> {
    return this.api.get<DashboardEstacionamento[]>('dashboard');
  }
}
