"use client"

import { useState } from "react"
import { X, Upload, Sparkles, Loader } from "lucide-react"
import { uploadImage } from "../../src/apiService"
import { useGlobal } from "../../context/global-context"

export function LoopAI() {
 const { currentUser, showToast } = useGlobal()
 const [showModal, setShowModal] = useState(false)
 const [image, setImage] = useState(null)
 const [imageFile, setImageFile] = useState(null)
 const [uploading, setUploading] = useState(false)
 const [analyzing, setAnalyzing] = useState(false)
 const [analysis, setAnalysis] = useState(null)
 const [error, setError] = useState(null)

 const handleImageChange = (e) => {
 const file = e.target.files?.[0]
 if (file) {
 setImageFile(file)
 const reader = new FileReader()
 reader.onloadend = () => {
 setImage(reader.result)
 }
 reader.readAsDataURL(file)
 setAnalysis(null)
 setError(null)
 }
 }

 const handleAnalyze = async () => {
 if (!imageFile) {
 showToast("Por favor, selecione uma imagem primeiro.", "warning")
 return
 }

 setUploading(true)
 setAnalyzing(true)
 setError(null)

 try {
 const imageUrl = await uploadImage(imageFile)

 const response = await fetch("http://localhost:3000/api/loopai/analyze", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ imageUrl }),
 })

 if (!response.ok) {
 throw new Error("Erro ao analisar imagem")
 }

 const data = await response.json()
 setAnalysis(data.analysis)
 showToast("Análise concluída com sucesso!", "success")
 } catch (err) {
 console.error("Erro:", err)
 showToast("Erro ao analisar a imagem. Tente novamente.", "error")
 setError("Erro ao analisar a imagem. Tente novamente.")
 } finally {
 setUploading(false)
 setAnalyzing(false)
 }
 }

 const handleClose = () => {
 setShowModal(false)
 setImage(null)
 setImageFile(null)
 setAnalysis(null)
 setError(null)
 }

 return (
 <>
 <button className="btn btn-loopai" onClick={() => setShowModal(true)}>
 <Sparkles size={20} />
 LoopAI
 </button>

 {showModal && (
 <div className="modal-overlay" onClick={handleClose}>
 <div className="modal modal-loopai" onClick={(e) => e.stopPropagation()}>
 <div className="modal-header">
 <div className="loopai-title-wrapper">
 <Sparkles size={24} className="loopai-icon" />
 <h3 className="modal-title">LoopAI - Ideias de Reutilização</h3>
 </div>
 <button className="modal-close-btn" onClick={handleClose}>
 <X size={20} />
 </button>
 </div>

 <div className="loopai-content">
 {!analysis ? (
 <>
 <p className="loopai-description">
 Envie uma foto do item que você quer reutilizar e receba ideias criativas de como
 transformá-lo em algo novo!
 </p>

 <div className="form-group">
 <input
 type="file"
 id="loopai-image-upload"
 accept="image/*"
 style={{ display: "none" }}
 onChange={handleImageChange}
 disabled={analyzing}
 />
 <label htmlFor="loopai-image-upload" className="image-upload loopai-upload">
 {image ? (
 <img
 src={image}
 alt="Preview"
 style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
 />
 ) : (
 <>
 <div className="image-upload-icon">
 <Upload size={48} />
 </div>
 <p className="image-upload-text">Clique para enviar uma imagem</p>
 <p className="image-upload-hint">PNG, JPG até 10MB</p>
 </>
 )}
 </label>
 </div>

 {error && <div className="loopai-error">{error}</div>}

 <button
 className="btn btn-primary submit-btn"
 onClick={handleAnalyze}
 disabled={!imageFile || analyzing}
 >
 {analyzing ? (
 <>
 <Loader size={18} className="spinner" />
 Analisando...
 </>
 ) : (
 <>
 <Sparkles size={18} />
 Gerar Ideias
 </>
 )}
 </button>
 </>
 ) : (
 <>
 <div className="loopai-result">
 {image && (
 <div className="loopai-result-image">
 <img src={image} alt="Item analisado" />
 </div>
 )}
 <div className="loopai-analysis" dangerouslySetInnerHTML={{ __html: formatMarkdown(analysis) }} />
 </div>

 <div className="loopai-actions">
 <button className="btn btn-secondary" onClick={() => {
 setImage(null)
 setImageFile(null)
 setAnalysis(null)
 setError(null)
 }}>
 Nova Análise
 </button>
 <button className="btn btn-primary" onClick={handleClose}>
 Fechar
 </button>
 </div>
 </>
 )}
 </div>
 </div>
 </div>
 )}
 </>
 )
}

function formatMarkdown(text) {
 return text
 .replace(/^## (.*$)/gim, '<h2>$1</h2>')
 .replace(/^### (.*$)/gim, '<h3>$1</h3>')
 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
 .replace(/\* (.*?)$/gim, '<li>$1</li>')
 .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
 .replace(/---/g, '<hr>')
 .replace(/\n\n/g, '<br><br>')
}
