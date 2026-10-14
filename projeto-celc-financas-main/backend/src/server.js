require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet')

require('.config/database')

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ 
    status: 'sucesso',
    message: 'api está funcionando!' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server está rodando na porta ${PORT}`);
});