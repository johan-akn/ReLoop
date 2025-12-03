"use client";

import { ArrowLeft, Container } from "lucide-react";
import { useState } from "react";
import { useGlobal } from "../../context/global-context";
import { ItemCard } from "./ItemCard";
import { InfoItem } from "./InfoItem";

export function Saved() {
  const { getSavedItems, navigate } = useGlobal();
  const savedItems = getSavedItems();
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="saved-page">
      <header className="add-item-header">
        <button className="back-btn" onClick={() => navigate("home")}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">Itens Salvos</h1>
      </header>

      <div className="saved-content">
        {savedItems.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">Você ainda não salvou nenhum item.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("home")}
            >
              Explorar Itens
            </button>
          </div>
        ) : (
          <div className="saved-container">
            <div className="itemgrid-saved">
              {savedItems.map((item) => (
                <ItemCard
                  key={item.id_item}
                  item={item}
                  onCardClick={setSelectedItem}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <InfoItem item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
