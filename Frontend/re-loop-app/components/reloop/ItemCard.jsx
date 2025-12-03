"use client"

import { ImageIcon, Heart } from "lucide-react"
import { useGlobal } from "../../context/global-context"

const getCategoryLabel = (categoria) => {
  const labels = {
    roupas: "Roupas",
    eletronicos: "Eletrônicos",
    livros: "Livros",
    casa: "Casa & Jardim",
    esportes: "Esportes & Lazer",
    outros: "Outros",
  }
  return labels[categoria] || categoria
}

export function ItemCard({ item, onCardClick }) {
  const { toggleSaveItem, isItemSaved, showToast } = useGlobal()
  const isSaved = isItemSaved(item.id_item)

  const handleSaveToggle = (e) => {
    e.stopPropagation()
    toggleSaveItem(item.id_item)
    if (isSaved) {
      showToast("Item removido dos salvos", "info")
    } else {
      showToast("Item salvo com sucesso!", "success")
    }
  }

  return (
    <div className="item-card" onClick={() => onCardClick(item)}>
      <div className="item-image">
        {item.imagem ? <img src={item.imagem || "/placeholder.svg"} alt={item.titulo} /> : <ImageIcon size={48} />}
        <span className={`item-badge ${item.tipo_negocio === "Doacao" ? "badge-donation" : "badge-exchange"}`}>
          {item.tipo_negocio === "Doação" ? "Doação" : "Troca"}
        </span>
        <button
          className={`save-btn ${isSaved ? "saved" : ""}`}
          onClick={handleSaveToggle}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="item-content">
        <h3 className="item-title">{item.titulo}</h3>
        <p className="item-description">{item.descricao}</p>
        <div className="item-meta">
          {item.categoria && <span className="item-category">{getCategoryLabel(item.categoria)}</span>}
          <span className="item-condition">{item.condicao}</span>
        </div>
      </div>
    </div>
  )
}
