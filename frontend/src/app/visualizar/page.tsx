"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VisualizarTokenPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const darkBlue = "#011F2B";

  const go = () => {
    let input = tokenInput.trim();
    if (!input) return;

    let token = input;

    try {
      // Se for URL válida
      const url = new URL(input);
      const parts = url.pathname.split("/").filter(Boolean);
      token = parts[parts.length - 1];
    } catch {
      // Não é URL → trata como texto simples
      token = input.replace(/^\/+|\/+$/g, "");
      const parts = token.split("/").filter(Boolean);
      token = parts[parts.length - 1];
    }

    if (!token) return;

    // Validação opcional (token alfanumérico + - _)
    const isValid = /^[A-Za-z0-9\-_]+$/.test(token);
    if (!isValid) {
      alert("Token inválido.");
      return;
    }

    router.push(`/visualizar/${encodeURIComponent(token)}`);
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          backgroundColor: "white",
          padding: "50px",
          borderRadius: "40px",
          border: `3px solid ${darkBlue}`,
          maxWidth: "1100px",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div
            style={{
              border: `2px solid ${darkBlue}`,
              borderRadius: "30px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "30px",
              }}
            >
              <Image
                src="/logototvs.png"
                alt="TOTVS"
                width={180}
                height={100}
                style={{ objectFit: "contain" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ textAlign: "left" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Token de acesso:
                </label>

                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Insira o token ou a URL completa"
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "20px",
                    border: `1.5px solid ${darkBlue}`,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") go();
                  }}
                />
              </div>

              <button
                onClick={go}
                style={{
                  backgroundColor: darkBlue,
                  color: "white",
                  padding: "15px",
                  borderRadius: "25px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                  width: "250px",
                  margin: "0 auto",
                  textTransform: "uppercase",
                }}
              >
                Visualizar a Senha
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/iconhome.png"
            alt="Segurança"
            width={450}
            height={380}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </main>
  );
}