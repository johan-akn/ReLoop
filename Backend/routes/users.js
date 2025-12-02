const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const bcrypt = require("bcryptjs");

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios ORDER BY id_usuario ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter usuário" });
  }
});

// POST /api/users
router.post("/", async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body || {};
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "nome, email e senha são obrigatórios" });
    }

    // Verifica email já existente
    const existing = await pool.query("SELECT 1 FROM usuarios WHERE email = $1 LIMIT 1", [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "email já cadastrado" });
    }

    // Hash da senha (compatível com login que tenta bcrypt primeiro)
    const hashed = await bcrypt.hash(senha, 10);

    const insert = `
      INSERT INTO usuarios (nome, email, senha, telefone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await pool.query(insert, [nome, email, hashed, telefone || null]);
    const { senha: _omit, ...safe } = rows[0];
    res.status(201).json(safe);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: "conflito de chave (possível sequência desatualizada)", constraint: err.constraint });
    }
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// PUT /api/users/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, telefone } = req.body;
    const update = `
      UPDATE usuarios
      SET nome = COALESCE($1, nome),
          email = COALESCE($2, email),
          senha = COALESCE($3, senha),
          telefone = COALESCE($4, telefone)
      WHERE id_usuario = $5
      RETURNING *
    `;
    const { rows } = await pool.query(update, [nome, email, senha, telefone, id]);
    if (!rows[0]) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM usuarios WHERE id_usuario = $1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

module.exports = router;
