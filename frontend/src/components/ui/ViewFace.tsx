import Image from "next/image";

type Props = {
  styles: Record<string, string>;
  tokenInput: string;
  tokenError: string;
  onTokenChange: (v: string) => void;
  onGoToToken: () => void;
  onToggleMode: () => void;
};

export function ViewFace({ styles, tokenInput, tokenError, onTokenChange, onGoToToken, onToggleMode }: Props) {
  return (
    <div className={styles.formColCenter}>
      <Image src="/logototvs.png" alt="TOTVS" width={160} height={60} priority />

      <section className={styles.section} style={{ width: "100%" }}>
        <label className={styles.boxTitle}>Token de Acesso</label>
        <input
          className={styles.input}
          placeholder="Insira o token ou cole a URL"
          value={tokenInput}
          onChange={(e) => onTokenChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onGoToToken()}
        />
        {tokenError && <span className={styles.errorLabel}>{tokenError}</span>}
      </section>

      <button className={styles.ctaButton} onClick={onGoToToken}>
        Visualizar Senha →
      </button>

      <button type="button" onClick={onToggleMode} className={styles.mobileOnlyLink}>
        Quero gerar um novo link seguro
      </button>

      <p className={styles.securityWarning}>
         Sua conexão é privada. O conteúdo será removido após a validade ou limite.
      </p>
    </div>
  );
}