import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteService, Cliente, ClienteCreate, ClienteUpdate } from '../../core/services/cliente.service';
import { TipoClienteService } from '../../core/services/tipo-cliente.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  columns: DataTableColumn<Cliente>[] = [
    { key: 'id_cliente', label: 'ID', sortable: true },
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'email', label: 'E-mail' },
    { key: 'tipo', label: 'Tipo', getValue: (c) => this.tipoDescricao(c) },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<Cliente>([]);
  tiposCliente: { id_tipo_cliente: number; descricao: string }[] = [];
  form: ClienteCreate = { nome: '', cpf: '', telefone: '', email: '', id_tipo_cliente: 0 };
  editando: number | null = null;
  erro = '';

  constructor(
    public clienteService: ClienteService,
    public tipoClienteService: TipoClienteService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.tipoClienteService.listar().subscribe({ next: (r) => (this.tiposCliente = r) });
    this.carregar();
  }

  carregar(): void {
    this.erro = '';
    this.clienteService.listar(true).subscribe({
      next: (r) => (this.dataSource.data = r as Cliente[]),
      error: (e) => (this.erro = e.error?.error || 'Erro ao carregar')
    });
  }

  tipoDescricao(c: Cliente): string {
    const t = (c as { tipo_cliente?: { descricao: string } }).tipo_cliente;
    return t?.descricao || '-';
  }

  salvar(): void {
    this.erro = '';
    // if (!this.form.nome.trim() || !this.form.cpf.trim() || !this.form.id_tipo_cliente) return;
    if (this.editando) {
      this.salvarEdicao(this.editando, this.form);
    } else {
      this.clienteService.criar(this.form).subscribe({
        next: () => {
          this.notification.sucesso('Cliente criado com sucesso!');
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
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      id_tipo_cliente: 0
    };
  }

  iniciarEdicao(item: Cliente): void {
    this.editando = item.id_cliente;
    this.form = {
      nome: item.nome,
      cpf: item.cpf,
      telefone: item.telefone || '',
      email: item.email || '',
      id_tipo_cliente: item.id_tipo_cliente
    };
    this.erro = '';
  }

  salvarEdicao(id: number, d: ClienteUpdate): void {
    this.erro = '';
    this.clienteService.atualizar(id, d).subscribe({
      next: () => {
        this.notification.sucesso('Cliente atualizado com sucesso!');
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
    if (!confirm('Excluir este cliente?')) return;
    this.clienteService.excluir(id).subscribe({
      next: () => {
        this.notification.sucesso('Cliente excluído com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }
}
