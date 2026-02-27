"use client";

import React from "react";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

type CharsetOption = {
  id: string;
  label: string;
  checked: boolean;
  set: (v: boolean) => void;
};

type ExpiresUnit = "Segundos" | "Minutos" | "Dias";

type Props = {
  styles: Record<string, string>;
  isSubmitting: boolean;
  configError: string;
  hasTypedPassword: boolean;

  password: string;
  onPasswordChange: (v: string) => void;
  onPasswordClear: () => void;
  onGeneratePreview: () => void;

  charsetOptions: CharsetOption[];
  length: number | "";
  onLengthChange: (v: number | "") => void;

  expiresValue: number | "";
  expiresUnit: ExpiresUnit;
  unitOptions: ExpiresUnit[];
  onExpiresUnitChange: (u: ExpiresUnit) => void;
  onExpiresValueChange: (v: number | "") => void;

  viewLimit: number | "";
  onViewLimitChange: (v: number | "") => void;
  onViewLimitDec: () => void;
  onViewLimitInc: () => void;

  onSave: () => void;
  onToggleMode: () => void;

  onOpenHowItWorks: () => void;
};

export function CreateFace({
  styles,
  isSubmitting,
  configError,
  hasTypedPassword,
  password,
  onPasswordChange,
  onPasswordClear,
  onGeneratePreview,
  charsetOptions,
  length,
  onLengthChange,
  expiresValue,
  expiresUnit,
  unitOptions,
  onExpiresUnitChange,
  onExpiresValueChange,
  viewLimit,
  onViewLimitChange,
  onViewLimitDec,
  onViewLimitInc,
  onSave,
  onToggleMode,
  onOpenHowItWorks,
}: Props) {
  return (
    <div className={styles.formCol}>
      <header className={styles.mainHeader}>
        <h2>Gerar Acesso Protegido</h2>
      </header>

      <section className={styles.section}>
        <label className={styles.boxTitle}>Sua Senha</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Digite ou use o dado..."
          />
          <button
            type="button"
            className={styles.innerGenerateBtn}
            onClick={hasTypedPassword ? onPasswordClear : onGeneratePreview}
            title={hasTypedPassword ? "Limpar senha" : "Gerar senha aleatória"}
          >
            {hasTypedPassword ? <IoClose size={22} color="#64748b" /> : <GiPerspectiveDiceSixFacesRandom size={18} color="#0f172a" />}
          </button>
        </div>
      </section>

      {!hasTypedPassword && (
        <section className={styles.section}>
          <label className={styles.boxTitle}>
            Customização <span className={styles.dynamicLabel}>{length || 0} CARACTERES</span>
          </label>

          <div className={styles.checkboxGroup}>
            {charsetOptions.map((opt) => (
              <label key={opt.id}>
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.set(e.target.checked)}
                  className={styles.hiddenCheckbox}
                />
                <span className={styles.customCheck}>{opt.label}</span>
              </label>
            ))}
          </div>

          <div className={styles.controlRow}>
            <input
              type="range"
              min={8}
              max={128}
              value={length || 8}
              onChange={(e) => onLengthChange(Number(e.target.value))}
              className={styles.range}
            />
            <input
              type="number"
              className={styles.numberInput}
              value={length}
              onChange={(e) => onLengthChange(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
        </section>
      )}

      {configError && <span className={styles.errorLabel}>{configError}</span>}

      <section className={styles.section}>
        <label className={styles.boxTitle}>
          Destruição{" "}
          <span className={styles.dynamicLabel}>
            {expiresValue || 0} {expiresUnit}
          </span>
        </label>

        <div className={styles.pillGroup}>
          {unitOptions.map((u) => (
            <button
              key={u}
              type="button"
              className={`${styles.pillBtn} ${expiresUnit === u ? styles.pillBtnActive : ""}`}
              onClick={() => onExpiresUnitChange(u)}
            >
              {u}
            </button>
          ))}
        </div>

        <div className={styles.controlRow}>
          <input
            type="range"
            min={1}
            max={60}
            value={expiresValue || 1}
            onChange={(e) => onExpiresValueChange(Number(e.target.value))}
            className={styles.range}
          />
          <input
            type="number"
            className={styles.numberInput}
            value={expiresValue}
            onChange={(e) => onExpiresValueChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        <div className={styles.viewLimitBox}>
          <div className={styles.viewLimitText}>
            <span className={styles.boxTitle}>Limite de Acessos</span>
            <span className={styles.limitSub}>Vezes que o link pode ser aberto</span>
          </div>

          <div className={styles.counterControl}>
            <button type="button" onClick={onViewLimitDec} className={styles.counterBtn}>
              -
            </button>
            <input
              type="number"
              value={viewLimit}
              onChange={(e) => onViewLimitChange(e.target.value === "" ? "" : Number(e.target.value))}
              className={styles.counterInput}
            />
            <button type="button" onClick={onViewLimitInc} className={styles.counterBtn}>
              +
            </button>
          </div>
        </div>
      </section>

      <button className={styles.ctaButton} onClick={onSave} disabled={isSubmitting}>
        {isSubmitting ? "CRIANDO..." : "GERAR LINK SEGURO"}
      </button>

      <button type="button" onClick={onToggleMode} className={styles.mobileOnlyLink}>
        Já tenho um token para visualizar
      </button>

      <button type="button" onClick={onOpenHowItWorks} className={styles.mobileOnlyLink}>
        Dúvidas?
      </button>
    </div>
  );
}