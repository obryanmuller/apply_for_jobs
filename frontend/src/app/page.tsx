"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { createPwd } from "@/lib/api";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ NOVO: modal "Token Criado"
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [createdPwdId, setCreatedPwdId] = useState<string | null>(null);

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
        cursor: isSubmitting ? "not-allowed" : "pointer",
        width: "100%",
        letterSpacing: "1px",
        textTransform: "uppercase",
        opacity: isSubmitting ? 0.75 : 1,
      } as React.CSSProperties,
    };
  }, [darkBlue, isSubmitting]);

  const toIntOr = (value: string, fallback: number) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const computeExpirationSeconds = (value: number, unit: ExpiresUnit) => {
    if (unit === "Segundos") return value;
    if (unit === "Minutos") return value * 60;
    return value * 60 * 60 * 24;
  };

  const expirationLabel = () => {
    // só pra exibir no modal (sem cálculo de countdown)
    return `${expiresValue} ${expiresUnit}`;
  };

  const handleGenerate = async () => {
    if (isSubmitting) return;

    const hasPolicy = useLetters || useDigits || useSymbols;
    const hasManual = password.trim().length > 0;

    if (!hasManual && !hasPolicy) {
      alert("Selecione ao menos um tipo (Letras/Números/Símbolos) ou digite uma senha.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...(hasManual ? { sended_password: password.trim() } : {}),
        use_letters: useLetters,
        use_digits: useDigits,
        use_punctuation: useSymbols,
        pass_length: length,
        pass_view_limit: viewLimit,
        expiration_in_seconds: computeExpirationSeconds(expiresValue, expiresUnit),
      };

      const { pwdId } = await createPwd(payload);

      // ✅ NOVO: monta URL do FRONT para compartilhar
      const base = window.location.origin.replace(/\/+$/, "");
      const shareUrl = `${base}/visualizar/${encodeURIComponent(pwdId)}`;

      setCreatedPwdId(pwdId);
      setCreatedUrl(shareUrl);
    } catch (err: any) {
      alert(err?.message ?? "Erro ao gerar senha");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setCreatedUrl(null);
    setCreatedPwdId(null);
  };

  const copyShareUrl = async () => {
    if (!createdUrl) return;
    try {
      await navigator.clipboard.writeText(createdUrl);
    } catch {
      // fallback simples
      alert("Não foi possível copiar automaticamente. Selecione e copie o link.");
    }
  };

  return (
    <>
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
                disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />{" "}
                  Letras
                </label>

                <label style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={useDigits}
                    onChange={(e) => setUseDigits(e.target.checked)}
                    disabled={isSubmitting}
                  />{" "}
                  Números
                </label>

                <label style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={useSymbols}
                    onChange={(e) => setUseSymbols(e.target.checked)}
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />

                <input
                  type="number"
                  min={1}
                  max={50}
                  value={length}
                  onChange={(e) => setLength(toIntOr(e.target.value, 9))}
                  style={styles.inputNumberStyle}
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <input
                type="range"
                min={1}
                max={60}
                value={expiresValue}
                onChange={(e) => setExpiresValue(toIntOr(e.target.value, 23))}
                style={{ width: "100%", accentColor: styles.darkBlue, marginBottom: "14px" }}
                disabled={isSubmitting}
              />

              <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Limite de Visualizações:</div>

              <input
                type="number"
                min={1}
                value={viewLimit}
                onChange={(e) => setViewLimit(toIntOr(e.target.value, 1))}
                style={styles.inputNumberStyle}
                disabled={isSubmitting}
              />
            </div>

            <button type="button" style={styles.cta} onClick={handleGenerate} disabled={isSubmitting}>
              {isSubmitting ? "Gerando..." : "Gerar Senha"}
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

      {/* ✅ MODAL "TOKEN CRIADO" */}
      {createdUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 9999,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "520px",
              maxWidth: "100%",
              borderRadius: "12px",
              border: "2px solid #000",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* barra topo */}
            <div
              style={{
                backgroundColor: "#00151C",
                height: "46px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
              }}
            >
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "white" }} />
              <button
                onClick={closeModal}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                aria-label="Fechar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ padding: "26px 22px", textAlign: "center" }}>
              <h2 style={{ margin: "0 0 14px 0", fontSize: "42px", fontWeight: 900 }}>
                Token Criado
              </h2>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textAlign: "center",
                    maxWidth: "420px",
                    wordBreak: "break-all",
                  }}
                >
                  {createdUrl}
                </div>

                <button
                  onClick={copyShareUrl}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  aria-label="Copiar URL"
                  title="Copiar URL"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00151C" strokeWidth="2.5">
                    <rect x="9" y="9" width="10" height="10" rx="1" />
                    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                  </svg>
                </button>
              </div>

              <div style={{ marginTop: "18px", fontSize: "16px", fontWeight: 900 }}>
                Tempo de expiração:&nbsp;&nbsp; {expirationLabel()}
              </div>

              <div style={{ marginTop: "8px", fontSize: "16px", fontWeight: 900 }}>
                Visualizações restantes:&nbsp;&nbsp; {viewLimit}
              </div>

              {/* opcional: botão pra visualizar agora */}
              {createdPwdId && (
                <button
                  onClick={() => (window.location.href = `/visualizar/${encodeURIComponent(createdPwdId)}`)}
                  style={{
                    marginTop: "18px",
                    backgroundColor: "#00151C",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: "14px",
                    border: "none",
                    fontWeight: 800,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Visualizar agora
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}