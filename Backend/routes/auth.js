const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const pool = require("../config/database");

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

    const { senha: _omit, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao autenticar" });
  }
});

module.exports = router;
