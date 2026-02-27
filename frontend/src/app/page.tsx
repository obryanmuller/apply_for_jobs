"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

import { pwdApi } from "@/lib/api/pwd";
import { buildShareUrl, extractTokenFromInput } from "@/lib/utils/token";
import { ExpiresUnit, toExpirationSeconds } from "@/lib/utils/time";
import { generatePassword } from "@/lib/utils/password";
import { ActionErrorModal } from "@/components/ui/ActionErrorModal";
import { TokenCreatedModal } from "@/components/password/TokenCreatedModal";

function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"create" | "view">("create");
  const isVisualizing = mode === "view";

  useEffect(() => {
    if (searchParams.get("mode") === "view") setMode("view");
  }, [searchParams]);

  // Estados do formulário
  const [useLetters, setUseLetters] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [length, setLength] = useState<number | "">(12);
  const [expiresValue, setExpiresValue] = useState<number | "">(10);
  const [expiresUnit, setExpiresUnit] = useState<ExpiresUnit>("Minutos");
  const [viewLimit, setViewLimit] = useState<number | "">(1);

  // Estados de feedback e controle
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState<{ pwdId: string; url: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados de validação local
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [configError, setConfigError] = useState("");

  const canGenerate = useLetters || useDigits || useSymbols;
  const hasTypedPassword = password.trim().length > 0;
  const expiresLabel = useMemo(() => `${expiresValue} ${expiresUnit}`, [expiresValue, expiresUnit]);

  const charsetOptions = [
    { id: "l", label: "ABC", checked: useLetters, set: setUseLetters },
    { id: "d", label: "123", checked: useDigits, set: setUseDigits },
    { id: "s", label: "#$!", checked: useSymbols, set: setUseSymbols },
  ];

  const unitOptions: ExpiresUnit[] = ["Segundos", "Minutos", "Dias"];

  const handleGeneratePreview = () => {
    if (!canGenerate) return setConfigError("Selecione ao menos um tipo de caractere.");
    
    const len = Number(length);

    if (!Number.isFinite(len) || !Number.isInteger(len)) return setConfigError("Tamanho inválido.");
    if (len < 8) return setConfigError("O tamanho mínimo para gerar é 8.");
    if (len > 128) return setConfigError("O tamanho máximo permitido é 128.");

    
    setConfigError("");
    setPassword(generatePassword({ useLetters, useDigits, useSymbols, length: len }));
  };

  const handleSave = async () => {
    const exp = Number(expiresValue);
    const len = Number(length);
    const limit = Number(viewLimit);

    // Validações de interface (Frontend Guard)
    if (!canGenerate && !hasTypedPassword) return setConfigError("Defina uma senha ou parametrize a geração.");
    if (!expiresValue || exp < 1) return setConfigError("O tempo de destruição deve ser no mínimo 1.");
    if (exp > 999) return setConfigError("O tempo de destruição é muito alto.");
    if (!viewLimit || limit < 1) return setConfigError("O limite de acessos deve ser no mínimo 1.");
    if (limit > 100) return setConfigError("O limite máximo de acessos permitido é 100.");

    if (!hasTypedPassword) {
      if (!Number.isFinite(len) || !Number.isInteger(len)) 
        return setConfigError("Tamanho inválido.");
      if (len < 8) return setConfigError("O tamanho mínimo para gerar é 8.");
    }

    try {
      setIsSubmitting(true);
      setConfigError("");
      setErrorMessage(null);

      const payload = {
        ...(hasTypedPassword ? { sended_password: password.trim() } : {}),
        use_letters: useLetters,
        use_digits: useDigits,
        use_punctuation: useSymbols,
        pass_length: len || 12,
        pass_view_limit: limit,
        expiration_in_seconds: toExpirationSeconds(exp, expiresUnit),
      };

      const { pwdId } = await pwdApi.create(payload);
      setCreated({ pwdId, url: buildShareUrl(pwdId) });
    } catch (err: any) {
      const msg = err.response?.data?.message || "O servidor de segurança não respondeu. Verifique sua conexão e tente novamente.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToToken = () => {
    const raw = tokenInput.trim();
    if (!raw) return setTokenError("Informe o token ou cole a URL.");
    const token = extractTokenFromInput(raw);
    if (!token) return setTokenError("Token inválido.");
    setTokenError("");
    router.push(`/visualizar/${encodeURIComponent(token)}`);
  };

  const toggleMode = () => setMode(prev => prev === "create" ? "view" : "create");

  return (
    <main className={styles.main}>
      <div className={`${styles.card} ${isVisualizing ? styles.isVisualizing : ""}`}>
        {/* FACE DE CRIAÇÃO */}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (configError) setConfigError("");
                  }}
                  placeholder="Digite ou use o dado..."
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
                  Customização <span className={styles.dynamicLabel}>{length || 0} CARACTERES</span>
                </label>
                <div className={styles.checkboxGroup}>
                  {charsetOptions.map((opt) => (
                    <label key={opt.id}>
                      <input
                        type="checkbox"
                        checked={opt.checked}
                        onChange={(e) => {
                          opt.set(e.target.checked);
                          if (configError) setConfigError("");
                        }}
                        className={styles.hiddenCheckbox}
                      />
                      <span className={styles.customCheck}>{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.controlRow}>
                  <input
                    type="range"
                    min={8}
                    max={128}
                    value={length || 8}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className={styles.range}
                  />
                  <input 
                    type="number"
                    className={styles.numberInput}
                    value={length}
                    onChange={(e) => setLength(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </div>
              </section>
            )}

            {configError && <span className={styles.errorLabel}>{configError}</span>}

            <section className={styles.section}>
              <label className={styles.boxTitle}>
                Destruição <span className={styles.dynamicLabel}>{expiresValue || 0} {expiresUnit}</span>
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
                  type="range" min={1} max={60}
                  value={expiresValue || 1}
                  onChange={(e) => setExpiresValue(Number(e.target.value))}
                  className={styles.range}
                />
                <input 
                    type="number"
                    className={styles.numberInput}
                    value={expiresValue}
                    onChange={(e) => setExpiresValue(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className={styles.viewLimitBox}>
                <div className={styles.viewLimitText}>
                  <span className={styles.limitTitle}>Limite de Acessos</span>
                  <span className={styles.limitSub}>Vezes que o link pode ser aberto</span>
                </div>
                <div className={styles.counterControl}>
                  <button type="button" onClick={() => setViewLimit((p) => Math.max(1, Number(p) - 1))} className={styles.counterBtn}>-</button>
                  <input 
                    type="number" 
                    value={viewLimit} 
                    onChange={(e) => setViewLimit(e.target.value === "" ? "" : Number(e.target.value))}
                    className={styles.counterInput} 
                  />
                  <button type="button" onClick={() => setViewLimit((p) => Number(p) + 1)} className={styles.counterBtn}>+</button>
                </div>
              </div>
            </section>

            <button className={styles.ctaButton} onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "CRIANDO..." : "GERAR LINK SEGURO"}
            </button>

            <button type="button" onClick={toggleMode} className={styles.mobileOnlyLink}>
              Já tenho um token para visualizar
            </button>
          </div>
        </div>

        {/* FACE DE VISUALIZAÇÃO */}
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
              {tokenError && <span className={styles.errorLabel}>{tokenError}</span>}
            </section>
            
            <button className={styles.ctaButton} onClick={handleGoToToken}>
              Visualizar Segredo →
            </button>

            <button type="button" onClick={toggleMode} className={styles.mobileOnlyLink}>
              Quero gerar um novo link seguro
            </button>

            <p className={styles.securityWarning}>
              🔒 Sua conexão é privada. O conteúdo será removido após a validade ou limite.
            </p>
          </div>
        </div>

        {/* OVERLAY LATERAL (DESKTOP) */}
        <aside className={styles.overlay}>
          <div className={styles.overlayContent}>
            <Image src="/iconhomewhite.png" alt="Icon" width={90} height={90} />
            <h3 className={styles.rightTitle}>Privacidade Absoluta</h3>
            <p className={styles.rightDesc}>
              {isVisualizing ? "Deseja proteger um novo dado? Volte para criar." : "Recebeu um link? Alterne para visualizar."}
            </p>
            <button className={styles.switchButton} onClick={toggleMode}>
              {isVisualizing ? "QUERO GERAR" : "QUERO VISUALIZAR"}
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL DE SUCESSO */}
      <TokenCreatedModal
        open={!!created}
        url={created?.url ?? ""}
        expiresLabel={expiresLabel}
        viewLimit={Number(viewLimit)}
        onClose={() => setCreated(null)}
        onCopy={async () => { if (created?.url) await navigator.clipboard.writeText(created.url); }}
        onViewNow={() => { if (created?.pwdId) router.push(`/visualizar/${encodeURIComponent(created.pwdId)}`); }}
      />

      <ActionErrorModal 
        open={!!errorMessage}
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
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