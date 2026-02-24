import express from "express";
import cors from "cors";
import { catchAsyncErrors } from "./middlewares/catch-async-errors";
import { onError } from "./middlewares/error";
import { healthCheck } from "./controllers/health-controller";
import * as tipoCliente from "./controllers/tipo-cliente-controller";
import * as tipoVeiculo from "./controllers/tipo-veiculo-controller";
import * as tipoVaga from "./controllers/tipo-vaga-controller";
import * as cliente from "./controllers/cliente-controller";
import * as estacionamento from "./controllers/estacionamento-controller";
import * as vaga from "./controllers/vaga-controller";
import * as veiculo from "./controllers/veiculo-controller";
import * as movimentacao from "./controllers/movimentacao-controller";
import * as pagamento from "./controllers/pagamento-controller";
import * as tabelaPreco from "./controllers/tabela-preco-controller";
import * as dashboard from "./controllers/dashboard-controller";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", catchAsyncErrors(healthCheck));

// Dashboard
app.get("/api/dashboard", catchAsyncErrors(dashboard.listar));

// Tipos de cliente
app.get("/api/tipos-cliente", catchAsyncErrors(tipoCliente.listar));
app.get("/api/tipos-cliente/:id", catchAsyncErrors(tipoCliente.buscarPorId));
app.post("/api/tipos-cliente", catchAsyncErrors(tipoCliente.criar));
app.put("/api/tipos-cliente/:id", catchAsyncErrors(tipoCliente.atualizar));
app.delete("/api/tipos-cliente/:id", catchAsyncErrors(tipoCliente.excluir));

// Tipos de veículo
app.get("/api/tipos-veiculo", catchAsyncErrors(tipoVeiculo.listar));
app.get("/api/tipos-veiculo/:id", catchAsyncErrors(tipoVeiculo.buscarPorId));
app.post("/api/tipos-veiculo", catchAsyncErrors(tipoVeiculo.criar));
app.put("/api/tipos-veiculo/:id", catchAsyncErrors(tipoVeiculo.atualizar));
app.delete("/api/tipos-veiculo/:id", catchAsyncErrors(tipoVeiculo.excluir));

// Tipos de vaga
app.get("/api/tipos-vaga", catchAsyncErrors(tipoVaga.listar));
app.get("/api/tipos-vaga/:id", catchAsyncErrors(tipoVaga.buscarPorId));
app.post("/api/tipos-vaga", catchAsyncErrors(tipoVaga.criar));
app.put("/api/tipos-vaga/:id", catchAsyncErrors(tipoVaga.atualizar));
app.delete("/api/tipos-vaga/:id", catchAsyncErrors(tipoVaga.excluir));

// Clientes
app.get("/api/clientes", catchAsyncErrors(cliente.listar));
app.get("/api/clientes/:id", catchAsyncErrors(cliente.buscarPorId));
app.post("/api/clientes", catchAsyncErrors(cliente.criar));
app.put("/api/clientes/:id", catchAsyncErrors(cliente.atualizar));
app.delete("/api/clientes/:id", catchAsyncErrors(cliente.excluir));

// Estacionamentos
app.get("/api/estacionamentos", catchAsyncErrors(estacionamento.listar));
app.get("/api/estacionamentos/:id/vagas", catchAsyncErrors(estacionamento.listarVagas));
app.get("/api/estacionamentos/:id", catchAsyncErrors(estacionamento.buscarPorId));
app.post("/api/estacionamentos", catchAsyncErrors(estacionamento.criar));
app.put("/api/estacionamentos/:id", catchAsyncErrors(estacionamento.atualizar));
app.delete("/api/estacionamentos/:id", catchAsyncErrors(estacionamento.excluir));

// Vagas
app.get("/api/vagas", catchAsyncErrors(vaga.listar));
app.get("/api/vagas/:id", catchAsyncErrors(vaga.buscarPorId));
app.post("/api/vagas", catchAsyncErrors(vaga.criar));
app.put("/api/vagas/:id", catchAsyncErrors(vaga.atualizar));
app.delete("/api/vagas/:id", catchAsyncErrors(vaga.excluir));

// Veículos
app.get("/api/veiculos", catchAsyncErrors(veiculo.listar));
app.get("/api/veiculos/cliente/:idCliente", catchAsyncErrors(veiculo.listarPorCliente));
app.get("/api/veiculos/:id", catchAsyncErrors(veiculo.buscarPorId));
app.post("/api/veiculos", catchAsyncErrors(veiculo.criar));
app.put("/api/veiculos/:id", catchAsyncErrors(veiculo.atualizar));
app.delete("/api/veiculos/:id", catchAsyncErrors(veiculo.excluir));

// Movimentações
app.get("/api/movimentacoes", catchAsyncErrors(movimentacao.listar));
app.get("/api/movimentacoes/veiculo/:idVeiculo", catchAsyncErrors(movimentacao.listarPorVeiculo));
app.get("/api/movimentacoes/:id", catchAsyncErrors(movimentacao.buscarPorId));
app.post("/api/movimentacoes", catchAsyncErrors(movimentacao.criar));
app.put("/api/movimentacoes/:id", catchAsyncErrors(movimentacao.atualizar));
app.delete("/api/movimentacoes/:id", catchAsyncErrors(movimentacao.excluir));

// Pagamentos
app.get("/api/pagamentos", catchAsyncErrors(pagamento.listar));
app.get("/api/pagamentos/movimentacao/:idMovimentacao", catchAsyncErrors(pagamento.buscarPorMovimentacao));
app.get("/api/pagamentos/:id", catchAsyncErrors(pagamento.buscarPorId));
app.post("/api/pagamentos", catchAsyncErrors(pagamento.criar));
app.put("/api/pagamentos/:id", catchAsyncErrors(pagamento.atualizar));
app.delete("/api/pagamentos/:id", catchAsyncErrors(pagamento.excluir));

// Tabela de preço
app.get("/api/tabela-preco", catchAsyncErrors(tabelaPreco.listar));
app.get("/api/tabela-preco/tipo-veiculo/:idTipoVeiculo", catchAsyncErrors(tabelaPreco.buscarPorTipoVeiculo));
app.get("/api/tabela-preco/:id", catchAsyncErrors(tabelaPreco.buscarPorId));
app.post("/api/tabela-preco", catchAsyncErrors(tabelaPreco.criar));
app.put("/api/tabela-preco/:id", catchAsyncErrors(tabelaPreco.atualizar));
app.delete("/api/tabela-preco/:id", catchAsyncErrors(tabelaPreco.excluir));
 

// Módulo Caronas: rotas removidas - controllers não implementados.
// Para reativar, crie os controllers e importe-os aqui.

app.use(onError);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
