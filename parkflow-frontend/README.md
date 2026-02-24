# ParkFlow Frontend

Frontend Angular 15 para o sistema ParkFlow, conectado à API REST.

## Pré-requisitos

- Node.js 18+
- Angular CLI 15 (`npm install -g @angular/cli@15`)
- API ParkFlow rodando em `http://localhost:3000`

## Configuração

A URL da API está definida em:
- **Desenvolvimento**: `src/environments/environment.ts`
- **Produção**: `src/environments/environment.prod.ts`

Por padrão: `http://localhost:3000/api`

## Como rodar

1. Inicie a API (na pasta `parkflow-api`):
   ```bash
   npm run dev
   ```

2. Inicie o frontend:
   ```bash
   cd parkflow-frontend
   npm start
   ```

3. Acesse: http://localhost:4200

## Estrutura de conexão com a API

### Serviços disponíveis

- **ApiService** - Serviço base com métodos `get`, `post`, `put`, `delete`
- **HealthService** - Verificação de saúde da API (`/api/health`)
- **ClienteService** - CRUD de clientes
- **TipoClienteService** - CRUD de tipos de cliente

### Endpoints da API

A API expõe os seguintes recursos (base: `/api`):
- `health` - Status da API
- `clientes` - Clientes
- `tipos-cliente` - Tipos de cliente
- `tipos-veiculo` - Tipos de veículo
- `tipos-vaga` - Tipos de vaga
- `estacionamentos` - Estacionamentos
- `vagas` - Vagas
- `veiculos` - Veículos
- `movimentacoes` - Movimentações
- `pagamentos` - Pagamentos
- `tabela-preco` - Tabela de preço

Para adicionar mais serviços, use o `ApiService` como base (ex: `ClienteService`).
