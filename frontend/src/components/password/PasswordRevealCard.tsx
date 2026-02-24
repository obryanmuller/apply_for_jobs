"use client";

import { formatRemainingFromEpochSeconds } from "@/lib/utils/time";
import styles from "./PasswordRevealCard.module.css";
import { useState } from "react";

interface PwdData {
  pwd: string;
  expiration_date: number;
  view_count: number;
}

export function PasswordRevealCard({
  loading,
  error,
  data,
  onClose,
}: {
  loading: boolean;
  error: string | null;
  data: PwdData | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TopBar = ({ variant = "default" }: { variant?: "default" | "error" }) => (
    <div className={variant === "error" ? styles.topBarError : styles.topBar}>
      <button onClick={onClose} className={styles.closeButton} aria-label="Fechar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className={`${styles.shell} ${styles.appear}`}>
        <TopBar />
        <div className={styles.content}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Preparando ambiente seguro...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.shell} ${styles.appear}`}>
        <TopBar variant="error" />
        <div className={styles.content}>
          <div className={styles.errorIconContainer}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h2 className={styles.errorTitle}>Acesso Indisponível</h2>
          <p className={styles.errorText}>
            Este segredo não pode ser exibido. O link expirou ou já foi visualizado e deletado.
          </p>
          <button onClick={onClose} className={styles.backButton}>
            Entendido, voltar
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`${styles.shell} ${styles.appear}`}>
      <TopBar />
      <div className={styles.content}>
        <header className={styles.passwordTitle}>Segredo Descriptografado</header>
        
        <div className={styles.passwordContainer}>
          <div className={styles.passwordBox}>
            <code>{data.pwd}</code>
          </div>
          <button 
            onClick={handleCopy} 
            className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
          >
            {copied ? "✓ Copiado!" : "Copiar Segredo"}
          </button>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <strong>Tempo Restante</strong>
            {formatRemainingFromEpochSeconds(data.expiration_date)}
          </div>
          <div className={styles.metaItem}>
            <strong>Visualizações</strong>
            {data.view_count} restantes
          </div>
        </div>
      </div>
    </div>
  );
}