const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Lista de categorias permitidas (opcional - remova se não quiser validar)
const VALID_CATEGORIES = [
  "Roupas",
  "Eletrônicos",
  "Livros",
  "Casa",
  "Casa & Jardim",
  "Esportes",
  "Esportes & Lazer",
  "Outros",
  // chaves em minúsculo vindas do frontend
  "roupas",
  "eletronicos",
  "livros",
  "casa",
  "esportes",
  "outros",
];
const CATEGORY_CANONICAL = {
  roupas: "Roupas",
  eletronicos: "Eletrônicos",
  livros: "Livros",
  casa: "Casa",
  "casa & jardim": "Casa & Jardim",
  esportes: "Esportes",
  "esportes & lazer": "Esportes & Lazer",
  outros: "Outros",
};
const normalize = (str = "") =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
const canonicalCategory = (value) => {
  if (!value) return null;
  const n = normalize(value);
  if (VALID_CATEGORIES.map((v) => normalize(v)).includes(n)) {
    for (const [k, v] of Object.entries(CATEGORY_CANONICAL)) {
      if (normalize(k) === n || normalize(v) === n) return v;
    }
    return value;
  }
  for (const [k, v] of Object.entries(CATEGORY_CANONICAL)) {
    if (normalize(k) === n || normalize(v) === n) return v;
  }

  return value || null;
};
const canonicalTipoNegocio = (value) => {
  if (!value) return null;
  const n = normalize(value);
  if (n === "doacao" || n === "doaçao") return "Doacao"; 
  if (n === "troca") return "Troca";
  return value;
};

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
        status,
        categoria,
        troca_por
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
        status,
        categoria,
        troca_por
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
    const { titulo, descricao, tipo_negocio, condicao, imagem, fk_id_usuario, status, categoria, troca_por } = req.body;
    console.log("POST /items body=", req.body);
    const cat = canonicalCategory(categoria);
    console.log("Categoria recebida:", categoria, "-> normalizada:", cat);
    const tipo = canonicalTipoNegocio(tipo_negocio) || "Doacao";

    if (!titulo || !fk_id_usuario || !cat || !descricao) {
      return res.status(400).json({ error: "titulo, descricao, fk_id_usuario e categoria são obrigatórios e válidos" });
    }
    if (tipo === "Troca" && (!troca_por || !String(troca_por).trim())) {
      return res.status(400).json({ error: "troca_por é obrigatório quando tipo_negocio = 'Troca'" });
    }

    const insert = `
      INSERT INTO itens (titulo, descricao, tipo_negocio, condicao, imagem, fk_id_usuario, status, categoria, troca_por)
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'disponivel'), $8, $9)
      RETURNING id_item AS id_item, titulo, descricao, tipo_negocio, condicao, imagem, fk_id_usuario, status, categoria, troca_por
    `;
    const params = [
      titulo,
      descricao,
      tipo,
      condicao || "Novo",
      imagem || null,
      fk_id_usuario,
      status || null,
      cat,
      tipo === "Troca" ? troca_por : null,
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
    let { titulo, descricao, tipo_negocio, condicao, imagem, fk_id_usuario, status, categoria, troca_por } = req.body;

    const cat = categoria ? canonicalCategory(categoria) : null;
    if (categoria && !cat) {
      return res.status(400).json({ error: `Categoria inválida. Use uma das: ${VALID_CATEGORIES.join(", ")}` });
    }
    if (cat && VALID_CATEGORIES.length && !VALID_CATEGORIES.includes(cat)) {
      return res.status(400).json({ error: `Categoria inválida. Use uma das: ${VALID_CATEGORIES.join(", ")}` });
    }
    const tipo = tipo_negocio ? canonicalTipoNegocio(tipo_negocio) : null;
    if ((tipo || tipo_negocio) === "Troca" && troca_por !== undefined && (!troca_por || !String(troca_por).trim())) {
      return res.status(400).json({ error: "troca_por não pode ser vazio quando tipo_negocio = 'Troca'" });
    }

    const update = `
      UPDATE itens
      SET titulo = COALESCE($1, titulo),
          descricao = COALESCE($2, descricao),
          tipo_negocio = COALESCE($3, tipo_negocio),
          condicao = COALESCE($4, condicao),
          imagem = COALESCE($5, imagem),
          fk_id_usuario = COALESCE($6, fk_id_usuario),
          status = COALESCE($7, status),
          categoria = COALESCE($8, categoria),
          troca_por = COALESCE($9, troca_por)
      WHERE id_item = $10
      RETURNING id_item AS id_item, titulo, descricao, tipo_negocio, condicao, imagem, fk_id_usuario, status, categoria, troca_por
    `;
    const params = [
      titulo,
      descricao,
      tipo,
      condicao,
      imagem,
      fk_id_usuario,
      status,
      cat,
      (tipo || tipo_negocio) === "Troca" ? troca_por : troca_por === null ? null : undefined,
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
