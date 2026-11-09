require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configurações do supabase de conexões com o banco de dados
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
);

// Testa a conexão com o banco de dados
const { err } = supabase.from('usuarios').select('*').limit(1);

if (err) {
    console.error('erro ao se conectar com o banco supabase:', err.message);
  } else {
    console.log('conectado com o banco supabase.');
  };

module.exports = supabase;