const { Pool } = require('pg');

// Configurações do pool de conexões com o banco de dados
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Testa a conexão com o banco de dados
pool.connect((err, client, release) => {
  if (err) {
    return console.error('erro ao conectar com o banco:', err.stack);
  }
  console.log('conexão feita com o banco');
  release(); 
});

module.exports = pool;