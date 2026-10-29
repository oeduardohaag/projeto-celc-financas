require('dotenv').config({ path:'./src/.env' });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const membroRoutes = require('./routes/membro.routes');
const contasRoutes = require('./routes/contas.routes');
const swaggerDocs = require('./config/swagger');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/membros', membroRoutes);
app.use('/contas', contasRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'sucesso', mensagem: 'API do CELC Finanças funcinando!' });
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVIDOR RODANDO NA PORTA ${PORT}!`);
  console.log(`SERVIDOR RODANDO NA PORTA ${PORT}!`);
  console.log(`SERVIDOR RODANDO NA PORTA ${PORT}!`);

  swaggerDocs(app);
});