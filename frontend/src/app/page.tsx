"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

import { pwdApi } from "@/lib/api/pwd";
import { buildShareUrl, extractTokenFromInput } from "@/lib/utils/token";
import { ExpiresUnit, toExpirationSeconds } from "@/lib/utils/time";
import { generatePassword } from "@/lib/utils/password";
import { TokenCreatedModal } from "@/components/password/TokenCreatedModal";

type Mode = "create" | "view";

function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>("create");
  const isVisualizing = mode === "view";

  useEffect(() => {
    if (searchParams.get("mode") === "view") setMode("view");
  }, [searchParams]);

  // Config / Form
  const [useLetters, setUseLetters] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);

  const [expiresValue, setExpiresValue] = useState(10);
  const [expiresUnit, setExpiresUnit] = useState<ExpiresUnit>("Minutos");
  const [viewLimit, setViewLimit] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState<{ pwdId: string; url: string } | null>(null);

  // View
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");

  const canGenerate = useLetters || useDigits || useSymbols;
  const hasTypedPassword = password.trim().length > 0;
  const isButtonDisabled = !canGenerate && !hasTypedPassword;

  const expiresLabel = useMemo(
    () => `${expiresValue} ${expiresUnit}`,
    [expiresValue, expiresUnit]
  );

  const charsetOptions = useMemo(
    () => [
      { id: "l", label: "ABC", checked: useLetters, set: setUseLetters },
      { id: "d", label: "123", checked: useDigits, set: setUseDigits },
      { id: "s", label: "#$!", checked: useSymbols, set: setUseSymbols },
    ],
    [useLetters, useDigits, useSymbols]
  );

  const unitOptions = useMemo(
    () => ["Segundos", "Minutos", "Dias"] as const,
    []
  );

  const handleGeneratePreview = () => {
    if (!canGenerate) return;
    setPassword(generatePassword({ useLetters, useDigits, useSymbols, length }));
  };

  const handleSave = async () => {
    if (isSubmitting || isButtonDisabled) return;

    try {
      setIsSubmitting(true);

      const payload = {
        ...(hasTypedPassword ? { sended_password: password.trim() } : {}),
        use_letters: useLetters,
        use_digits: useDigits,
        use_punctuation: useSymbols,
        pass_length: length,
        pass_view_limit: Number(viewLimit),
        expiration_in_seconds: toExpirationSeconds(expiresValue, expiresUnit),
      };

      const { pwdId } = await pwdApi.create(payload);
      setCreated({ pwdId, url: buildShareUrl(pwdId) });
    } catch {
      alert("Erro ao criar link seguro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToToken = () => {
    const raw = tokenInput.trim();

    if (!raw) {
      setTokenError("Informe o token ou cole a URL.");
      return;
    }

    const token = extractTokenFromInput(raw);

    if (!token) {
      setTokenError("Token inválido.");
      return;
    }

    setTokenError("");
    router.push(`/visualizar/${encodeURIComponent(token)}`);
  };

  const toggleMode = () => setMode(isVisualizing ? "create" : "view");

  return (
    <main className={styles.main}>
      <div className={`${styles.card} ${isVisualizing ? styles.isVisualizing : ""}`}>
        {/* Face Criação */}
        <div className={`${styles.sideFace} ${styles.createFace}`}>
          <div className={styles.formCol}>
            <header className={styles.mainHeader}>
              <h2>Gerar Acesso Protegido</h2>
            </header>

            <section className={styles.section}>
              <label className={styles.boxTitle}>Sua Senha</label>

              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite ou use a varinha..."
                />

                <button
                  type="button"
                  className={styles.innerGenerateBtn}
                  onClick={hasTypedPassword ? () => setPassword("") : handleGeneratePreview}
                >
                  {hasTypedPassword ? "✕" : "🎲"}
                </button>
              </div>
            </section>

            {!hasTypedPassword && (
              <section className={styles.section}>
                <label className={styles.boxTitle}>
                  Customização <span className={styles.dynamicLabel}>{length} CARACTERES</span>
                </label>

                <div className={styles.checkboxGroup}>
                  {charsetOptions.map((opt) => (
                    <label key={opt.id}>
                      <input
                        type="checkbox"
                        checked={opt.checked}
                        onChange={(e) => opt.set(e.target.checked)}
                        className={styles.hiddenCheckbox}
                      />
                      <span className={styles.customCheck}>{opt.label}</span>
                    </label>
                  ))}
                </div>

                <div className={styles.controlRow}>
                  <input
                    type="range"
                    min={4}
                    max={64}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className={styles.range}
                  />
                  <div className={styles.numberDisplay}>{length}</div>
                </div>
              </section>
            )}

            <section className={styles.section}>
              <label className={styles.boxTitle}>
                Destruição{" "}
                <span className={styles.dynamicLabel}>
                  {expiresValue} {expiresUnit}
                </span>
              </label>

              <div className={styles.pillGroup}>
                {unitOptions.map((u) => (
                  <button
                    key={u}
                    type="button"
                    className={`${styles.pillBtn} ${expiresUnit === u ? styles.pillBtnActive : ""}`}
                    onClick={() => setExpiresUnit(u)}
                  >
                    {u}
                  </button>
                ))}
              </div>

              <div className={styles.controlRow}>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={expiresValue}
                  onChange={(e) => setExpiresValue(Number(e.target.value))}
                  className={styles.range}
                />
                <div className={styles.numberDisplay}>{expiresValue}</div>
              </div>

              <div className={styles.viewLimitBox}>
                <div className={styles.viewLimitText}>
                  <span className={styles.limitTitle}>Limite de Acessos</span>
                  <span className={styles.limitSub}>
                    Quantidade de vezes que o link pode ser aberto
                  </span>
                </div>

                <div className={styles.counterControl}>
                  <button
                    type="button"
                    onClick={() => setViewLimit((p) => Math.max(1, p - 1))}
                    className={styles.counterBtn}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={viewLimit}
                    readOnly
                    className={styles.counterInput}
                  />

                  <button
                    type="button"
                    onClick={() => setViewLimit((p) => p + 1)}
                    className={styles.counterBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            </section>

            <button
              className={styles.ctaButton}
              onClick={handleSave}
              disabled={isSubmitting || isButtonDisabled}
            >
              {isSubmitting ? "CRIANDO..." : "GERAR LINK SEGURO"}
            </button>
          </div>
        </div>

        {/* Face Visualização */}
        <div className={`${styles.sideFace} ${styles.viewFace}`}>
          <div className={styles.formColCenter}>
            <Image src="/logototvs.png" alt="TOTVS" width={160} height={60} priority />

            <section className={styles.section} style={{ width: "100%" }}>
              <label className={styles.boxTitle}>Token de Acesso</label>

              <input
                className={styles.input}
                placeholder="Insira o token ou cole a URL"
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  if (tokenError) setTokenError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleGoToToken()}
              />

              {!!tokenError && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "6px",
                    display: "block",
                  }}
                >
                  {tokenError}
                </span>
              )}
            </section>

            <button className={styles.ctaButton} onClick={handleGoToToken}>
              Visualizar Segredo →
            </button>

            <p className={styles.securityWarning}>
              🔒 Sua conexão é privada. O conteúdo será automaticamente removido após atingir o tempo de validade ou o limite de acessos.
            </p>
          </div>
        </div>

        {/* Overlay */}
        <aside className={styles.overlay}>
          <div className={styles.overlayContent}>
            <Image src="/iconhomewhite.png" alt="Icon" width={90} height={90} />
            <h3 className={styles.rightTitle}>Privacidade Absoluta</h3>

            <p className={styles.rightDesc}>
              {isVisualizing
                ? "Deseja proteger um novo dado? Volte para criar um link criptografado."
                : "Recebeu um link? Alterne para visualizar o conteúdo de forma segura."}
            </p>

            <button className={styles.switchButton} onClick={toggleMode}>
              {isVisualizing ? "QUERO GERAR" : "QUERO VISUALIZAR"}
            </button>
          </div>
        </aside>
      </div>

      <TokenCreatedModal
        open={!!created}
        url={created?.url ?? ""}
        expiresLabel={expiresLabel}
        viewLimit={viewLimit}
        onClose={() => setCreated(null)}
        onCopy={async () => {
          if (created?.url) await navigator.clipboard.writeText(created.url);
        }}
        onViewNow={() => {
          if (created?.pwdId) router.push(`/visualizar/${encodeURIComponent(created.pwdId)}`);
        }}
      />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MainContent />
    </Suspense>
  );
}