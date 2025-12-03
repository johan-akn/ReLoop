const express = require("express");
const cors = require("cors");
const multer = require("multer");

const pool = require("./config/database");
const cloudinary = require("./config/cloudinaryConfig");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Multer para upload em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
app.use("/api/upload", require("./routes/upload")(upload, cloudinary));
app.use("/api/loopai", require("./routes/loopai"));

// Start
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
