import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TabelaPrecoService, TabelaPreco, TabelaPrecoCreate, TabelaPrecoUpdate } from '../../core/services/tabela-preco.service';
import { TipoVeiculoService } from '../../core/services/tipo-veiculo.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-tabela-preco',
  templateUrl: './tabela-preco.component.html',
  styleUrls: ['./tabela-preco.component.scss']
})
export class TabelaPrecoComponent implements OnInit {
  columns: DataTableColumn<TabelaPreco>[] = [
    { key: 'id_preco', label: 'ID', sortable: true },
    { key: 'tipo_veiculo', label: 'Tipo veículo', getValue: (p) => this.tipoDescricao(p.id_tipo_veiculo) },
    { key: 'valor_hora', label: 'Valor/hora', getValue: (p) => 'R$ ' + (p.valor_hora ?? '-') },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<TabelaPreco>([]);
  tiposVeiculo: { id_tipo_veiculo: number; descricao: string }[] = [];
  tiposVeiculoSelect: { value: number; label: string }[] = [];
  form: TabelaPrecoCreate = { id_tipo_veiculo: 0, valor_hora: 0 };
  editando: number | null = null;
  erro = '';

  constructor(
    public tabelaPrecoService: TabelaPrecoService,
    public tipoVeiculoService: TipoVeiculoService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.tipoVeiculoService.listar().subscribe({
      next: (r) => {
        this.tiposVeiculo = r;
        this.tiposVeiculoSelect = r.map((t) => ({ value: t.id_tipo_veiculo, label: t.descricao }));
      }
    });
    this.carregar();
  }

  carregar(): void {
    this.erro = '';
    this.tabelaPrecoService.listar().subscribe({
      next: (r) => (this.dataSource.data = r),
      error: (e) => (this.erro = e.error?.error || 'Erro ao carregar')
    });
  }

  tipoDescricao(id: number): string {
    return this.tiposVeiculo.find((t) => t.id_tipo_veiculo === id)?.descricao || '-';
  }

  salvar(): void {
    this.erro = '';
    // if (!this.form.id_tipo_veiculo || this.form.valor_hora == null) return;
    if (this.editando) {
      this.salvarEdicao(this.editando, this.form);
    } else {
      this.tabelaPrecoService.criar(this.form).subscribe({
        next: () => {
          this.notification.sucesso('Preço cadastrado com sucesso!');
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
      id_tipo_veiculo: 0,
      valor_hora: 0
    };
  }

  iniciarEdicao(item: TabelaPreco): void {
    this.editando = item.id_preco;
    this.form = {
      id_tipo_veiculo: item.id_tipo_veiculo,
      valor_hora: Number(item.valor_hora) || 0
    };
    this.erro = '';
  }

  salvarEdicao(id: number, d: TabelaPrecoUpdate): void {
    this.erro = '';
    this.tabelaPrecoService.atualizar(id, d).subscribe({
      next: () => {
        this.notification.sucesso('Preço atualizado com sucesso!');
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
    if (!confirm('Excluir este preço?')) return;
    this.tabelaPrecoService.excluir(id).subscribe({
      next: () => {
        this.notification.sucesso('Preço excluído com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }
}
