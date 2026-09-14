Atue como um Arquiteto de Software Sênior especialista em Ionic 8, React 18, TypeScript, Vite 5, Node.js, Express, JWT, MySQL e UX/UI para aplicações governamentais.

Desenvolva um sistema completo chamado:

SIAAE - Sistema Integrado de Avaliação da Alimentação Escolar

Objetivo:
Permitir que alunos da rede municipal avaliem diariamente a merenda escolar através de tablets, celulares ou totens touchscreen instalados nas escolas.

O sistema deve possuir:

====================================================
ARQUITETURA
====================================================

Frontend:
- Ionic 8
- React 18
- TypeScript
- Vite
- React Router
- Axios
- Context API
- React Hook Form
- Chart.js
- Ionic Storage

Backend:
- Node.js
- Express
- JWT
- bcryptjs
- cors
- dotenv
- mysql2
- express-validator

Banco de Dados:
- MySQL

Arquitetura em camadas:

backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middlewares/
│   ├── routes/
│   ├── validations/
│   ├── database/
│   ├── utils/
│   └── server.ts

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── routes/
│   ├── contexts/
│   ├── services/
│   ├── hooks/
│   ├── layouts/
│   ├── assets/
│   ├── types/
│   └── theme/

====================================================
REGRAS DE NEGÓCIO
====================================================

O aluno avalia apenas uma vez por refeição.

Escala de avaliação:

5 = 😍 Excelente
4 = 🙂 Boa
3 = 😐 Regular
2 = 🙁 Ruim
1 = 😡 Péssima

Os critérios avaliados:

- Sabor
- Aparência
- Temperatura
- Quantidade

O sistema deve calcular automaticamente:

- Média Geral
- Índice de Aceitabilidade
- Percentual de Aprovação
- Percentual de Rejeição
- Ranking das Escolas
- Ranking dos Cardápios

Quando a média da refeição ficar abaixo de 3:

gerar Alerta Nutricional.

====================================================
MODULO ALUNO
====================================================

Tela Home

Exibir:

- Cardápio do dia
- Escola
- Turno
- Botão Avaliar

Tela Avaliar Merenda

Mostrar:

Nome do prato

Emojis grandes

Critérios:

Sabor
Temperatura
Aparência
Quantidade

Campo opcional:

Sugestões

Botão:

Enviar Avaliação

Tela Obrigado

Mensagem gamificada:

"Obrigado por contribuir para melhorar nossa alimentação escolar!"

Tela Cardápio da Semana

Exibir refeições organizadas por:

- Data
- Escola
- Turno

Tela Histórico

Mostrar avaliações anteriores.

Tela Fale com a Nutrição

Permitir:

- Sugestões
- Reclamações
- Elogios

====================================================
MODULO ADMINISTRATIVO
====================================================

Login JWT

Perfis:

Administrador
Nutricionista
Diretor

Dashboard Principal

Cards:

- Total de Avaliações
- Média Geral
- Escolas Ativas
- Cardápios Ativos

Gráficos:

- Aceitabilidade por escola
- Aceitabilidade por cardápio
- Avaliações por período
- Refeições com menor aprovação

Tela Escolas

CRUD completo.

Campos:

- Nome
- Código INEP
- Endereço
- Diretor

Tela Turmas

CRUD completo.

Tela Usuários

CRUD completo.

Tela Cardápios

CRUD completo.

Campos:

- Data
- Turno
- Refeição
- Ingredientes
- Nutricionista responsável

Tela Avaliações

Filtros:

- Escola
- Data
- Turno
- Faixa etária

Tela Relatórios

Gerar:

PDF
Excel

Relatórios:

- Aceitabilidade
- Desperdício
- Ranking escolas
- Ranking cardápios

====================================================
BANCO DE DADOS
====================================================

Criar script MySQL completo contendo:

usuarios
escolas
turmas
alunos
cardapios
refeicoes
avaliacoes
feedbacks
alertas_nutricionais
logs_acesso

Relacionamentos corretos.

Criar índices para alta performance.

====================================================
SEGURANÇA
====================================================

Implementar:

JWT

Refresh Token

Criptografia bcrypt

Middleware Auth

Middleware Role

Rate Limit

Validação de entrada

Proteção contra SQL Injection

CORS configurado

LGPD:

- anonimizar avaliações dos alunos
- não armazenar dados sensíveis

====================================================
UX/UI
====================================================

Tema visual baseado na Secretaria Municipal de Educação.

Paleta:

Verde Escuro #1B4A28
Verde Primário #00662A
Amarelo #E5B832
Fundo #F8F9FA
Texto #212529

Interface inspirada em totens touch-screen modernos.

Usar:

- Emojis grandes
- Cartões arredondados
- Design Mobile First
- Acessibilidade WCAG
- Fonte grande para crianças

====================================================
ENTREGAS
====================================================

Gerar:

1. Estrutura completa do projeto
2. Todos os componentes React
3. Todas as telas Ionic
4. Todas as rotas
5. Backend Express completo
6. Script SQL completo
7. Autenticação JWT
8. Dashboard com gráficos
9. Seed inicial do banco
10. README detalhado
11. Docker Compose
12. Arquivo .env.example
13. API REST documentada
14. Testes usando Jest

Comece criando a estrutura de pastas e o banco de dados antes de gerar os códigos.

Prompt para Desenvolvimento do Dashboard:Objetivo: Desenvolver uma interface de Dashboard para nutricionistas acompanharem a aceitação da merenda escolar, com backend em Node.js e frontend mobile/web em Ionic (Angular ou React).Contexto dos Dados:O sistema recebe avaliações diárias dos alunos compostas por 4 perguntas estruturadas em escala Hedônica de 5 pontos (Péssima, Ruim, Regular, Boa, Excelente) e 1 campo de texto livre:SaborApresentação visualTemperaturaQuantidade/PorcionamentoSugestões (texto livre)Requisitos do Dashboard (Frontend Ionic):Filtros Globais:Período (Hoje, Última Semana, Mês, Personalizado).Seleção de Escola / Turma.Seleção de Preparação / Cardápio do dia.KPIs Principais (Cards no topo):Índice de Aceitabilidade Geral (%): Percentual de avaliações "Boa" e "Excelente" em relação ao total. Destaque visual se estiver abaixo da meta do PNAE (85%).Volume de Respostas: Total de alunos que avaliaram no período.Taxa de Rejeição Crítica (%): Percentual de respostas "Péssima" + "Ruim".Gráficos e Visualizações:Desempenho por Atributo (Gráfico de Barras/Radar): Comparativo da pontuação média de Sabor, Visual, Temperatura e Quantidade.Evolução Temporal (Gráfico de Linha): Aceitabilidade ao longo dos dias/semanas para identificar tendências.Distribuição das Notas (Gráfico de Rosca/Pizza): Proporção das 5 reações (Péssima a Excelente).Módulo de Feedback Qualitativo:Tabela/Lista de sugestões dos alunos com suporte a busca por palavra-chave e ordenação por data.Requisitos do Backend (API Node.js):Crie endpoints REST ful para agregação de dados:GET /api/dashboard/kpis: Retorna métricas consolidadas (IA geral, total de votos, taxa de rejeição).GET /api/dashboard/breakdown: Retorna médias agrupadas por atributo (Sabor, Visual, Temp, Qtd).GET /api/dashboard/history: Retorna dados históricos para gráficos de linha.GET /api/dashboard/comments: Retorna lista paginada do campo de sugestões.Garanta queries otimizadas no banco de dados para realizar o cálculo percentual de aceite: $\frac{\text{votos\_positivos}}{\text{total\_votos}} \times 100$.Design & UX:Layout limpo, responsivo (adaptável para desktop e tablet) usando componentes nativos do Ionic (ion-grid, ion-card, ion-select, etc.).Utilização de biblioteca de gráficos compatível (ex: Chart.js, Ngx-Charts ou Highcharts).Uso de alertas visuais (cores verde para $\ge 85\%$, amarelo para $70-84\%$, e vermelho para $<70\%$).P