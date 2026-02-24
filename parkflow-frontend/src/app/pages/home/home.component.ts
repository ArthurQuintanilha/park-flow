import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService, DashboardEstacionamento } from '../../core/services/dashboard.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = true;
  erro = '';
  dados: DashboardEstacionamento[] = [];
  dataSource = new MatTableDataSource<DashboardEstacionamento>([]);
  columns: DataTableColumn<DashboardEstacionamento>[] = [
    { key: 'id_estacionamento', label: 'ID Estacionamento', sortable: true },
    { key: 'estacionamento', label: 'Estacionamento', sortable: true },
    { key: 'tipo_veiculo', label: 'Tipo de Veículo', sortable: true },
    { key: 'total_movimentacoes', label: 'Total Movimentações', sortable: true },
    { key: 'total_veiculos_distintos', label: 'Total Veículos Distintos', sortable: true },
    { key: 'faturamento_total', label: 'Faturamento Total', getValue: (r) => this.formatarValorMoeda(r.faturamento_total) },
    { key: 'ticket_medio', label: 'Ticket Médio', getValue: (r) => this.formatarValorMoeda(r.ticket_medio) },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.erro = '';
    this.dashboardService.listar().subscribe({
      next: (lista) => {
        this.dados = lista;
        this.dataSource.data = lista;
        this.loading = false;
      },
      error: (err) => {
        this.erro = err?.error?.message || err?.message || 'Erro ao carregar dados do dashboard.';
        this.loading = false;
      },
    });
  }

  private parseNum(v: string | number | null | undefined): number {
    if (v == null || v === '') return 0;
    const n = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : Number(v);
    return isNaN(n) ? 0 : n;
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  formatarValorMoeda(v: string | number | null | undefined): string {
    const n = this.parseNum(v);
    return n === 0 && (v == null || v === '') ? '-' : this.formatarMoeda(n);
  }
}
