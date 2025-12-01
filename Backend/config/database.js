
require('dotenv').config();


const { Pool } = require('pg');


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Teste de conexão (opcional, mas recomendado)
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao adquirir cliente do pool', err.stack);
    }
    console.log('✅ Conectado ao PostgreSQL!');
    // Não mantém o cliente ocupado após o teste
    release(); 
});

// Exporta o pool para ser usado em outras partes da aplicação (models/controllers)
module.exports = pool;