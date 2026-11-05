require('dotenv').config({ path:'./src/.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const membrosRoutes = require('./routes/membros.routes');
const contasRoutes = require('./routes/contas.routes');

// Configuração do rate limiter para limitar o número de requisições por IP (5 Vezes a cada 15 minutos)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { mensagem: 'Este IP fez muitas requisições, por favor tente novamente após 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(apiLimiter);

// Rotas
app.use('/auth', authRoutes);
app.use('/membros', membrosRoutes);
app.use('/contas', contasRoutes);

// Rota raiz para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ status: 'sucesso', mensagem: 'API do CELC Finanças funcinando!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro capturado pelo middleware:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'erro',
      mensagem: 'Erro de validação nos dados enviados',
      erros: err.errors
    });
  }

  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'erro',
    mensagem: err.message || 'Erro interno no servidor'
  });
});

// Inicia o servidor 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVIDOR RODANDO NA PORTA ${PORT}!`);
  console.log(`SERVIDOR RODANDO NA PORTA ${PORT}!`);
  console.log(`SERVIDOR RODANDO NA PORTA ${PORT}!`);
});