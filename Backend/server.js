const express = require("express");
const cors = require("cors");

const pool = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
// CORS amplo (sem credenciais) e deixa a lib responder preflight
app.use(cors());

// Log simples de requests para depuração
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.json());

// Healthcheck
app.get("/", (req, res) => {
  res.send(
    "API RELOOP Online! Conectado ao BD se não houver erros no console."
  );
});

// Routers
app.use("/api/users", require("./routes/users"));
app.use("/api/items", require("./routes/items"));
app.use("/api/auth", require("./routes/auth"));

// Start
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
