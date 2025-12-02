"use client"

import { useState } from "react"
import { Search, HomeIcon, Heart, Plus, User, X } from "lucide-react"
import { useGlobal } from "@/context/global-context"
import { Logo } from "./Logo"
import { ItemCard } from "./ItemCard"
import { InfoItem } from "./InfoItem"

const categories = ["Todos", "Roupas", "Eletrônicos", "Livros", "Casa", "Esportes"]
const businessTypes = ["Todos", "Doação", "Troca"]

export function Home() {
  const { items = [], navigate, currentView } = useGlobal()
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [activeType, setActiveType] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)

  const filteredItems = items.filter((item) => {
    if (item.status === "finalizado") return false
    const matchesCategory =
      activeCategory === "Todos" || (item.categoria || "").toLowerCase() === activeCategory.toLowerCase()
    const matchesType = activeType === "Todos" || item.tipo_negocio.toLowerCase() === activeType.toLowerCase()
    const matchesSearch =
      item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesType && matchesSearch
  })

  return (
    <div className="home-page">
      <header className="top-bar">
        <Logo size="medium" />
        <div className="top-bar-actions">
          <button className="icon-btn" onClick={() => navigate("add-item")}>
            <Plus size={20} />
          </button>
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
