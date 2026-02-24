# ParkFlow API

API REST para gerenciamento de estacionamentos ParkFlow. Controla clientes, veículos, vagas, movimentações e pagamentos.

## Tecnologias

- Node.js + TypeScript
- Express
- PostgreSQL

## Configuração

1. Crie o banco de dados PostgreSQL (parkflow)
2. Importe o dump SQL na pasta do projeto
3. Copie `.env.example` para `.env` e ajuste as variáveis

## Executar

```bash
npm install
npm run dev
```

API disponível em `http://localhost:3000/api`
