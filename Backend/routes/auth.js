const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require("../config/database");

// Chave secreta para JWT (em produção, use variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || "seu-segredo-muito-secreto-aqui-2024";

// Middleware para validar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }
    req.userId = decoded.userId;
    next();
  });
}

// POST /api/auth/login
// body: { email, senha }
router.post("/login", async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res.status(400).json({ error: "email e senha são obrigatórios" });
  }
  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 LIMIT 1",
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    let ok = false;
    try {
      ok = await bcrypt.compare(senha, user.senha);
    } catch (_) {
      ok = false;
    }
    if (!ok) {
      // fallback para senhas em texto puro
      ok = user.senha === senha;
    }
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id_usuario, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" } // Token válido por 7 dias
    );

    const { senha: _omit, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao autenticar" });
  }
});

// GET /api/auth/loggedUser
// Valida o token e retorna o usuário logado
router.get("/loggedUser", authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1 LIMIT 1",
      [req.userId]
    );
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const { senha: _omit, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

module.exports = router;
