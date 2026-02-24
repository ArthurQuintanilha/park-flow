import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { VagaService, Vaga, VagaCreate, VagaUpdate } from '../../core/services/vaga.service';
import { TipoVagaService } from '../../core/services/tipo-vaga.service';
import { EstacionamentoService } from '../../core/services/estacionamento.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-vagas',
  templateUrl: './vagas.component.html',
  styleUrls: ['./vagas.component.scss']
})
export class VagasComponent implements OnInit {
  columns: DataTableColumn<Vaga>[] = [
    { key: 'id_vaga', label: 'ID', sortable: true },
    { key: 'numero', label: 'Número' },
    { key: 'tipo', label: 'Tipo', getValue: (v) => this.tipoDescricao(v.id_tipo_vaga) },
    { key: 'estacionamento', label: 'Estacionamento', getValue: (v) => this.estacionamentoNome(v.id_estacionamento) },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<Vaga>([]);
  tiposVaga: { id_tipo_vaga: number; descricao: string }[] = [];
  estacionamentos: { id_estacionamento: number; nome: string }[] = [];
  form: VagaCreate = { numero: 0, id_tipo_vaga: 0, id_estacionamento: 0 };
  editando: number | null = null;
  erro = '';

  constructor(
    public vagaService: VagaService,
    public tipoVagaService: TipoVagaService,
    public estacionamentoService: EstacionamentoService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.tipoVagaService.listar().subscribe({ next: (r) => (this.tiposVaga = r) });
    this.estacionamentoService.listar().subscribe({ next: (r) => (this.estacionamentos = r) });
    this.carregar();
  }

  carregar(): void {
    this.erro = '';
    this.vagaService.listar().subscribe({
      next: (r) => (this.dataSource.data = r),
      error: (e) => (this.erro = e.error?.error || 'Erro ao carregar')
    });
  }

  tipoDescricao(id: number): string {
    return this.tiposVaga.find((t) => t.id_tipo_vaga === id)?.descricao || '-';
  }

  estacionamentoNome(id: number): string {
    return this.estacionamentos.find((e) => e.id_estacionamento === id)?.nome || '-';
  }

  salvar(): void {
    this.erro = '';
    // if (!this.form.numero || !this.form.id_tipo_vaga || !this.form.id_estacionamento) return;
    if (this.editando) {
      this.salvarEdicao(this.editando, this.form);
    } else {
      this.vagaService.criar(this.form).subscribe({
        next: () => {
          this.notification.sucesso('Vaga criada com sucesso!');
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
      numero: 0,
      id_tipo_vaga: this.tiposVaga[0]?.id_tipo_vaga || 0,
      id_estacionamento: 0
    };
  }

  iniciarEdicao(item: Vaga): void {
    this.editando = item.id_vaga;
    this.form = {
      numero: item.numero,
      id_tipo_vaga: item.id_tipo_vaga,
      id_estacionamento: item.id_estacionamento
    };
    this.erro = '';
  }

  salvarEdicao(id: number, d: VagaUpdate): void {
    this.erro = '';
    this.vagaService.atualizar(id, d).subscribe({
      next: () => {
        this.notification.sucesso('Vaga atualizada com sucesso!');
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
    if (!confirm('Excluir esta vaga?')) return;
    this.vagaService.excluir(id).subscribe({
      next: () => {
        this.notification.sucesso('Vaga excluída com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }
}
