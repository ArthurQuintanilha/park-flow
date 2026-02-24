import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MovimentacaoService, Movimentacao, MovimentacaoCreate, MovimentacaoUpdate } from '../../core/services/movimentacao.service';
import { VeiculoService, Veiculo } from '../../core/services/veiculo.service';
import { VagaService } from '../../core/services/vaga.service';
import { TabelaPrecoService, TabelaPreco } from '../../core/services/tabela-preco.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-movimentacoes',
  templateUrl: './movimentacoes.component.html',
  styleUrls: ['./movimentacoes.component.scss']
})
export class MovimentacoesComponent implements OnInit {
  columns: DataTableColumn<Movimentacao>[] = [
    { key: 'id_movimentacao', label: 'ID', sortable: true },
    { key: 'veiculo', label: 'Veículo', getValue: (m) => this.veiculoPlaca(m.id_veiculo) },
    { key: 'vaga', label: 'Vaga', getValue: (m) => this.vagaNumero(m.id_vaga) },
    { key: 'data_entrada', label: 'Entrada', getValue: (m) => this.formatarDataExibicao(m.data_entrada) },
    { key: 'data_saida', label: 'Saída', getValue: (m) => this.formatarDataExibicao(m.data_saida) },
    { key: 'tempo_minutos', label: 'Minutos' },
    { key: 'valor_total', label: 'Valor', getValue: (m) => 'R$ ' + (m.valor_total ?? '-') },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<Movimentacao>([]);
  veiculos: Veiculo[] = [];
  veiculosSelect: { value: number; label: string }[] = [];
  vagas: { id_vaga: number; numero: number }[] = [];
  tabelaPrecos: TabelaPreco[] = [];
  vagasSelect: { value: number; label: string }[] = [];
  form: MovimentacaoCreate = {
    id_veiculo: 0,
    id_vaga: 0,
    data_entrada: '',
    data_saida: '',
    tempo_minutos: 0,
    valor_total: 0
  };
  editando: number | null = null;
  erro = '';

  constructor(
    public movimentacaoService: MovimentacaoService,
    public veiculoService: VeiculoService,
    public vagaService: VagaService,
    private tabelaPrecoService: TabelaPrecoService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.veiculoService.listar().subscribe({
      next: (r) => {
        this.veiculos = r;
        this.veiculosSelect = r.map((v) => ({ value: v.id_veiculo, label: v.placa }));
      }
    });
    this.tabelaPrecoService.listar().subscribe({ next: (r) => (this.tabelaPrecos = r) });
    this.vagaService.listar().subscribe({
      next: (r) => {
        this.vagas = r;
        this.vagasSelect = r.map((v) => ({ value: v.id_vaga, label: 'Vaga ' + v.numero }));
      }
    });
    this.carregar();
  }

  private formatarDataExibicao(d: string): string {
    if (!d) return '-';
    return d.slice(0, 19).replace('T', ' ');
  }

  veiculoPlaca(id: number): string {
    return this.veiculos.find((v) => v.id_veiculo === id)?.placa || '-';
  }

  vagaNumero(id: number): string {
    const v = this.vagas.find((x) => x.id_vaga === id);
    return v != null ? 'Vaga ' + v.numero : '-';
  }

  recalcularTempoEValor(): void {
    setTimeout(() => this._recalcular(), 0);
  }

  private _recalcular(): void {
    const entrada = this.form.data_entrada;
    const saida = this.form.data_saida;
    if (!entrada || !saida) return;

    const dEntrada = new Date(entrada);
    const dSaida = new Date(saida);
    const diffMs = dSaida.getTime() - dEntrada.getTime();
    const tempoMinutos = Math.max(0, Math.round(diffMs / 60000));
    this.form.tempo_minutos = tempoMinutos;

    const veiculo = this.veiculos.find((v) => v.id_veiculo === this.form.id_veiculo);
    const preco = this.tabelaPrecos.find((p) => p.id_tipo_veiculo === veiculo?.id_tipo_veiculo);
    const valorHora = preco ? Number(preco.valor_hora) : 0;
    this.form.valor_total = Math.round((tempoMinutos / 60) * valorHora * 100) / 100;
  }

  carregar(): void {
    this.erro = '';
    this.movimentacaoService.listar().subscribe({
      next: (r) => (this.dataSource.data = r),
      error: (e) => (this.erro = e.error?.error || 'Erro ao carregar')
    });
  }

  salvar(): void {
    this.erro = '';
    // if (!this.form.id_veiculo || !this.form.id_vaga) return;
    if (this.editando) {
      this.salvarEdicao(this.editando, this.form);
    } else {
      this.movimentacaoService.criar(this.form).subscribe({
        next: () => {
          this.notification.sucesso('Movimentação registrada com sucesso!');
          this.limparForm();
          this.carregar();
        },
        error: (e) => (this.erro = e.error?.error || 'Erro ao criar')
      });
    }
  }

  private limparForm(): void {
    this.editando = null;
    this.form = {
      id_veiculo: 0,
      id_vaga: 0,
      data_entrada: '',
      data_saida: '',
      tempo_minutos: 0,
      valor_total: 0
    };
  }

  iniciarEdicao(item: Movimentacao): void {
    this.editando = item.id_movimentacao;
    this.form = {
      id_veiculo: item.id_veiculo,
      id_vaga: item.id_vaga,
      data_entrada: this.toDatetimeLocal(item.data_entrada),
      data_saida: this.toDatetimeLocal(item.data_saida),
      tempo_minutos: item.tempo_minutos,
      valor_total: Number(item.valor_total) || 0
    };
    this.erro = '';
  }

  private toDatetimeLocal(s: string): string {
    if (!s) return '';
    return s.slice(0, 16);
  }

  salvarEdicao(id: number, d: MovimentacaoUpdate): void {
    this.erro = '';
    this.movimentacaoService.atualizar(id, d).subscribe({
      next: () => {
        this.notification.sucesso('Movimentação atualizada com sucesso!');
        this.limparForm();
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao atualizar')
    });
  }

  cancelarEdicao(): void {
    this.erro = '';
    this.limparForm();
  }

  excluir(id: number): void {
    this.erro = '';
    if (!confirm('Excluir esta movimentação?')) return;
    this.movimentacaoService.excluir(id).subscribe({
      next: () => {
        this.notification.sucesso('Movimentação excluída com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }
}
