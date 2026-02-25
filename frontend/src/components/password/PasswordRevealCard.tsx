"use client";

import { formatRemainingFromEpochSeconds } from "@/lib/utils/time";
import styles from "./PasswordRevealCard.module.css";
import { useState } from "react";

export function PasswordRevealCard({ loading, error, data, onClose }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. PRIORIDADE: DADO (Se o dado existe, mostra o segredo imediatamente)
  if (data) {
    return (
      <div className={`${styles.shell} ${styles.appear}`}>
        <div className={styles.topBar}>
          <div className={styles.brandDot} />
        </div>
        <div className={styles.content}>
          <header className={styles.passwordTitle}>Segredo Descriptografado</header>
          <div className={styles.passwordBox}>
            <code>{data.pwd}</code>
          </div>
          <button onClick={handleCopy} className={`${styles.copyButton} ${copied ? styles.copied : ""}`}>
            {copied ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="10" height="10" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1" /></svg>
            )}
            {copied ? "Copiado!" : "Copiar Segredo"}
          </button>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Tempo Restante</span>
              <span className={styles.metaValue}>{formatRemainingFromEpochSeconds(data.expiration_date)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Visualizações</span>
              <span className={styles.metaValue}>{data.view_count} restantes</span>
            </div>
          </div>
          <button onClick={onClose} className={styles.backButton}>Sair com Segurança</button>
        </div>
      </div>
    );
  }

  // 2. PRIORIDADE: ERRO (Se falhou, mostra o erro e para o loading)
  if (error) {
    return (
      <div className={`${styles.shell} ${styles.appear}`}>
        <div className={styles.topBar} style={{backgroundColor: '#1e293b'}}>
          <div className={styles.brandDot} style={{background: '#f87171'}} />
        </div>
        <div className={styles.content}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 style={{color: '#0f172a', fontWeight: 800, marginBottom: 12}}>Link Indisponível</h2>
          <p style={{color: '#64748b', marginBottom: 24, fontSize: '15px', lineHeight: '1.5'}}>{error}</p>
          <button onClick={onClose} className={styles.copyButton}>Voltar ao Início</button>
        </div>
      </div>
    );
  }

  // 3. CARREGAMENTO (Apenas se não houver dado nem erro)
  if (loading) {
    return (
      <div className={styles.shell}>
        <div className={styles.content}>
          <div className={styles.spinner} />
          <p style={{color: '#64748b', fontWeight: 600}}>Validando segurança...</p>
        </div>
      </div>
    );
  }

  return null;
}