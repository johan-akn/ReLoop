"use client"

import { useState } from "react"
import { ArrowLeft, User, Mail, Phone, Camera, Trash2, LogOut, Package, Edit, CheckCircle, X } from "lucide-react"
import { useGlobal } from "../../context/global-context"
import { uploadImage } from "../../src/apiService"

export function Profile() {
  const {
    currentUser,
    updateUser,
    logout,
    deleteAccount,
    navigate,
    getUserItems,
    updateItem,
    deleteItem,
    toggleItemStatus,
  } = useGlobal()

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteItemId, setDeleteItemId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [userData, setUserData] = useState({
    nome: currentUser?.nome || "",
    email: currentUser?.email || "",
    telefone: currentUser?.telefone || "",
  })

  const userItems = getUserItems()

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    updateUser(userData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    setShowDeleteModal(false)
  }

  const handleEditItem = (item) => {
    setEditingItem({
      ...item,
    })
    setShowItemsModal(false) // Fecha o modal de itens ao abrir o de edição
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, imagem: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveItem = async () => {
    setUploading(true)
    
    try {
      let imageUrl = editingItem.imagem

      // Se houver um novo arquivo de imagem, faz o upload
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      // Atualiza o item com a URL da imagem
      updateItem(editingItem.id_item, { ...editingItem, imagem: imageUrl })
      setEditingItem(null)
      setImageFile(null)
      setShowItemsModal(true) // Reabre o modal de itens
    } catch (error) {
      console.error("Erro ao salvar item:", error)
      alert("Erro ao fazer upload da imagem. Tente novamente.")
    } finally {
      setUploading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setImageFile(null)
    setShowItemsModal(true) // Reabre o modal de itens
  }

  const handleDeleteItem = (itemId) => {
    deleteItem(itemId)
    setDeleteItemId(null)
  }

  const handleToggleStatus = (itemId) => {
    toggleItemStatus(itemId)
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate("home")}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="page-title">Perfil</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <User size={48} />
            <button className="avatar-edit-btn">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="profile-name">{currentUser?.nome}</h2>
          <p className="profile-member-since">Membro desde 2024</p>
        </div>

        <button className="btn btn-primary submit-btn" onClick={() => setShowItemsModal(true)}>
          <Package size={18} />
          Meus Itens ({userItems.length})
        </button>

        <div className="profile-form">
          <div className="form-group">
            <label className="form-label">Nome</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="nome"
                className="form-input with-icon"
                value={userData.nome}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input with-icon"
                value={userData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                name="telefone"
                className="form-input with-icon"
                value={userData.telefone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing ? (
            <div className="profile-actions">
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Salvar Alterações
              </button>
            </div>
          ) : (
            <button className="btn btn-primary submit-btn" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </button>
          )}
        </div>

        <div className="danger-zone">
          <button className="btn btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Sair
          </button>

          <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={18} />
            Excluir Conta
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Excluir Conta?</h3>
            <p className="modal-text">
              Esta ação não pode ser desfeita. Todos os seus dados, anúncios e itens salvos serão permanentemente
              excluídos.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      )}

      {showItemsModal && (
        <div className="modal-overlay" onClick={() => setShowItemsModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Meus Itens</h3>
              <button className="modal-close-btn" onClick={() => setShowItemsModal(false)}>
                <X size={20} />
              </button>
            </div>

            {userItems.length === 0 ? (
              <div className="modal-empty">
                <Package size={48} />
                <p>Você ainda não publicou nenhum item.</p>
              </div>
            ) : (
              <div className="user-items-list">
                {userItems.map((item) => (
                  <div
                    key={item.id_item}
                    className={`user-item-card ${item.status === "finalizado" ? "finalizado" : ""}`}
                  >
                    <div className="user-item-image">
                      <img src={item.imagem || "/placeholder.svg"} alt={item.titulo} />
                      {item.status === "finalizado" && <div className="item-status-badge">Finalizado</div>}
                    </div>
                    <div className="user-item-info">
                      <h4 className="user-item-title">{item.titulo}</h4>
                      <p className="user-item-type">{item.tipo_negocio}</p>
                    </div>
                    <div className="user-item-actions">
                      <button className="item-action-btn edit" onClick={() => handleEditItem(item)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button
                        className={`item-action-btn status ${item.status === "finalizado" ? "active" : ""}`}
                        onClick={() => handleToggleStatus(item.id_item)}
                        title={item.status === "finalizado" ? "Marcar como disponível" : "Marcar como finalizado"}
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className="item-action-btn delete"
                        onClick={() => setDeleteItemId(item.id_item)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {editingItem && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Item</h3>
              <button className="modal-close-btn" onClick={handleCancelEdit}>
                <X size={20} />
              </button>
            </div>

            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Imagem</label>
                <input
                  type="file"
                  id="edit-image-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label htmlFor="edit-image-upload" className="image-upload" style={{ cursor: "pointer" }}>
                  {editingItem.imagem ? (
                    <img
                      src={editingItem.imagem}
                      alt="Preview"
                      style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : (
                    <>
                      <div className="image-upload-icon">
                        <Camera size={32} />
                      </div>
                      <p className="image-upload-text">Clique para alterar a imagem</p>
                    </>
                  )}
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingItem.titulo}
                  onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-textarea"
                  value={editingItem.descricao}
                  onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select
                  className="form-select"
                  value={editingItem.categoria}
                  onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value })}
                >
                  <option value="roupas">Roupas</option>
                  <option value="eletronicos">Eletrônicos</option>
                  <option value="livros">Livros</option>
                  <option value="casa">Casa & Jardim</option>
                  <option value="esportes">Esportes & Lazer</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condição</label>
                <select
                  className="form-select"
                  value={editingItem.condicao}
                  onChange={(e) => setEditingItem({ ...editingItem, condicao: e.target.value })}
                >
                  <option value="Novo">Novo</option>
                  <option value="Usado - Bom">Usado - Bom</option>
                  <option value="Usado - Razoavel">Usado - Razoável</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Anúncio</label>
                <div className="toggle-group">
                  <button
                    type="button"
                    className={`toggle-option ${editingItem.tipo_negocio === "Doacao" ? "active" : ""}`}
                    onClick={() => setEditingItem({ ...editingItem, tipo_negocio: "Doacao", troca_por: "" })}
                  >
                    Doação
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${editingItem.tipo_negocio === "Troca" ? "active" : ""}`}
                    onClick={() => setEditingItem({ ...editingItem, tipo_negocio: "Troca" })}
                  >
                    Troca
                  </button>
                </div>
              </div>

              {editingItem.tipo_negocio === "Troca" && (
                <div className="form-group">
                  <label className="form-label">O que você quer em troca?</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Roupas similares, eletrônicos, livros..."
                    value={editingItem.troca_por || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, troca_por: e.target.value })}
                  />
                  <p className="form-hint">Descreva o que você gostaria de receber pelo seu item</p>
                </div>
              )}

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSaveItem} disabled={uploading}>
                  {uploading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteItemId && (
        <div className="modal-overlay" onClick={() => setDeleteItemId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Excluir Item?</h3>
            <p className="modal-text">Esta ação não pode ser desfeita. O item será permanentemente excluído.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteItemId(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteItem(deleteItemId)}>
                Excluir Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
