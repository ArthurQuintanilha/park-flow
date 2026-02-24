import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { InputComponent } from './shared/input/input.component';
import { SearchSelectComponent } from './shared/search-select/search-select.component';
import { DataTableModule } from './shared/data-table/data-table.module';

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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InputComponent,
    SearchSelectComponent,
    HomeComponent,
     TiposClienteComponent,
    TiposVeiculoComponent,
    TiposVagaComponent,
    ClientesComponent,
    EstacionamentosComponent,
    VagasComponent,
    VeiculosEstacionamentoComponent,
    MovimentacoesComponent,
    PagamentosComponent,
    TabelaPrecoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NgApexchartsModule,
    DataTableModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
