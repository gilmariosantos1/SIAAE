# SIAAE

Sistema Integrado de Avaliação da Alimentação Escolar.

## Estrutura

- `BackEnd`: API Express/TypeScript e scripts MySQL.
- `FrontEnd`: aplicação Ionic React/Vite para alunos.

## Banco de dados

1. Copie `BackEnd/.env.example` para `BackEnd/.env` e preencha as credenciais MySQL.
2. Execute `BackEnd/database/schema.sql`.
3. Em uma instalação existente, execute `BackEnd/database/003_cardapios_semanais.sql` para converter a data dos cardápios em dia da semana.
4. Execute `BackEnd/database/seed.sql` para dados de demonstração.

## Executar a API

```bash
cd BackEnd
npm install
npm run dev
```

A API fica em `http://localhost:3333`. O endpoint de saúde é `GET /health` e o cardápio do dia é `GET /api/menus?date=YYYY-MM-DD`. A data consultada serve para identificar o dia da semana; cada cardápio ativo se repete semanalmente nesse dia.

## Executar o frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Use `VITE_API_URL` para apontar o frontend para outra URL da API. Enquanto o backend ou o banco não estiverem disponíveis, a Home exibe um cardápio de demonstração para permitir o desenvolvimento da interface.
