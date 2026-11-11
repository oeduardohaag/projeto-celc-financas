# CELC FINANÇAS 
![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green)
![Node.JS](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

O **CELC FINANÇAS** é um sistema web de gestão financeira desenvolvido como projeto acadêmico, com o objetivo de auxiliar na organização, controle e acompanhamento das movimentações financeiras da Comunidade Evangélica Luterana de Criciúma.
A aplicação busca proporcionar maior praticidade e transparência na gestão dos recursos, permitindo o registro e acompanhamento de receitas e despesas de forma organizada e centralizada.

# Funcionalidades
**1. 👪 Gestão dos membros da igreja: Cadastro de membros com validações de CPF.**

**2. 📊 Dashboard Interativo: Exibição de cards e gráficos visuais de entraxa e saídas.**

**3. 💰 Controle Financeiro: Registro detalhado de Contas.**
# Tecnologias Utilizadas 🖥️

### **Back-end:** Node.js

- node-postgres (`pg`)--> Conexão com o banco de dados PostgreSQL/Supabase.
- express.js --> Construção do servidor da aplicação.
- CORS --> Gerenciamento de requisições entre Front-end e Back-end.
- dotenv --> Leitura das variáveis de ambiente.
- jsonwebtoken --> Gerar um token de identificação para manter o usuário conectado durante sua navegação pelo sistema.
- bcryptjs --> Hashear as senhas dos usuários.
- zod --> Validação de dados.
- dayjs --> Manipulação de datas.
- cookie-parser --> Middleware para o Express responsável por analisar e gerir cookies nas requisições HTTP.
- express-rate-limit --> Middleware de proteção para limitar a frequência de requisições por IP e prevenir ataques de força bruta.
- nodemon: Para o desenvolvimento, ele monitoriza alterações e reinicia automaticamente o servidor.

### **Front-end:** React

- recahrts --> Criação de relatórios em formato de gráficos.
- react-router-dom --> Gerenciamento de rotas para o sistema
- lucide-react --> Fornece icones vetoriais customizáveis e leves para o React
- axios --> Responsável por realizar as requisições e comunicação com o backend

### **Banco de Dados:** Supabase

### Requisitos

- Node.js (v18 ou superior)
- PostgreSQL
- Gerenciador de Pacotes npm

## Como Executar Localmente
* Obs: Nosso projeto ainda está em andamento, então o repositório pode não conter gtodos os arquivos para o seu pleno funcionamento.
  
### 1º Passo --> Configurar o Banco de Dados
1. Criar um novo Banco de Dados no Supabase com o nome de (`celc_financas`).
2. Criar todas as tabelas com o arquivo (`celc-financas.sql`).

### 2º Passo --> Configurar o Back-end
1. Acessar a pasta do back-end
```bash
cd backend
```
2. Instale as dependências
```bash
npm i
```
3. Crie um arquivo .env dentro da pasta raiz do backend
```bash
PORT=3000

DATABASE_URL=url_do_supabase

JWT_SECRET = token_aqui
```
*Para conseguir o link de acesso ao banco de dados Supabase, siga esse caminho abaixo

1° Passo: Dashboard --> Connect(Parte superior da tela) --> Direct - Connection String
2° Passo: Connection Method --> Session Pooler | Type --> URI
2° Passo: Copie o link Shared Pooler logo abaixo (começa com postgresql://)

4. Inicie o servidor
```
npm run dev
```
Ele iniciará na porta (`http://localhost:3000`).

## 3º Passo --> Configurar o Front-end
1. Acessar a pasta do fornt-end
```bash
cd frontend
```
2. Instale as dependências
```bash
npm i
```
3. Crie um arquivo .env dentro da pasta raiz do frontend
```bash
VITE_API_URL=url_do_backend
```

4. Inicie o servidor
```
npm run dev
```
