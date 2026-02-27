"use client";

import { useState } from "react";
import styles from "@/app/styles/TokenCreatedModal.module.css";

interface ModalProps {
  open: boolean;
  url: string;
  expiresLabel: string;
  viewLimit: string | number;
  onClose: () => void;
  onCopy: () => void;
  onViewNow: () => void;
}

export function TokenCreatedModal({
  open, url, expiresLabel, viewLimit, onClose, onCopy, onViewNow
}: ModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <article className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <header className={styles.header}>
          <h2 className={styles.title}>Token Criado!</h2>
          <p className={styles.subtitle}>Seu link de acesso seguro está pronto.</p>
        </header>

        <div className={styles.urlWrapper}>
          <span className={styles.urlText}>{url}</span>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ""}`}
            onClick={handleCopy}
          >
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" className={styles.checkIcon}><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="10" height="10" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1"/></svg>
            )}
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.cardLabel}>Expiração</span>
            <span className={styles.cardValue}>{expiresLabel}</span>
          </div>
          <div className={styles.card}>
            <span className={styles.cardLabel}>Limite</span>
            <span className={styles.cardValue}>{viewLimit} acessos</span>
          </div>
        </div>

        <button className={styles.actionBtn} onClick={onViewNow}>
          Visualizar agora
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
        </button>
      </article>
    </div>
  );
}