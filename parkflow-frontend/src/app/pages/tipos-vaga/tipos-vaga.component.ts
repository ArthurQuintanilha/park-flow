import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TipoVagaService, TipoVaga } from '../../core/services/tipo-vaga.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-tipos-vaga',
  templateUrl: './tipos-vaga.component.html',
  styleUrls: ['./tipos-vaga.component.scss']
})
export class TiposVagaComponent implements OnInit {
  columns: DataTableColumn<TipoVaga>[] = [
    { key: 'id_tipo_vaga', label: 'ID', sortable: true },
    { key: 'descricao', label: 'Descrição' },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<TipoVaga>([]);
  form = { descricao: '' };
  editando: number | null = null;
  erro = '';

  constructor(
    public service: TipoVagaService,
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
          this.notification.sucesso('Tipo de vaga atualizado com sucesso!');
          this.limparForm();
          this.carregar();
        },
        error: (e) => (this.erro = e.error?.error || 'Erro ao atualizar')
      });
    } else {
      this.service.criar(d).subscribe({
        next: () => {
          this.notification.sucesso('Tipo de vaga criado com sucesso!');
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

  iniciarEdicao(item: TipoVaga): void {
    this.editando = item.id_tipo_vaga;
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
        this.notification.sucesso('Tipo de vaga excluído com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }
}
