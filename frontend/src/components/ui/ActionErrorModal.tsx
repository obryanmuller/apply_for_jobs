"use client";

import styles from "@/app/styles/ActionErrorModal.module.css";

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
        {/* Botão de fechar (X pequeno no canto) */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Cabeçalho Vermelho com Ícone */}
        <div className={styles.headerBanner}>
          <div className={styles.iconCircle}>
            <span className={styles.iconX}>✕</span>
          </div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>Ooops!</h3>
          <p className={styles.message}>{message}</p>
          
          <button className={styles.actionBtn} onClick={onClose}>
           Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}