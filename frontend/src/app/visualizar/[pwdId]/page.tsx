"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPwd } from "@/lib/api";

interface PwdData {
  pwd: string;
  expiration_date: number; // epoch seconds (conforme backend)
  view_count: number;
}

export default function Page() {
  const { pwdId } = useParams<{ pwdId: string }>();
  const router = useRouter();

  const [isRevealed, setIsRevealed] = useState(false);
  const [data, setData] = useState<PwdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const darkBlue = "#00151C";
  const cyanColor = "#00BDD6";

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrMsg(null);

        const resp = await getPwd(String(pwdId));
        if (!alive) return;

        setData({
          pwd: resp.pwd,
          expiration_date: resp.expiration_date,
          view_count: resp.view_count,
        });
        setIsRevealed(true);
      } catch (e: any) {
        if (!alive) return;
        setErrMsg(e?.message ?? "Senha indisponível/expirada.");
        setIsRevealed(false);
        setData(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [pwdId]);

  const handleClose = () => router.push("/visualizar");

  const expiryText = useMemo(() => {
    if (!data?.expiration_date) return "";
    const expMs = data.expiration_date * 1000;
    const diffMs = expMs - Date.now();
    if (diffMs <= 0) return "Expirada";

    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes <= 0) return `${seconds} Segundos`;
    return `${minutes} Minutos`;
  }, [data?.expiration_date]);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#757575",
      }}
    >
      {/* Loading */}
      {loading && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "410px",
            overflow: "hidden",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
            border: "1px solid #000",
            fontFamily: "'Inter', 'Arial Black', sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: darkBlue,
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 12px",
            }}
          >
            <button
              onClick={handleClose}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div style={{ padding: "40px 20px" }}>
            <p style={{ fontSize: "18px", fontWeight: 900, margin: 0 }}>Carregando…</p>
          </div>
        </div>
      )}

      {/* Erro (expirada/sem views) */}
      {!loading && errMsg && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "410px",
            overflow: "hidden",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
            border: "1px solid #000",
            fontFamily: "'Inter', 'Arial Black', sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: darkBlue,
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 12px",
            }}
          >
            <button
              onClick={handleClose}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div style={{ padding: "40px 20px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 12px 0" }}>Indisponível</h2>
            <p style={{ fontSize: "14px", fontWeight: 800, margin: 0 }}>{errMsg}</p>

            <button
              onClick={handleClose}
              style={{
                marginTop: "20px",
                backgroundColor: darkBlue,
                color: "white",
                padding: "12px 18px",
                borderRadius: "16px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Sucesso */}
      {!loading && isRevealed && data && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "410px",
            overflow: "hidden",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
            border: "1px solid #000",
            fontFamily: "'Inter', 'Arial Black', sans-serif",
          }}
        >
          <div
            style={{
              backgroundColor: darkBlue,
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 12px",
            }}
          >
            <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "900",
                margin: "0 0 25px 0",
                color: "#000",
                letterSpacing: "-1px",
              }}
            >
              Senha:
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "35px",
              }}
            >
              <div
                style={{
                  border: "1px solid #CCCCFF",
                  padding: "8px 20px",
                  fontSize: "50px",
                  fontWeight: "900",
                  color: "#000",
                  lineHeight: "1.1",
                  wordBreak: "break-all",
                }}
              >
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

            <p style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 30px 0", color: "#000" }}>
              Tempo de expiração: {expiryText || "—"}
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "0 40px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cyanColor} strokeWidth="3">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "900",
                  color: "#000",
                  margin: 0,
                  lineHeight: "1.2",
                  textAlign: "center",
                }}
              >
                Esta senha pode ser visualizada <br /> apenas <strong>X</strong> vezes.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}