import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
 
  
import { TiposClienteComponent } from './pages/tipos-cliente/tipos-cliente.component';
import { TiposVeiculoComponent } from './pages/tipos-veiculo/tipos-veiculo.component';
import { TiposVagaComponent } from './pages/tipos-vaga/tipos-vaga.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { EstacionamentosComponent } from './pages/estacionamentos/estacionamentos.component';
import { VagasComponent } from './pages/vagas/vagas.component';
import { VeiculosEstacionamentoComponent } from './pages/veiculos-estacionamento/veiculos-estacionamento.component';
import { MovimentacoesComponent } from './pages/movimentacoes/movimentacoes.component';
import { PagamentosComponent } from './pages/pagamentos/pagamentos.component';
import { TabelaPrecoComponent } from './pages/tabela-preco/tabela-preco.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
 
 
  { path: 'estacionamento/tipos-cliente', component: TiposClienteComponent },
  { path: 'estacionamento/tipos-veiculo', component: TiposVeiculoComponent },
  { path: 'estacionamento/tipos-vaga', component: TiposVagaComponent },
  { path: 'estacionamento/clientes', component: ClientesComponent },
  { path: 'estacionamento/estacionamentos', component: EstacionamentosComponent },
  { path: 'estacionamento/vagas', component: VagasComponent },
  { path: 'estacionamento/veiculos', component: VeiculosEstacionamentoComponent },
  { path: 'estacionamento/movimentacoes', component: MovimentacoesComponent },
  { path: 'estacionamento/pagamentos', component: PagamentosComponent },
  { path: 'estacionamento/tabela-preco', component: TabelaPrecoComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
