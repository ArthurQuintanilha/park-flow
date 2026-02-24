import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EstacionamentoService, Estacionamento, EstacionamentoCreate, VagaComTipo } from '../../core/services/estacionamento.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-estacionamentos',
  templateUrl: './estacionamentos.component.html',
  styleUrls: ['./estacionamentos.component.scss']
})
export class EstacionamentosComponent implements OnInit {
  columns: DataTableColumn<Estacionamento>[] = [
    { key: 'id_estacionamento', label: 'ID', sortable: true },
    { key: 'nome', label: 'Nome' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<Estacionamento>([]);
  vagasPorEstacionamento: Record<number, VagaComTipo[]> = {};
  form: EstacionamentoCreate = { nome: '', endereco: '', cidade: '' } as EstacionamentoCreate;
  editando: number | null = null;
  vagasAbertas: number | null = null;
  erro = '';

  expandedRowWhen = (index: number, row: Estacionamento) => this.vagasAbertas === row.id_estacionamento;

  constructor(
    public service: EstacionamentoService,
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
    // if (!this.form.nome.trim() || !this.form.endereco.trim() || !this.form.cidade.trim()) return;
    if (this.editando) {
      this.service.atualizar(this.editando, this.form).subscribe({
        next: () => {
          this.notification.sucesso('Estacionamento atualizado com sucesso!');
          this.limparForm();
          this.carregar();
        },
        error: (e) => (this.erro = e.error?.error || 'Erro ao atualizar')
      });
    } else {
      this.service.criar(this.form).subscribe({
        next: () => {
          this.notification.sucesso('Estacionamento criado com sucesso!');
          this.limparForm();
          this.carregar();
        },
        error: (e) => (this.erro = e.error?.error || 'Erro ao criar')
      });
    }
  }

  private limparForm(): void {
    this.editando = null;
    this.form = { nome: '', endereco: '', cidade: '' };

    this.erro = '';
  }

  iniciarEdicao(item: Estacionamento): void {
    this.editando = item.id_estacionamento;
    this.form = { nome: item.nome, endereco: item.endereco, cidade: item.cidade };
    this.erro = '';
  }

  cancelarEdicao(): void {
    this.limparForm();
  }

  excluir(id: number): void {
    this.erro = '';
    if (!confirm('Excluir este estacionamento?')) return;
    this.service.excluir(id).subscribe({
      next: () => {
        this.notification.sucesso('Estacionamento excluído com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }

  verVagas(id: number): void {
    if (this.vagasAbertas === id) {
      this.vagasAbertas = null;
      this.triggerTableRefresh();
      return;
    }
    this.vagasAbertas = id;
    this.triggerTableRefresh();
    this.service.listarVagas(id).subscribe({
      next: (v) => {
        this.vagasPorEstacionamento[id] = v;
        this.triggerTableRefresh();
      },
      error: () => {
        this.vagasPorEstacionamento[id] = [];
        this.triggerTableRefresh();
      }
    });
  }

  private triggerTableRefresh(): void {
    this.dataSource.data = [...this.dataSource.data];
  }
}
