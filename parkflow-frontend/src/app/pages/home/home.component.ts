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
  chartOptions: any = {};
  chartOptionsFaturamento: any = {};
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
        this.atualizarGraficos();
        this.loading = false;
      },
      error: (err) => {
        this.erro = err?.error?.message || err?.message || 'Erro ao carregar dados do dashboard.';
        this.loading = false;
      },
    });
  }

  get totalMovimentacoes(): number {
    return this.dados.reduce((acc, r) => acc + this.parseNum(r.total_movimentacoes), 0);
  }

  get totalVeiculosDistintos(): number {
    return this.dados.reduce((acc, r) => acc + this.parseNum(r.total_veiculos_distintos), 0);
  }

  get totalFaturamento(): number {
    return this.dados.reduce((acc, r) => acc + this.parseNum(r.faturamento_total), 0);
  }

  get ticketMedioGeral(): number {
    const mov = this.totalMovimentacoes;
    return mov > 0 ? this.totalFaturamento / mov : 0;
  }

  get quantidadeEstacionamentos(): number {
    const ids = new Set(this.dados.map((r) => r.id_estacionamento));
    return ids.size;
  }

  private atualizarGraficos(): void {
    const porEstacionamento = this.agruparPorEstacionamento();
    const labels = porEstacionamento.map((e) => e.nome);
    const faturamentos = porEstacionamento.map((e) => e.faturamento);
    const movimentacoes = porEstacionamento.map((e) => e.movimentacoes);

    this.chartOptionsFaturamento = {
      series: [{ name: 'Faturamento', data: faturamentos }],
      chart: { type: 'bar', height: 260, toolbar: { show: false } },
      plotOptions: {
        bar: {
          borderRadius: 6,
          distributed: true,
          columnWidth: '60%',
        },
      },
      colors: ['#1A4C7F', '#00AACC', '#0d6efd', '#198754', '#fd7e14'],
      dataLabels: { enabled: false },
      xaxis: { categories: labels },
      legend: { show: false },
      tooltip: {
        y: {
          formatter: (val: number) => this.formatarMoeda(val),
        },
      },
    };

    const porTipo = this.agruparPorTipoVeiculo();
    this.chartOptions = {
      series: porTipo.map((t) => t.movimentacoes),
      chart: { type: 'donut', height: 260 },
      labels: porTipo.map((t) => t.tipo),
      colors: ['#1A4C7F', '#00AACC', '#0d6efd', '#198754', '#fd7e14'],
      legend: { position: 'bottom' },
      plotOptions: {
        pie: {
          donut: {
            size: '55%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Movimentações',
                formatter: () => this.totalMovimentacoes.toLocaleString('pt-BR'),
              },
            },
          },
        },
      },
    };
  }

  private agruparPorEstacionamento(): { nome: string; faturamento: number; movimentacoes: number }[] {
    const map = new Map<number, { nome: string; faturamento: number; movimentacoes: number }>();
    for (const r of this.dados) {
      const fat = this.parseNum(r.faturamento_total);
      const mov = this.parseNum(r.total_movimentacoes);
      const exist = map.get(r.id_estacionamento);
      if (exist) {
        exist.faturamento += fat;
        exist.movimentacoes += mov;
      } else {
        map.set(r.id_estacionamento, { nome: r.estacionamento, faturamento: fat, movimentacoes: mov });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.faturamento - a.faturamento);
  }

  private agruparPorTipoVeiculo(): { tipo: string; movimentacoes: number }[] {
    const map = new Map<string, number>();
    for (const r of this.dados) {
      const mov = this.parseNum(r.total_movimentacoes);
      const atual = map.get(r.tipo_veiculo) ?? 0;
      map.set(r.tipo_veiculo, atual + mov);
    }
    return Array.from(map.entries())
      .map(([tipo, movimentacoes]) => ({ tipo, movimentacoes }))
      .sort((a, b) => b.movimentacoes - a.movimentacoes);
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
