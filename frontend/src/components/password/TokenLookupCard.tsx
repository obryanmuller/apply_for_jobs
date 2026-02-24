"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { extractTokenFromInput } from "@/lib/utils/token";
import styles from "./TokenLookupCard.module.css";

export function TokenLookupCard() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");

  const go = () => {
    const token = extractTokenFromInput(tokenInput);
    if (!token) {
      alert("Token ou URL inválida. Por favor, verifique o código informado.");
      return;
    }
    router.push(`/visualizar/${encodeURIComponent(token)}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.leftCol}>
          <div className={styles.logoWrap}>
            {/* Logo atualizada para o tema claro da coluna esquerda */}
            <Image 
              src="/logototvs.png" 
              alt="TOTVS" 
              width={150} 
              height={50} 
              style={{ objectFit: "contain" }} 
            />
          </div>

          <div className={styles.formCol}>
            <div style={{ textAlign: "left" }}>
              <label className={styles.label}>Token de acesso</label>

              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Insira o token ou cole a URL"
                className={styles.input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") go();
                }}
              />
            </div>

            <button onClick={go} className={styles.ctaButton}>
              Visualizar Segredo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.rightWrap}>
          <Image 
            src="/iconhomewhite.png" 
            alt="Segurança" 
            width={250} 
            height={250} 
            priority 
            style={{ objectFit: "contain" }} 
          />
        </div>
      </div>
    </main>
  );
}