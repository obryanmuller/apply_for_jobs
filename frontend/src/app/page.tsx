"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ExpiresUnit = "Segundos" | "Minutos" | "Dias";

export default function Page() {
  const [password, setPassword] = useState("");
  const [useLetters, setUseLetters] = useState(false);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);

  const [length, setLength] = useState(9);
  const [expiresValue, setExpiresValue] = useState(23);
  const [expiresUnit, setExpiresUnit] = useState<ExpiresUnit>("Segundos");
  const [viewLimit, setViewLimit] = useState(1);

  const darkBlue = "#011F2B";

  const styles = useMemo(() => {
    const inputNumberStyle: React.CSSProperties = {
      width: "62px",
      height: "30px",
      borderRadius: "10px",
      border: `2px solid ${darkBlue}`,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "15px",
      outline: "none",
      backgroundColor: "white",
      boxSizing: "border-box",
    };

    const pillBtn = (active: boolean): React.CSSProperties => ({
      padding: "6px 12px",
      borderRadius: "20px",
      border: `1.5px solid ${darkBlue}`,
      backgroundColor: active ? darkBlue : "transparent",
      color: active ? "white" : darkBlue,
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "13px",
      whiteSpace: "nowrap",
    });

    return {
      darkBlue,
      inputNumberStyle,
      pillBtn,

      // ↓↓↓ Ajustado para NÃO ficar gigante
      main: {
        display: "flex",
        justifyContent: "center",
        padding: "32px",
        minHeight: "80vh",
      } as React.CSSProperties,

      card: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "28px",
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "34px",
        border: `3px solid ${darkBlue}`,
        maxWidth: "960px",
        width: "100%",
        alignItems: "center",
      } as React.CSSProperties,

      leftCol: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      } as React.CSSProperties,

      box: {
        border: `2px solid ${darkBlue}`,
        borderRadius: "26px",
        padding: "16px",
      } as React.CSSProperties,

      cta: {
        backgroundColor: darkBlue,
        color: "white",
        padding: "14px",
        borderRadius: "22px",
        border: "none",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer",
        width: "100%",
        letterSpacing: "1px",
        textTransform: "uppercase",
      } as React.CSSProperties,
    };
  }, [darkBlue]);

  const toIntOr = (value: string, fallback: number) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const handleGenerate = () => {
    console.log({
      password,
      policy: { useLetters, useDigits, useSymbols, length },
      share: { expiresValue, expiresUnit, viewLimit },
    });
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        {/* COLUNA ESQUERDA */}
        <div style={styles.leftCol}>
          {/* SENHA */}
          <div style={styles.box}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
              Insira a senha
            </label>

            <input
              type="text"
              placeholder="Insira sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "15px",
                border: `1.5px solid ${styles.darkBlue}`,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <p style={{ fontSize: "11px", color: "#666", margin: "8px 0 4px" }}>
              Ou gere uma aleatória
            </p>

            <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "5px" }}>
              Deve conter:
            </div>

            <div style={{ display: "flex", gap: "12px", fontSize: "13px", marginBottom: "12px" }}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={useLetters}
                  onChange={(e) => setUseLetters(e.target.checked)}
                />{" "}
                Letras
              </label>

              <label style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={useDigits}
                  onChange={(e) => setUseDigits(e.target.checked)}
                />{" "}
                Números
              </label>

              <label style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                />{" "}
                Símbolos
              </label>
            </div>

            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Tamanho:</div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="range"
                min={1}
                max={50}
                value={length}
                onChange={(e) => setLength(toIntOr(e.target.value, 9))}
                style={{ flex: 1, accentColor: styles.darkBlue }}
              />

              <input
                type="number"
                min={1}
                max={50}
                value={length}
                onChange={(e) => setLength(toIntOr(e.target.value, 9))}
                style={styles.inputNumberStyle}
              />
            </div>
          </div>

          {/* COMPARTILHAMENTO */}
          <div style={styles.box}>
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "20px",
                marginBottom: "14px",
              }}
            >
              Compartilhamento
            </div>

            <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Expira em:</div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              {(["Segundos", "Minutos", "Dias"] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setExpiresUnit(unit)}
                  type="button"
                  style={styles.pillBtn(expiresUnit === unit)}
                >
                  {unit}
                </button>
              ))}

              <input
                type="number"
                min={1}
                max={60}
                value={expiresValue}
                onChange={(e) => setExpiresValue(toIntOr(e.target.value, 23))}
                style={{ ...styles.inputNumberStyle, marginLeft: "auto" }}
              />
            </div>

            <input
              type="range"
              min={1}
              max={60}
              value={expiresValue}
              onChange={(e) => setExpiresValue(toIntOr(e.target.value, 23))}
              style={{ width: "100%", accentColor: styles.darkBlue, marginBottom: "14px" }}
            />

            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Limite de Visualizações:</div>

            <input
              type="number"
              min={1}
              value={viewLimit}
              onChange={(e) => setViewLimit(toIntOr(e.target.value, 1))}
              style={styles.inputNumberStyle}
            />
          </div>

          <button type="button" style={styles.cta} onClick={handleGenerate}>
            Gerar Senha
          </button>
        </div>

        {/* COLUNA DIREITA */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/iconhome.png"
            alt="Segurança"
            width={360}
            height={300}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </main>
  );
}