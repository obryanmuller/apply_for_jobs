"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import { pwdApi } from "@/lib/api/pwd";
import { buildShareUrl } from "@/lib/utils/token";
import { ExpiresUnit, toExpirationSeconds } from "@/lib/utils/time";
import { generatePassword } from "@/lib/utils/password";
import { TokenCreatedModal } from "@/components/password/TokenCreatedModal";

export default function Page() {
  const router = useRouter();

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

  const canGenerate = useLetters || useDigits || useSymbols;
  const hasTypedPassword = password.trim().length > 0;
  const isButtonDisabled = !canGenerate && !hasTypedPassword;

  const expiresLabel = useMemo(() => `${expiresValue} ${expiresUnit}`, [expiresValue, expiresUnit]);

  const handleGeneratePreview = () => {
    if (!canGenerate) return;
    const pwd = generatePassword({ useLetters, useDigits, useSymbols, length });
    setPassword(pwd);
  };

  const handleClear = () => setPassword("");

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
        pass_view_limit: viewLimit,
        expiration_in_seconds: toExpirationSeconds(expiresValue, expiresUnit),
      };
      const { pwdId } = await pwdApi.create(payload);
      setCreated({ pwdId, url: buildShareUrl(pwdId) });
    } catch (e: any) {
      alert("Erro ao criar link seguro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.leftCol}>
          
          <section className={styles.section}>
            <header className={styles.boxTitle}>
              Sua Senha
              {hasTypedPassword && <span className={styles.dynamicLabel}>Manual</span>}
            </header>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Digite ou use a varinha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputText}
              />
              <button 
                type="button" 
                className={styles.innerGenerateBtn} 
                onClick={hasTypedPassword ? handleClear : handleGeneratePreview}
                disabled={!hasTypedPassword && !canGenerate}
              >
                {hasTypedPassword ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : "🪄"}
              </button>
            </div>
          </section>

          {!hasTypedPassword && (
            <section className={`${styles.section} ${styles.fadeIn}`}>
              <p className={styles.hintText}>
                * Estes parâmetros serão usados para gerar uma senha aleatória segura.
              </p>
              <header className={styles.boxTitle}>
                Customização
                <span className={styles.dynamicLabel}>{length} caracteres</span>
              </header>
              <div className={styles.checkboxGroup}>
                {[
                  { id: 'l', label: "ABC", state: useLetters, fn: setUseLetters },
                  { id: 'd', label: "123", state: useDigits, fn: setUseDigits },
                  { id: 's', label: "#$!", state: useSymbols, fn: setUseSymbols }
                ].map(item => (
                  <label key={item.id} className={styles.checkboxLabel}>
                    <input type="checkbox" checked={item.state} onChange={e => item.fn(e.target.checked)} hidden />
                    <span className={styles.customCheck}>{item.label}</span>
                  </label>
                ))}
              </div>

              <div className={styles.controlRow}>
                  <input type="range" min={4} max={100} value={length} onChange={e => setLength(Number(e.target.value))} className={styles.range} />
                  <input type="number" min={4} max={100} value={length} onChange={e => setLength(Number(e.target.value))} className={styles.numberInput} />
              </div>
            </section>
          )}

          <section className={styles.section}>
            <header className={styles.boxTitle}>
              Regras de Destruição
              <span className={styles.dynamicLabel}>Expira em {expiresValue} {expiresUnit.toLowerCase()}</span>
            </header>
            
            <div className={styles.pillGroup}>
              {(["Segundos", "Minutos", "Dias"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  className={`${styles.pillBtn} ${expiresUnit === unit ? styles.pillBtnActive : ""}`}
                  onClick={() => setExpiresUnit(unit)}
                >
                  {unit}
                </button>
              ))}
            </div>

            <div className={styles.controlRow}>
              <input type="range" min={1} max={60} value={expiresValue} onChange={e => setExpiresValue(Number(e.target.value))} className={styles.range} />
              <input type="number" min={1} value={expiresValue} onChange={e => setExpiresValue(Number(e.target.value))} className={styles.numberInput} />
            </div>

            <div className={styles.controlRow}>
                <span className={styles.maxAccessLabel}>Máximo de Acessos</span>
                <input 
                    type="number" min={1} value={viewLimit} 
                    onChange={e => setViewLimit(Math.max(1, Number(e.target.value)))} 
                    className={styles.numberInput} 
                />
            </div>
          </section>

          <button type="button" className={styles.cta} onClick={handleSave} disabled={isSubmitting || isButtonDisabled}>
            {isSubmitting ? "CRIANDO..." : hasTypedPassword ? "PROTEGER MINHA SENHA" : "CRIAR LINK SEGURO"}
            {!isSubmitting && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            )}
          </button>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.iconCircle}>
            <Image src="/iconhomewhite.png" alt="Totvs" width={100} height={100} priority />
          </div>
          <h2 className={styles.rightTitle}>Privacidade Absoluta</h2>
          <p className={styles.rightDesc}>
            Seus dados são criptografados. O segredo será destruído assim que o limite de tempo ou acessos for atingido.
          </p>
        </div>
      </div>

      <TokenCreatedModal
        open={!!created}
        url={created?.url ?? ""}
        expiresLabel={expiresLabel}
        viewLimit={viewLimit}
        onClose={() => setCreated(null)}
        onCopy={async () => { if (created?.url) await navigator.clipboard.writeText(created.url); }}
        onViewNow={() => { if (created?.pwdId) router.push(`/visualizar/${encodeURIComponent(created.pwdId)}`); }}
      />
    </main>
  );
}