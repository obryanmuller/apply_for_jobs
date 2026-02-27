"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HiOutlineLightBulb } from "react-icons/hi";
import { HowItWorksModal } from "./HowItWorksModal"; // Importe o novo modal

type Props = {
  styles: Record<string, string>;
  isVisualizing: boolean;
  onToggleMode: () => void;
};

export function OverlaySwitch({ styles, isVisualizing, onToggleMode }: Props) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <aside className={styles.overlay}>
        {/* Botão de Ajuda posicionado no topo */}
        <button
          className={styles.helpTrigger}
          onClick={() => setIsHelpOpen(true)}
          title="Como funciona?"
        >
          <HiOutlineLightBulb size={24} />
          <span>Dúvidas?</span>
        </button>

        <div className={styles.overlayContent}>
          <Image src="/iconhomewhite.png" alt="Icon" width={150} height={150} />
          <p className={styles.rightDesc}>
            {isVisualizing
              ? <>Quer <strong>proteger</strong> um novo segredo? Volte para criar.</>
              : <>Recebeu um link seguro? Alterne para <strong>visualizar</strong>.</>}
          </p>
          <button className={styles.switchButton} onClick={onToggleMode}>
            {isVisualizing ? "QUERO GERAR" : "QUERO VISUALIZAR"}
          </button>
        </div>
      </aside>

      <HowItWorksModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  );
}