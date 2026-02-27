"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TiWarning } from "react-icons/ti";
import styles from "@/app/styles/HowItWorksModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
          <IoClose size={24} />
        </button>

        <header className={styles.header}>
          <div className={styles.iconCircle}>
            <HiOutlineLightBulb size={32} color="#0f172a" />
          </div>
          <h3>Como funciona?</h3>
        </header>

        <div className={styles.content}>

          <div className={styles.step}>
            <span className={styles.number}>1</span>
            <div>
              <p>
                <strong>Escolha como criar seu segredo:</strong>
              </p>

              <ul className={styles.list}>
                <li>
                  <strong>Digitando:</strong> Escreva sua própria senha ou mensagem diretamente no campo.
                </li>
                <li>
                  <strong>No Dado <GiPerspectiveDiceSixFacesRandom size={18} />:</strong> 
                  Gera uma senha forte <strong>seguindo suas preferências</strong> (tamanho, símbolos, etc.). Se não gostar, apague no <IoClose size={18} /> e clique no dado para sortear uma nova combinação!
                </li>
                <li>
                  <strong>Pelo Sistema:</strong> Deixe o campo vazio e use as <strong>Opções de Customização</strong> (tamanho, símbolos, etc). O sistema criará o segredo apenas no momento de gerar o link.
                </li>
              </ul>

              <p className={styles.note}>
                <HiOutlineLightBulb /> <strong>Dica:</strong> Se você digitar ou usar o dado, as opções de customização somem, pois você já definiu o conteúdo manualmente.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <span className={styles.number}>2</span>
            <div>
              <p>
                <strong>Defina as regras de acesso:</strong> Escolha por quanto tempo o link será válido e o limite de visualizações (views).
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <span className={styles.number}>3</span>
            <div>
              <p>
                <strong>Gere e compartilhe:</strong> Clique em <strong>Gerar Link Seguro</strong> para finalizar e você receberá um link para compartilhamento.
              </p>
              <p className={styles.note}>
                <TiWarning /> <strong>Atenção:</strong> Se você gerou a senha pelo sistema ela não aparece na tela. Se você abrir o link para conferir, isso <strong>consumirá uma visualização</strong>.
              </p>
            </div>
          </div>
        </div>

        <button className={styles.gotItBtn} onClick={onClose}>
          Entendi!
        </button>
      </div>
    </div>
  );
}