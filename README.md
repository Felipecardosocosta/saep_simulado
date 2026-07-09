# Locadora de Veiculos — SAEP

Projeto base para a avaliacao pratica. A infraestrutura de backend, banco de dados e
frontend ja esta pronta e funcionando. Voces devem focar no que a atividade pede.

- **backend/** — Node + TypeScript + Express + Prisma + PostgreSQL
- **frontend/** — Vite + React

---

## 1. Pre-requisitos

| Ferramenta | Versao |
|---|---|
| Node.js | 18 ou superior |
| PostgreSQL | 14 ou superior, rodando em `localhost:5432` |

O PostgreSQL precisa aceitar o usuario `postgres` com a senha `senai`. Se a sua senha
for outra, altere a linha `DATABASE_URL` no arquivo `backend/.env`.

Voce **nao** precisa criar o banco `locadora_db` na mao — o Prisma cria sozinho.

---

## 2. Subindo o backend

```bash
cd backend
npm install
npm run setup    # cria o banco locadora_db, aplica a migration e popula os dados
npm run dev      # API em http://localhost:3333
```

Para conferir se subiu, abra <http://localhost:3333/health>. Deve responder `{"status":"ok"}`.

## 3. Subindo o frontend

Em **outro terminal**:

```bash
cd frontend
npm install
npm run dev      # aplicacao em http://localhost:5173
```

Abra <http://localhost:5173>. Voce vera a tela de Cadastro de Veiculos ja listando os
veiculos que vieram do banco. Se isso funciona, backend, banco e frontend estao conversando.

---

## 4. O que ja esta pronto

**Backend**

- Conexao com o PostgreSQL via Prisma (`src/prisma.ts`)
- CORS liberado para `http://localhost:5173`
- Middleware de erro padronizado — toda falha responde `{ "erro": "mensagem" }`
- CRUD completo de veiculo, com validacao:

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/veiculos` | Lista todos |
| GET | `/veiculos?busca=gol` | Filtra por modelo, marca ou cor |
| GET | `/veiculos/:id` | Busca um veiculo |
| POST | `/veiculos` | Cadastra |
| PUT | `/veiculos/:id` | Edita |
| DELETE | `/veiculos/:id` | Exclui |

**Banco** — modelos `Usuario` e `Veiculo`, com seed de 3 usuarios e 6 veiculos.

**Frontend**

- `src/services/api.js` — axios ja configurado, com interceptor que envia o token
  (quando existir) e que traduz o erro da API para `erro.message`
- `src/pages/CadastroVeiculo.jsx` — tela completa: listagem, busca, cadastro,
  edicao, exclusao e validacao. **Use esta tela como referencia** para construir as outras.

### Usuarios do seed

| Email | Senha |
|---|---|
| admin@locadora.com | 123456 |
| maria@locadora.com | maria123 |
| joao@locadora.com | joao123 |

> As senhas estao em texto puro apenas para simplificar a atividade. Em um sistema real
> elas nunca sao armazenadas assim — usa-se um hash (bcrypt, argon2).

---

## 5. O que voces precisam fazer

### Modelagem (entregas 2 e 3)

Em `backend/prisma/schema.prisma` os modelos `Cliente`, `Locacao` e `Movimentacao`
estao esbocados como comentarios. Completem os campos e os relacionamentos, e depois:

```bash
cd backend
npx prisma migrate dev --name movimentacoes
```

Lembrem do item 3.2 do enunciado: **toda tabela precisa de pelo menos 3 registros**.
Adicionem esses registros em `backend/prisma/seed.ts` e rodem `npm run seed`.

### Entrega 4 — Login

Criem a rota de autenticacao no backend e a tela no frontend. Ao registrar a rota,
descomentem a linha correspondente em `backend/src/server.ts`.
Em caso de falha, informe o motivo ao usuario.

### Entrega 5 — Tela principal

Deve exibir o nome do usuario logado, ter logout, e dar acesso as telas de
cadastro de veiculo e de disponibilidade.

### Entrega 7 — Disponibilidade de veiculos

- Listar os veiculos **em ordem alfabetica**, implementando um algoritmo de ordenacao
  (nao vale usar apenas `.sort()` pronto — o enunciado pede o algoritmo).
- Selecionar um veiculo e registrar movimentacao de **entrada** ou **saida**, com data
  informada pelo usuario e registro de quem fez a operacao.
- A cada **saida**, verificar se a quantidade disponivel ficou abaixo do
  `estoqueMinimo` do veiculo e, se ficou, exibir um alerta.

As rotas novas voces registram em `backend/src/server.ts`, e as telas em
`frontend/src/App.jsx` — em ambos ha um `TODO` mostrando exatamente onde.

---

## 6. Comandos uteis

| Comando | Onde | O que faz |
|---|---|---|
| `npm run dev` | backend | Sobe a API com reload automatico |
| `npm run setup` | backend | Cria o banco, migra e popula |
| `npm run seed` | backend | Repopula os dados |
| `npm run studio` | backend | Abre o Prisma Studio para ver o banco |
| `npm run typecheck` | backend | Verifica os tipos do TypeScript |
| `npm run dev` | frontend | Sobe a aplicacao React |

---

## 7. Problemas comuns

**`Can't reach database server at localhost:5432`**
O PostgreSQL nao esta rodando, ou a senha em `backend/.env` esta errada.

**`Authentication failed against database server`**
A senha do usuario `postgres` na sua maquina nao e `senai`. Corrija a `DATABASE_URL`
em `backend/.env`.

**A tela abre mas nao lista nada, e o console mostra erro de rede**
O backend nao esta rodando. Ele precisa estar no ar em outro terminal, na porta 3333.

**`Port 3333 is already in use`**
Outro programa ocupa a porta. Mude `PORT` em `backend/.env` e ajuste `VITE_API_URL`
em `frontend/.env` para a mesma porta.
