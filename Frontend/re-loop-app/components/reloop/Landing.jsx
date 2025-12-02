"use client";

import { useGlobal } from "../../context/global-context";
import { Logo } from "./Logo";

export function Landing() {
  const { navigate } = useGlobal();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="texto-logo">
          <div className="landing-logo">
            <img
              src="./public/Logo_Reloop_preta.svg"
              alt="ReLoop_branca.svg"
              className="landing-logo"
            />
          </div>
          <div className="texto-landing">
            <h1 className="landing-tagline">
              Dê Nova Vida ao Que Você Não Usa -{" "}
              <strong style={{}}>Entre no Reloop</strong>
            </h1>
            <p className="landing-description">
              Junte-se à nossa comunidade de consumidores conscientes. Dê uma
              segunda vida aos seus itens ou encontre tesouros de outras pessoas.
            </p>
          </div>
        </div>
        <div className="botoes-lading">
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate("auth")}
          >
            Começar
          </button>
        </div>
      </div>
      <div className="img-landing">
        <img
          src="./public/imagem_landingPage.png"
          alt="landing_image.svg"
          className="landing-image"
        />
      </div>
    </div>
  );
}
