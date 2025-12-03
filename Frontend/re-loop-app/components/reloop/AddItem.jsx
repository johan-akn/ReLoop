"use client"

import { useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { useGlobal } from "../../context/global-context"
import { uploadImage } from "../../src/apiService"

export function AddItem() {
 const { addItem, navigate, showToast } = useGlobal()
 const [uploading, setUploading] = useState(false)
 const [formData, setFormData] = useState({
 titulo: "",
 descricao: "",
 categoria: "",
 tipo_negocio: "Doacao",
 condicao: "",
 troca_por: "",
 imagem: "",
 })
 const [imageFile, setImageFile] = useState(null)

 const handleImageChange = (e) => {
 const file = e.target.files?.[0]
 if (file) {
 setImageFile(file)
 const reader = new FileReader()
 reader.onloadend = () => {
 setFormData({ ...formData, imagem: reader.result })
 }
 reader.readAsDataURL(file)
 }
 }

 const handleSubmit = async (e) => {
 e.preventDefault()

 setUploading(true)
 let imageUrl = "/diverse-items-still-life.png"

 try {

 if (imageFile) {
 imageUrl = await uploadImage(imageFile)
 }


 const success = await addItem({
 titulo: formData.titulo,
 descricao: formData.descricao,
 tipo_negocio: formData.tipo_negocio,
 condicao: formData.condicao,
 categoria: formData.categoria,
 imagem: imageUrl,
 troca_por: formData.troca_por,
 })

 if (success) {
 navigate("home")
 }
 } catch (error) {
 console.error("Erro ao adicionar item:", error)
 showToast("Erro ao fazer upload da imagem. Tente novamente.", "error")
 } finally {
 setUploading(false)
 }
 }

 return (
 <div className="add-item-page">
 <header className="add-item-header">
 <button className="back-btn" onClick={() => navigate("home")}>
 <ArrowLeft size={24} />
 </button>
 <h1 className="page-title">Adicionar Novo Item</h1>
 </header>

 <div className="add-item-content">
 <form onSubmit={handleSubmit}>
 <div className="form-group">
 <label className="form-label">Fotos</label>
 <input
 type="file"
 id="image-upload"
 accept="image/*"
 style={{ display: "none" }}
 onChange={handleImageChange}
 />
 <label htmlFor="image-upload" className="image-upload">
 {formData.imagem ? (
 <img
 src={formData.imagem}
 alt="Preview"
 style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
 />
 ) : (
 <>
 <div className="image-upload-icon">
 <Upload size={32} />
 </div>
 <p className="image-upload-text">Clique para adicionar fotos</p>
 <p className="image-upload-hint">PNG, JPG até 10MB</p>
 </>
 )}
 </label>
 </div>

 <div className="form-group">
 <label className="form-label" htmlFor="titulo">
 Nome do Produto
 </label>
 <input
 id="titulo"
 type="text"
 className="form-input"
 placeholder="Digite o nome do produto"
 value={formData.titulo}
 onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
 required
 />
 </div>

 <div className="form-group">
 <label className="form-label" htmlFor="descricao">
 Descrição
 </label>
 <textarea
 id="descricao"
 className="form-textarea"
 placeholder="Descreva seu item, condição e detalhes relevantes..."
 value={formData.descricao}
 onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
 required
 />
 </div>

 <div className="form-group">
 <label className="form-label" htmlFor="categoria">
 Categoria
 </label>
 <select
 id="categoria"
 className="form-select"
 value={formData.categoria}
 onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
 required
 >
 <option value="">Selecione uma categoria</option>
 <option value="roupas">Roupas</option>
 <option value="eletronicos">Eletrônicos</option>
 <option value="livros">Livros</option>
 <option value="casa">Casa & Jardim</option>
 <option value="esportes">Esportes & Lazer</option>
 <option value="outros">Outros</option>
 </select>
 </div>

 <div className="form-group">
 <label className="form-label" htmlFor="condicao">
 Condição
 </label>
 <select
 id="condicao"
 className="form-select"
 value={formData.condicao}
 onChange={(e) => setFormData({ ...formData, condicao: e.target.value })}
 required
 >
 <option value="">Selecione a condição</option>
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
 className={`toggle-option ${formData.tipo_negocio === "Doacao" ? "active" : ""}`}
 onClick={() => setFormData({ ...formData, tipo_negocio: "Doacao", troca_por: "" })}
 >
 Doação
 </button>
 <button
 type="button"
 className={`toggle-option ${formData.tipo_negocio === "Troca" ? "active" : ""}`}
 onClick={() => setFormData({ ...formData, tipo_negocio: "Troca" })}
 >
 Troca
 </button>
 </div>
 </div>

 {formData.tipo_negocio === "Troca" && (
 <div className="form-group exchange-input-group">
 <label className="form-label" htmlFor="troca_por">
 O que você quer em troca?
 </label>
 <input
 id="troca_por"
 type="text"
 className="form-input"
 placeholder="Ex: Roupas similares, eletrônicos, livros..."
 value={formData.troca_por}
 onChange={(e) => setFormData({ ...formData, troca_por: e.target.value })}
 />
 <p className="form-hint">Descreva o que você gostaria de receber pelo seu item</p>
 </div>
 )}

 <button type="submit" className="btn btn-primary submit-btn" disabled={uploading}>
 {uploading ? "Enviando..." : "Adicionar Item"}
 </button>
 </form>
 </div>
 </div>
 )
}
