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

**3. 💰 Controle Financeiro: Registro detalhado de Contas, Dízimos e Ofertas.**
# Tecnologias Utilizadas 🖥️

### **Back-end:** Node.js

- node-postgres (`pg`)--> Conexão com o banco de dados PostgreSQL.
- express.js --> Construção do servidor da aplicação.
- CORS --> Gerenciamento de requisições entre Front-end e Back-end.
- dotenv --> Leitura das variáveis de ambiente.
- jsonwebtoken --> Gerar um token de identificação para manter o usuário conectado durante sua navegação pelo sistema.
- bcryptjs --> Hashear as senhas dos usuários.
- zod --> Validação de dados.
- dayjs --> Manipulação de datas.

### **Front-end:** React

- recahrts --> Criação de relatórios em formato de gráficos.

### **Banco de Dados:** PostgreSQL

### Requisitos

- Node.js (v18 ou superior)
- PostgreSQL
- Gerenciador de Pacotes npm

## Como Executar Localmente
* Obs: Nosso projeto ainda está em andamento, então o repositório não conterá todos os arquivos para o seu pleno funcionamento.
  
### 1º Passo --> Configurar o Banco de Dados
1. Criar um novo Banco de Dados no PostgreSQL com o nome de (`celc_financas`).
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
3. Crie um arquivo .env dentro da pasta raiz do projeto
```bash
PORT=3000

DB_USER = postgres
DB_HOST = localhost
DB_DATABASE = celc_financas
DB_PASSWORD = senha_aqui
DB_PORT = 5432

JWT_SECRET = token_jwt
```

4. Inicie o servidor
```
npm run dev
```
Ele iniciará na porta (`https://localhost:3000`).

## 3º Passo --> Configurar o Front-end
1. Acessar a pasta do fornt-end
```bash
cd frontend
```
2. Instale as dependências
```bash
npm i
```
3. Inicie o servidor
```
npm run dev
```
