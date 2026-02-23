"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface PwdData {
  pwd: string;
  expiration_date: number;
  view_count: number;
}

export default function Page() {
  const { pwdId } = useParams<{ pwdId: string }>();
  const router = useRouter();
  const [isRevealed, setIsRevealed] = useState(false);
  const [data, setData] = useState<PwdData | null>(null);

  const darkBlue = "#00151C"; // Tom de azul quase preto da imagem
  const cyanColor = "#00BDD6";

  useEffect(() => {
    // Simulando dados
    setData({
      pwd: "Senha123",
      expiration_date: 120,
      view_count: 1,
    });
    setIsRevealed(true);
  }, [pwdId]);

  const handleClose = () => router.push("/visualizar");

  return (
    <main style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh", 
      backgroundColor: "#757575" 
    }}>
      {isRevealed && data && (
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "410px",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
          border: "1px solid #000",
          fontFamily: "'Inter', 'Arial Black', sans-serif"
        }}>
          {/* BARRA SUPERIOR - Ajustada para ser mais fina */}
          <div style={{
            backgroundColor: darkBlue,
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 12px"
          }}>
            <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* CONTEÚDO - Espaçamentos internos recalibrados */}
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            
            <h2 style={{ 
              fontSize: "36px", 
              fontWeight: "900", 
              margin: "0 0 25px 0", 
              color: "#000",
              letterSpacing: "-1px"
            }}>
              Senha:
            </h2>

            {/* AREA DA SENHA */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "8px",
              marginBottom: "35px" 
            }}>
              <div style={{
                border: "1px solid #CCCCFF", // Borda lilás clarinha
                padding: "8px 20px",
                fontSize: "50px",
                fontWeight: "900",
                color: "#000",
                lineHeight: "1.1"
              }}>
                {data.pwd}
              </div>
              
              <button 
                onClick={() => navigator.clipboard.writeText(data.pwd)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={darkBlue} strokeWidth="2.5">
                  <rect x="9" y="9" width="10" height="10" rx="1" />
                  <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                </svg>
              </button>
            </div>

            {/* TEMPO DE EXPIRAÇÃO */}
            <p style={{ 
              fontSize: "18px", 
              fontWeight: "900", 
              margin: "0 0 30px 0", 
              color: "#000" 
            }}>
              Tempo de expiração: 2 Minutos
            </p>

            {/* AVISO INFERIOR - Com quebra de linha como no print */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "12px",
              padding: "0 40px"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cyanColor} strokeWidth="3">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              <p style={{ 
                fontSize: "16px", 
                fontWeight: "900", 
                color: "#000", 
                margin: 0, 
                lineHeight: "1.2",
                textAlign: "center"
              }}>
                Esta senha pode ser visualizada <br /> apenas <strong>X</strong> vezes.
              </p>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}