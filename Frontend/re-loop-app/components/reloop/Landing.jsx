"use client"

import { useGlobal } from "@/context/global-context"
import { Logo } from "./Logo"

export function Landing() {
  const { navigate } = useGlobal()

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-logo">
          <Logo size="large" />
        </div>
        <h1 className="landing-tagline">Troca & Doação Sustentável.</h1>
        <p className="landing-description">
          Junte-se à nossa comunidade de consumidores conscientes. Dê uma segunda vida aos seus itens ou encontre
          tesouros de outras pessoas.
        </p>
        <button className="btn btn-primary btn-large" onClick={() => navigate("auth")}>
          Começar
        </button>
      </div>
    </div>
  )
}
