"use client";

import { useState } from "react";
import styles from "./TokenCreatedModal.module.css";

export function TokenCreatedModal({
  open,
  url,
  expiresLabel,
  viewLimit,
  onClose,
  onCopy,
  onViewNow,
}: {
  open: boolean;
  url: string;
  expiresLabel: string;
  viewLimit: number;
  onClose: () => void;
  onCopy: () => void;
  onViewNow?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopyAction = () => {
    onCopy();
    setCopied(true);
    // O ícone volta ao normal após 2 segundos
    setTimeout(() => setCopied(false), 2000);
  };

  const darkBlue = "#0f172a";

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headerBar}>
          <div className={styles.brandCircle} />
          <button onClick={onClose} className={styles.closeButton} aria-label="Fechar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>Token Criado</h2>

          <div className={styles.urlContainer}>
            <div className={styles.urlText}>{url}</div>

            <button 
              onClick={handleCopyAction} 
              className={styles.copyButton} 
              aria-label="Copiar URL" 
              title="Copiar URL"
            >
              {copied ? (
                // Ícone de Check (V) de confirmação
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                // Ícone de Copiar padrão
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={darkBlue} strokeWidth="2.5">
                  <rect x="9" y="9" width="10" height="10" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>

          <div className={styles.metaGroup}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Expiração</span>
              {expiresLabel}
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Visualizações</span>
              {viewLimit}
            </div>
          </div>

          {onViewNow && (
            <button onClick={onViewNow} className={styles.viewNowButton}>
              Visualizar agora
            </button>
          )}
        </div>
      </div>
    </div>
  );
}