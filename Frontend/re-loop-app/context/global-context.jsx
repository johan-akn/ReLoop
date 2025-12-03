"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate as useRRNavigate } from "react-router-dom"
import { UsersAPI, ItemsAPI, AuthAPI } from "@/src/apiService"
import { Toast } from "@/components/reloop/Toast"

const GlobalContext = createContext(undefined)

export function GlobalProvider({ children }) {
  const location = useLocation()
  const rrNavigate = useRRNavigate()

  const pathToView = useMemo(
    () => ({
      "/": "home",
      "/home": "home",
      "/add": "add-item",
      "/profile": "profile",
      "/saved": "saved",
      "/auth": "auth",
      "/landing": "landing",
    }),
    [],
  )

  const viewToPath = useMemo(
    () => ({
      "home": "/",
      "add-item": "/add",
      "profile": "/profile",
      "saved": "/saved",
      "auth": "/auth",
      "landing": "/landing",
    }),
    [],
  )

  const initialView = pathToView[location?.pathname] ?? "home"
  const [currentView, setCurrentView] = useState(initialView)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [users, setUsers] = useState([])
  const [itemP, setItems] = useState([])
  const [savedItems, setSavedItems] = useState([])
  const [toasts, setToasts] = useState([])

  // Função para exibir toast
  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  // Função para remover toast
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Load initial data
  useEffect(() => {
    const load = async () => {
      try {
        const [u, p] = await Promise.all([UsersAPI.list(), ItemsAPI.list()])
        setUsers(u)
        setItems(p)
      } catch (e) {
        console.error("Falha ao carregar dados iniciais:", e)
      }
    }
    load()
  }, [])

  // Validar token e recuperar usuário logado ao carregar a aplicação
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken")
      console.log("Verificando token no localStorage:", token)
      
      if (token) {
        try {
          console.log("Validando token com o backend...")
          const resp = await AuthAPI.getLoggedUser()
          console.log("Resposta da validação:", resp)
          
          if (resp?.user) {
            console.log("Token válido! Restaurando sessão do usuário:", resp.user)
            setCurrentUser(resp.user)
            setIsAuthenticated(true)
            
            // Navegar para home se estiver em landing ou auth
            if (location.pathname === "/landing" || location.pathname === "/auth") {
              navigate("home", { replace: true })
            }
          } else {
            // Token inválido, limpar localStorage
            console.warn("Token inválido - limpando localStorage")
            localStorage.removeItem("authToken")
          }
        } catch (e) {
          console.error("Token inválido ou expirado:", e)
          localStorage.removeItem("authToken")
        }
      } else {
        console.log("Nenhum token encontrado no localStorage")
      }
    }
    validateToken()
  }, [])

  const navigate = (view, options) => {
    const path = viewToPath[view] ?? "/"
    if (path !== location.pathname) {
      rrNavigate(path, options)
    }
    setCurrentView(view)
  }

  const login = async (email, senha) => {
    try {
      const resp = await AuthAPI.login({ email, senha })
      console.log("Resposta do login:", resp)
      
      if (resp?.user && resp?.token) {
        // Salvar token no localStorage
        localStorage.setItem("authToken", resp.token)
        console.log("Token salvo no localStorage:", resp.token)
        
        setCurrentUser(resp.user)
        setIsAuthenticated(true)
        
        // opcional: garantir lista em memória atualizada
        if (!users.length) {
          try { setUsers(await UsersAPI.list()) } catch {}
        }
        showToast("Login realizado com sucesso!", "success")
        navigate("home", { replace: true })
        return true
      } else {
        console.error("Login falhou: resposta não contém user ou token", resp)
        showToast("Email ou senha inválidos", "error")
        return false
      }
    } catch (e) {
      console.error("Erro no login:", e)
      showToast("Erro ao realizar login. Tente novamente.", "error")
      return false
    }
  }

  const register = async (userData) => {
    try {
      const created = await UsersAPI.create(userData)
      setUsers([...users, created])
      setCurrentUser(created)
      setIsAuthenticated(true)
      showToast("Conta criada com sucesso!", "success")
      navigate("home", { replace: true })
      return true
    } catch (e) {
      console.error("Erro ao registrar:", e)
      showToast("Erro ao criar conta. Tente novamente.", "error")
      return false
    }
  }

  const logout = () => {
    // Limpar token do localStorage
    localStorage.removeItem("authToken")
    setCurrentUser(null)
    setIsAuthenticated(false)
    navigate("landing", { replace: true })
  }

  useEffect(() => {
    const view = pathToView[location.pathname] ?? "home"
    if (view !== currentView) {
      setCurrentView(view)
    }
  }, [location.pathname, pathToView, currentView])

  const updateUser = async (userData) => {
    if (!currentUser) return
    try {
      const updated = await UsersAPI.update(currentUser.id_usuario, userData)
      setCurrentUser(updated)
      setUsers(users.map((u) => (u.id_usuario === updated.id_usuario ? updated : u)))
      showToast("Perfil atualizado com sucesso!", "success")
    } catch (e) {
      console.error("Erro ao atualizar usuário:", e)
      showToast("Erro ao atualizar perfil. Tente novamente.", "error")
    }
  }

  const deleteAccount = async () => {
    if (!currentUser) return
    try {
      await UsersAPI.remove(currentUser.id_usuario)
      setUsers(users.filter((u) => u.id_usuario !== currentUser.id_usuario))
      setItems(itemP.filter((p) => p.fk_id_usuario !== currentUser.id_usuario))
      logout()
    } catch (e) {
      console.error("Erro ao excluir conta:", e)
    }
  }

  const addItem = async (itemData) => {
    if (!currentUser) return
    try {
      const payload = {
        ...itemData,
        fk_id_usuario: currentUser.id_usuario,
        status: itemData?.status || "disponivel",
      }
      const created = await ItemsAPI.create(payload)
      setItems([...itemP, created])
      showToast("Item adicionado com sucesso!", "success")
      return true
    } catch (e) {
      console.error("Erro ao criar produto:", e)
      showToast("Erro ao adicionar item. Tente novamente.", "error")
      return false
    }
  }

  const updateItem = async (itemId, itemData) => {
    try {
      const updated = await ItemsAPI.update(itemId, itemData)
      setItems(itemP.map((p) => (p.id_item === itemId ? updated : p)))
      showToast("Item atualizado com sucesso!", "success")
    } catch (e) {
      console.error("Erro ao atualizar produto:", e)
      showToast("Erro ao atualizar item. Tente novamente.", "error")
    }
  }

  const deleteItem = async (itemId) => {
    try {
      await ItemsAPI.remove(itemId)
      setItems(itemP.filter((p) => p.id_item !== itemId))
      setSavedItems(savedItems.filter((id) => id !== itemId))
      showToast("Item excluído com sucesso!", "success")
    } catch (e) {
      console.error("Erro ao excluir produto:", e)
      showToast("Erro ao excluir item. Tente novamente.", "error")
    }
  }

  const toggleItemStatus = async (itemId) => {
    const prod = itemP.find((p) => p.id_item === itemId)
    if (!prod) return
    const nextStatus = prod.status === "disponivel" ? "finalizado" : "disponivel"
    await updateItem(itemId, { status: nextStatus })
  }

  const getUserItems = () => {
    return itemP.filter((p) => p.fk_id_usuario === currentUser?.id_usuario)
  }

  const toggleSaveItem = (itemId) => {
    if (savedItems.includes(itemId)) {
      setSavedItems(savedItems.filter((id) => id !== itemId))
    } else {
      setSavedItems([...savedItems, itemId])
    }
  }

  const isItemSaved = (itemId) => savedItems.includes(itemId)

  const getSavedItems = () => itemP.filter((p) => savedItems.includes(p.id_item))

  const getUserById = (userId) => users.find((u) => u.id_usuario === userId)

  return (
    <GlobalContext.Provider
      value={{
        currentView,
        navigate,
        currentUser,
        isAuthenticated,
        users,
        items: itemP,
        itemP,
        savedItems,
        login,
        register,
        logout,
        updateUser,
        deleteAccount,
        addItem,
        updateItem,
        deleteItem,
        toggleItemStatus,
        getUserItems,
        toggleSaveItem,
        isItemSaved,
        getSavedItems,
        getUserById,
        showToast,
      }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider")
  }
  return context
}
