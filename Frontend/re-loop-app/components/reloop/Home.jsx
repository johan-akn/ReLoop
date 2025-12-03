"use client"

import { useState } from "react"
import { Search, HomeIcon, Heart, Plus, User, X } from "lucide-react"
import { useGlobal } from "../../context/global-context"
import { Logo } from "./Logo"
import { ItemCard } from "./ItemCard"
import { InfoItem } from "./InfoItem"
import { LoopAI } from "./LoopAI"

export function Profile() {
  const {
    currentUser
  } = useGlobal()}


const categories = ["Todos", "Roupas", "Eletrônicos", "Livros", "Casa", "Esportes"]
const businessTypes = ["Todos", "Doação", "Troca"]

// Normaliza strings para comparação (remove acentos, espaços e usa minúsculas)
const normalize = (str = "") =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()

// Suporta categorias escritas como chave (ex.: "roupas") ou rótulo (ex.: "Roupas")
const categoryKeysToLabels = {
  roupas: "Roupas",
  eletronicos: "Eletrônicos",
  livros: "Livros",
  casa: "Casa & Jardim",
  esportes: "Esportes & Lazer",
  outros: "Outros",
}

// Para comparação, mapeia UI -> possíveis valores normalizados no banco
const categoryComparisonMap = {
  roupas: [normalize("roupas"), normalize("Roupas")],
  eletronicos: [normalize("eletronicos"), normalize("Eletrônicos")],
  livros: [normalize("livros"), normalize("Livros")],
  casa: [normalize("casa"), normalize("Casa"), normalize("Casa & Jardim")],
  esportes: [normalize("esportes"), normalize("Esportes"), normalize("Esportes & Lazer")],
  outros: [normalize("outros"), normalize("Outros")],
}

export function Home() {
  const { items = [], navigate, currentView, currentUser } = useGlobal()
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [activeType, setActiveType] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)

  const filteredItems = items.filter((item) => {
    if (normalize(item.status) === "finalizado") return false

    const normalizedActiveCategory = normalize(activeCategory)
    const normalizedActiveType = normalize(activeType)

    // Categoria
    const itemCat = normalize(item.categoria)
    const matchesCategory =
      normalizedActiveCategory === "todos" ||
      (() => {
        // tenta casar com as listas de comparação
        const list = categoryComparisonMap[normalizedActiveCategory]
        if (!list) return false
        return list.includes(itemCat)
      })()

    // Tipo de negócio (suporta "Doacao" e "Doação")
    const itemType = normalize(item.tipo_negocio)
    const matchesType =
      normalizedActiveType === "todos" ||
      itemType === normalizedActiveType ||
      (normalizedActiveType === "doacao" && itemType === "doacao")

    // Busca
    const q = normalize(searchQuery)
    const matchesSearch =
      normalize(item.titulo).includes(q) || normalize(item.descricao).includes(q)

    return matchesCategory && matchesType && matchesSearch
  })

  

  return (
    <div className="home-page">
      <header className="top-bar">
        <img src="./public/Reloop_branca.svg" alt="Reloop Logo" className="logo-branca-home" />
        <div className="top-bar-actions">
          <LoopAI />
          <button className="icon-btn" onClick={() => navigate("add-item")}>
            <Plus size={20} />
          </button>
          <button className="icon-btn" onClick={() => navigate("saved")}>
            <Heart size={20} />
          </button>
          <h2 className="profile-name">
            Olá, {currentUser?.nome}
          </h2>
          <button className="icon-btn" onClick={() => navigate("profile")}>
            <User size={20} />
          </button>
        </div>
      </header>

      <section className="filter-section">
        <div className="search-container">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar itens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery("")}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="type-filters">
          {businessTypes.map((type) => (
            <button
              key={type}
              className={`type-btn ${activeType === type ? "active" : ""}`}
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="items-section">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum item encontrado.</p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map((item) => (
              <ItemCard key={item.id_item} item={item} onCardClick={setSelectedItem} />
            ))}
          </div>
        )}
      </section>

      <nav className="bottom-nav">
        <button className={`nav-item ${currentView === "home" ? "active" : ""}`} onClick={() => navigate("home")}>
          <HomeIcon size={20} />
          <span>Início</span>
        </button>
        <button className="nav-item-add" onClick={() => navigate("add-item")}>
          <Plus size={24} />
        </button>
        <button className={`nav-item ${currentView === "saved" ? "active" : ""}`} onClick={() => navigate("saved")}>
          <Heart size={20} />
          <span>Salvos</span>
        </button>
      </nav>

      {selectedItem && <InfoItem item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}
