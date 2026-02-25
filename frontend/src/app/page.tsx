"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

import { pwdApi } from "@/lib/api/pwd";
import { buildShareUrl } from "@/lib/utils/token";
import { ExpiresUnit, toExpirationSeconds } from "@/lib/utils/time";
import { generatePassword } from "@/lib/utils/password";
import { TokenCreatedModal } from "@/components/password/TokenCreatedModal";
import { extractTokenFromInput } from "@/lib/utils/token";

function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"create" | "view">("create");
  const isVisualizing = mode === "view";

  useEffect(() => {
    if (searchParams.get("mode") === "view") {
      setMode("view");
    }
  }, [searchParams]);

  // Estados
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
  const [tokenInput, setTokenInput] = useState("");

  const canGenerate = useLetters || useDigits || useSymbols;
  const hasTypedPassword = password.trim().length > 0;
  const isButtonDisabled = !canGenerate && !hasTypedPassword;
  const expiresLabel = useMemo(() => `${expiresValue} ${expiresUnit}`, [expiresValue, expiresUnit]);

  const handleGeneratePreview = () => {
    if (!canGenerate) return;
    const pwd = generatePassword({ useLetters, useDigits, useSymbols, length });
    setPassword(pwd);
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
    } catch (e) {
      alert("Erro ao criar link seguro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToToken = () => {
    const token = extractTokenFromInput(tokenInput);
    if (!token) return alert("Token inválido.");
    router.push(`/visualizar/${encodeURIComponent(token)}`);
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.card} ${isVisualizing ? styles.isVisualizing : ""}`}>
        {/* Face Criação */}
        <div className={`${styles.sideFace} ${styles.createFace}`}>
          <div className={styles.formCol}>
            <header className={styles.mainHeader}><span className={styles.iconCircleSmall}>🔒</span><h2>Novo Segredo</h2></header>
            <section className={styles.section}>
              <label className={styles.boxTitle}>Sua Senha</label>
              <div className={styles.inputWrapper}>
                <input type="text" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} placeholder="Digite ou use a varinha..." />
                <button type="button" className={styles.innerGenerateBtn} onClick={hasTypedPassword ? () => setPassword("") : handleGeneratePreview}>{hasTypedPassword ? "✕" : "🪄"}</button>
              </div>
            </section>
            {!hasTypedPassword && (
              <section className={styles.section}>
                <label className={styles.boxTitle}>Customização <span className={styles.dynamicLabel}>{length} CHARS</span></label>
                <div className={styles.checkboxGroup}>
                  {[{id:'l',label:"ABC",s:useLetters,fn:setUseLetters},{id:'d',label:"123",s:useDigits,fn:setUseDigits},{id:'s',label:"#$!",s:useSymbols,fn:setUseSymbols}].map(i=>(
                    <label key={i.id}><input type="checkbox" checked={i.s} onChange={e=>i.fn(e.target.checked)} className={styles.hiddenCheckbox} /><span className={styles.customCheck}>{i.label}</span></label>
                  ))}
                </div>
                <div className={styles.controlRow}><input type="range" min={4} max={64} value={length} onChange={e=>setLength(Number(e.target.value))} className={styles.range} /><div className={styles.numberDisplay}>{length}</div></div>
              </section>
            )}
            <section className={styles.section}>
              <label className={styles.boxTitle}>Destruição <span className={styles.dynamicLabel}>{expiresValue} {expiresUnit}</span></label>
              <div className={styles.pillGroup}>{(["Segundos","Minutos","Dias"] as const).map(u=>(<button key={u} type="button" className={`${styles.pillBtn} ${expiresUnit===u?styles.pillBtnActive:""}`} onClick={()=>setExpiresUnit(u)}>{u}</button>))}</div>
              <div className={styles.controlRow}><input type="range" min={1} max={60} value={expiresValue} onChange={e=>setExpiresValue(Number(e.target.value))} className={styles.range} /><div className={styles.numberDisplay}>{expiresValue}</div></div>
              <div className={styles.viewLimitBox}>
                <div className={styles.viewLimitText}><span className={styles.limitTitle}>Limite de Acessos</span><span className={styles.limitSub}>Quantidade de vezes que o link pode ser aberto</span></div>
                <div className={styles.counterControl}><button type="button" onClick={()=>setViewLimit(p=>Math.max(1,p-1))} className={styles.counterBtn}>-</button><input type="number" value={viewLimit} readOnly className={styles.counterInput} /><button type="button" onClick={()=>setViewLimit(p=>p+1)} className={styles.counterBtn}>+</button></div>
              </div>
            </section>
            <button className={styles.ctaButton} onClick={handleSave} disabled={isSubmitting || isButtonDisabled}>{isSubmitting ? "CRIANDO..." : "GERAR LINK SEGURO"}</button>
          </div>
        </div>
        {/* Face Visualização */}
        <div className={`${styles.sideFace} ${styles.viewFace}`}>
          <div className={styles.formColCenter}>
            <Image src="/logototvs.png" alt="TOTVS" width={160} height={60} priority />
            <section className={styles.section} style={{width:'100%'}}><label className={styles.boxTitle}>Token de Acesso</label><input className={styles.input} placeholder="Insira o token ou cole a URL" value={tokenInput} onChange={e=>setTokenInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleGoToToken()} /></section>
            <button className={styles.ctaButton} onClick={handleGoToToken}>Visualizar Segredo →</button>
            <p className={styles.securityWarning}>🔒 Sua conexão é privada. O conteúdo será destruído após a visualização.</p>
          </div>
        </div>
        {/* Overlay */}
        <aside className={styles.overlay}>
          <div className={styles.overlayContent}><Image src="/iconhomewhite.png" alt="Icon" width={90} height={90} /><h3 className={styles.rightTitle}>Privacidade Absoluta</h3><p className={styles.rightDesc}>{isVisualizing?"Deseja proteger um novo dado? Volte para criar um link criptografado.":"Recebeu um link? Alterne para visualizar o conteúdo de forma segura."}</p><button className={styles.switchButton} onClick={()=>setMode(isVisualizing?"create":"view")}>{isVisualizing?"QUERO GERAR":"QUERO VISUALIZAR"}</button></div>
        </aside>
      </div>
      <TokenCreatedModal open={!!created} url={created?.url??""} expiresLabel={expiresLabel} viewLimit={viewLimit} onClose={()=>setCreated(null)} onCopy={async()=>{if(created?.url)await navigator.clipboard.writeText(created.url)}} onViewNow={()=>{if(created?.pwdId)router.push(`/visualizar/${encodeURIComponent(created.pwdId)}`)}} />
    </main>
  );
}

export default function Page() { return (<Suspense fallback={<div>Carregando...</div>}><MainContent /></Suspense>); }