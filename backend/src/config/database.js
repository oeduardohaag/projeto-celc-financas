require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Testa a conexão com o banco
async function testarConexao() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('conectado com o supabase');
  } catch (err) {
    console.error('erro na conexão com o supabase:', err.message);
  }
}

testarConexao();

module.exports = pool;