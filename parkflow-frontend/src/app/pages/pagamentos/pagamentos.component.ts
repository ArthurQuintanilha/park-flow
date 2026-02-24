import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PagamentoService, Pagamento, PagamentoCreate, PagamentoUpdate } from '../../core/services/pagamento.service';
import { MovimentacaoService } from '../../core/services/movimentacao.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss']
})
export class PagamentosComponent implements OnInit {
  columns: DataTableColumn<Pagamento>[] = [
    { key: 'id_pagamento', label: 'ID', sortable: true },
    { key: 'id_movimentacao', label: 'Movimentação', getValue: (p) => '#' + p.id_movimentacao },
    { key: 'forma_pagamento', label: 'Forma' },
    { key: 'data_pagamento', label: 'Data', getValue: (p) => this.formatarDataExibicao(p.data_pagamento) },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<Pagamento>([]);
  movimentacoesSelect: { value: number; label: string }[] = [];
  formasPagamento: { value: string; label: string }[] = [
    { value: 'PIX', label: 'PIX' },
    { value: 'Dinheiro', label: 'Dinheiro' },
    { value: 'Cartão crédito', label: 'Cartão crédito' },
    { value: 'Cartão débito', label: 'Cartão débito' }
  ];
  form: PagamentoCreate = { id_movimentacao: 0, forma_pagamento: '', data_pagamento: '' };
  editando: number | null = null;
  erro = '';

  constructor(
    public pagamentoService: PagamentoService,
    public movimentacaoService: MovimentacaoService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.movimentacaoService.listar().subscribe({
      next: (r) => {
        this.movimentacoesSelect = r.map((m) => ({ value: m.id_movimentacao, label: '#' + m.id_movimentacao }));
      }
    });
    this.carregar();
  }

  private formatarDataExibicao(d: string): string {
    if (!d) return '-';
    return d.slice(0, 19).replace('T', ' ');
  }

  carregar(): void {
    this.erro = '';
    this.pagamentoService.listar().subscribe({
      next: (r) => (this.dataSource.data = r),
      error: (e) => (this.erro = e.error?.error || 'Erro ao carregar')
    });
  }

  salvar(): void {
    this.erro = '';
    // if (!this.form.id_movimentacao || !this.form.forma_pagamento.trim() || !this.form.data_pagamento) return;
    const dt = this.form.data_pagamento.replace('T', ' ');
    const payload = { ...this.form, data_pagamento: dt.length === 16 ? dt + ':00' : dt };
    if (this.editando) {
      this.salvarEdicao(this.editando, payload);
    } else {
      this.pagamentoService.criar(payload).subscribe({
        next: () => {
          this.notification.sucesso('Pagamento criado com sucesso!');
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
      id_movimentacao: 0,
      forma_pagamento: '',
      data_pagamento:''
    };
    this.erro = '';
  }

  iniciarEdicao(item: Pagamento): void {
    this.editando = item.id_pagamento;
    this.form = {
      id_movimentacao: item.id_movimentacao,
      forma_pagamento: item.forma_pagamento,
      data_pagamento: this.toDatetimeLocal(item.data_pagamento)
    };
    this.erro = '';
  }

  private toDatetimeLocal(s: string): string {
    if (!s) return '';
    return s.slice(0, 16);
  }

  salvarEdicao(id: number, d: PagamentoUpdate): void {
    this.erro = '';
    const dt = (d.data_pagamento ?? '').replace('T', ' ');
    const payload = { ...d, data_pagamento: dt.length === 16 ? dt + ':00' : dt };
    this.pagamentoService.atualizar(id, payload).subscribe({
      next: () => {
        this.notification.sucesso('Pagamento atualizado com sucesso!');
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
    if (!confirm('Excluir este pagamento?')) return;
    this.pagamentoService.excluir(id).subscribe({
      next: () => {
        this.notification.sucesso('Pagamento excluído com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }
}
