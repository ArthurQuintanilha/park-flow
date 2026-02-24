import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { VeiculoService, Veiculo, VeiculoCreate } from '../../core/services/veiculo.service';
import { TipoVeiculoService } from '../../core/services/tipo-veiculo.service';
import { ClienteService } from '../../core/services/cliente.service';
import { NotificationService } from '../../core/services/notification.service';
import { DataTableColumn } from '../../shared/data-table/data-table-column.interface';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.scss']
})
export class VeiculosComponent implements OnInit {
  columns: DataTableColumn<Veiculo>[] = [
    { key: 'id_veiculo', label: 'ID', sortable: true },
    { key: 'placa', label: 'Placa' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'cor', label: 'Cor' },
    { key: 'tipo', label: 'Tipo', getValue: (v) => this.tipoDescricao(v) },
    { key: 'cliente', label: 'Cliente', getValue: (v) => this.clienteNome(v) },
    { key: 'acoes', label: 'Ações' }
  ];
  dataSource = new MatTableDataSource<Veiculo>([]);
  tiposVeiculo: { id_tipo_veiculo: number; descricao: string }[] = [];
  clientes: { id_cliente: number; nome: string }[] = [];
  form: VeiculoCreate = { placa: '', marca: '', modelo: '', cor: '', id_tipo_veiculo: 0, id_cliente: 0 };
  erro = '';

  constructor(
    public veiculoService: VeiculoService,
    public tipoVeiculoService: TipoVeiculoService,
    public clienteService: ClienteService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.tipoVeiculoService.listar().subscribe({ next: (r) => (this.tiposVeiculo = r) });
    this.clienteService.listar().subscribe({ next: (r) => (this.clientes = r) });
    this.carregar();
  }

  carregar(): void {
    this.erro = '';
    this.veiculoService.listar(true).subscribe({
      next: (r) => (this.dataSource.data = r as Veiculo[]),
      error: (e) => (this.erro = e.error?.error || 'Erro ao carregar')
    });
  }

  tipoDescricao(v: Veiculo): string {
    const t = (v as { tipo_veiculo?: { descricao: string } }).tipo_veiculo;
    return t?.descricao || this.tiposVeiculo.find((x) => x.id_tipo_veiculo === v.id_tipo_veiculo)?.descricao || '-';
  }

  clienteNome(v: Veiculo): string {
    const c = (v as { cliente?: { nome: string } }).cliente;
    return c?.nome || this.clientes.find((x) => x.id_cliente === v.id_cliente)?.nome || '-';
  }

  salvar(): void {
    this.erro = '';
    if (!this.form.placa.trim() || !this.form.marca.trim() || !this.form.modelo.trim() || !this.form.id_tipo_veiculo || !this.form.id_cliente) return;
    this.veiculoService.criar(this.form).subscribe({
      next: () => {
        this.notification.sucesso('Veículo cadastrado com sucesso!');
        this.form = { placa: '', marca: '', modelo: '', cor: '', id_tipo_veiculo: this.tiposVeiculo[0]?.id_tipo_veiculo || 0, id_cliente: this.clientes[0]?.id_cliente || 0 };
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao criar')
    });
  }

  excluir(id: number): void {
    this.erro = '';
    if (!confirm('Excluir este veículo?')) return;
    this.veiculoService.excluir(id).subscribe({
      next: () => {
        this.notification.sucesso('Veículo excluído com sucesso!');
        this.carregar();
      },
      error: (e) => (this.erro = e.error?.error || 'Erro ao excluir')
    });
  }
}
