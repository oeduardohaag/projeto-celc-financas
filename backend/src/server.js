const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const membrosRoutes = require('./routes/membros.routes');
const contasRoutes = require('./routes/contas.routes');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { mensagem: 'Este IP fez muitas requisições, por favor tente novamente após 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(apiLimiter);

app.use('/auth', authRoutes);
app.use('/membros', membrosRoutes);
app.use('/contas', contasRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'sucesso', mensagem: 'API do CELC Finanças funcionando!' });
});

app.use((err, req, res, next) => {
  console.error('Erro capturado pelo middleware:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'erro',
      mensagem: 'Erro de validação nos dados enviados',
      erros: err.errors,
    });
  }

  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'erro',
    mensagem: err.message || 'Erro interno no servidor',
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}!`);
  });
}

module.exports = app;