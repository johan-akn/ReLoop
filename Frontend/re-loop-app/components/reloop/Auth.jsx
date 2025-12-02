"use client"

import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react"
import { useGlobal } from "../../context/global-context"
import { Logo } from "./Logo"

export function Auth() {
  const { login, register } = useGlobal()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmPassword: "",
    telefone: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLogin) {
      const success = await login(formData.email, formData.senha)
      if (!success) {
        setError("Email ou senha inválidos")
      }
    } else {
      if (formData.senha !== formData.confirmPassword) {
        setError("As senhas não coincidem")
        return
      }
      await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
      })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Logo size="large" />
          <p className="auth-subtitle">{isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nome</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="nome"
                  className="form-input with-icon"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input with-icon"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="telefone"
                  className="form-input with-icon"
                  placeholder="+55 11 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                className="form-input with-icon"
                placeholder="••••••••"
                value={formData.senha}
                onChange={handleChange}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirmar Senha</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="form-input with-icon"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-large submit-btn">
            {isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <div className="auth-switch">
          <span className="auth-switch-text">{isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}</span>
          <button type="button" className="auth-switch-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Cadastrar" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  )
}
