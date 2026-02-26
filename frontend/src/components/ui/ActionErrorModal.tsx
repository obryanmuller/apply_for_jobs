"use client";

import styles from "./ActionErrorModal.module.css";

interface ActionErrorModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function ActionErrorModal({ open, message, onClose }: ActionErrorModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Botão de fechar igual ao padrão do sistema */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <span className={styles.icon}>⚠️</span>
          </div>
          <h3 className={styles.title}>Falha na Operação</h3>
          <p className={styles.subtitle}>Não foi possível processar sua solicitação</p>
        </div>

        <div className={styles.errorContent}>
           <p className={styles.message}>{message}</p>
        </div>

        <button className={styles.actionBtn} onClick={onClose}>
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}