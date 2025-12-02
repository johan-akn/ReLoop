require("dotenv").config();

const { Pool } = require("pg");

// Support both DB_* and PG* variable names, plus DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.PGUSER || process.env.DB_USER,
  host: process.env.PGHOST || process.env.DB_HOST,
  database: process.env.PGDATABASE || process.env.DB_DATABASE,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  port: Number(process.env.PGPORT || process.env.DB_PORT) || undefined,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erro ao adquirir cliente do pool", err.stack);
  }
  console.log("✅ Conectado ao PostgreSQL!");
  release();
});

module.exports = pool;