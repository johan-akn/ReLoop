const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET /api/items
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        id_item AS id_item,
        titulo,
        descricao,
        tipo_negocio,
        condicao,
        imagem,
        fk_id_usuario,
        status
       FROM itens
       ORDER BY id_item ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar itens" });
  }
});

// GET /api/items/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT 
        id_item AS id_item,
        titulo,
        descricao,
        tipo_negocio,
        condicao,
        imagem,
        fk_id_usuario,
        status
       FROM itens WHERE id_item = $1`,
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Item não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter item" });
  }
});

// POST /api/items
router.post("/", async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      tipo_negocio,
      condicao,
      imagem,
      fk_id_usuario,
      status,
    } = req.body;

    if (!titulo || !fk_id_usuario) {
      return res.status(400).json({ error: "titulo e fk_id_usuario são obrigatórios" });
    }

    const insert = `
      INSERT INTO itens (titulo, descricao, tipo_negocio, condicao, imagem, fk_id_usuario, status)
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'disponivel'))
      RETURNING 
        id_item AS id_item,
        titulo,
        descricao,
        tipo_negocio,
        condicao,
        imagem,
        fk_id_usuario,
        status
    `;
    const params = [
      titulo,
      descricao || null,
      tipo_negocio || null,
      condicao || null,
      imagem || null,
      fk_id_usuario,
      status || null,
    ];
    const { rows } = await pool.query(insert, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

// PUT /api/items/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descricao,
      tipo_negocio,
      condicao,
      imagem,
      fk_id_usuario,
      status,
    } = req.body;
    const update = `
      UPDATE itens
      SET titulo = COALESCE($1, titulo),
          descricao = COALESCE($2, descricao),
          tipo_negocio = COALESCE($3, tipo_negocio),
          condicao = COALESCE($4, condicao),
          imagem = COALESCE($5, imagem),
          fk_id_usuario = COALESCE($6, fk_id_usuario),
          status = COALESCE($7, status)
      WHERE id_item = $8
      RETURNING 
        id_item AS id_item,
        titulo,
        descricao,
        tipo_negocio,
        condicao,
        imagem,
        fk_id_usuario,
        status
    `;
    const params = [
      titulo,
      descricao,
      tipo_negocio,
      condicao,
      imagem,
      fk_id_usuario,
      status,
      id,
    ];
    const { rows } = await pool.query(update, params);
    if (!rows[0]) return res.status(404).json({ error: "Item não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
});

// DELETE /api/items/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM itens WHERE id_item = $1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Item não encontrado" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir item" });
  }
});

module.exports = router;
