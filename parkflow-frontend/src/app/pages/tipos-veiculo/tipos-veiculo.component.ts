import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TipoVeiculoService, TipoVeiculo } from '../../core/services/tipo-veiculo.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-tipos-veiculo',
  templateUrl: './tipos-veiculo.component.html',
  styleUrls: ['./tipos-veiculo.component.scss']
})
export class TiposVeiculoComponent implements OnInit {
  columns: DataTableColumn<TipoVeiculo>[] = [
    { key: 'id_tipo_veiculo', label: 'ID', sortable: true },
    { key: 'descricao', label: 'Descrição' },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<TipoVeiculo>([]);
  form = { descricao: '' };
  editando: number | null = null;
  erro = '';

  constructor(
    public service: TipoVeiculoService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.erro = '';
    this.service.listar().subscribe({
      next: (r) => (this.dataSource.data = r),
      error: (e) => (this.erro = e.error?.error || 'Erro ao carregar')
    });
  }

  salvar(): void {
    this.erro = '';
    const d = this.form.descricao.trim();
    // if (!d) return;
    if (this.editando) {
      this.service.atualizar(this.editando, d).subscribe({
        next: () => {
          this.notification.sucesso('Tipo de veículo atualizado com sucesso!');
          this.limparForm();
          this.carregar();
        },
        error: (e) => (this.erro = e.error?.error || 'Erro ao atualizar')
      });
    } else {
      this.service.criar(d).subscribe({
        next: () => {
          this.notification.sucesso('Tipo de veículo criado com sucesso!');
          this.limparForm();
          this.carregar();
        },
        error: (e) => (this.erro = e.error?.error || 'Erro ao criar')
      });
    }
  }

  private limparForm(): void {
    this.editando = null;
    this.form = { descricao: '' };
  }

  iniciarEdicao(item: TipoVeiculo): void {
    this.editando = item.id_tipo_veiculo;
    this.form = { descricao: item.descricao };
    this.erro = '';
  }

  onFormKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.salvar();
  }

  cancelarEdicao(): void {
    this.erro = '';
    this.limparForm();
  }

  excluir(id: number): void {
    this.erro = '';
    if (!confirm('Excluir este tipo?')) return;
    this.service.excluir(id).subscribe({
      next: () => {
        this.notification.sucesso('Tipo de veículo excluído com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }
}
