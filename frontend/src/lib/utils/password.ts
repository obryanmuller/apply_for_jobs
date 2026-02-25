export type PasswordPolicy = {
  useLetters: boolean;
  useDigits: boolean;
  useSymbols: boolean;
  length: number;
};

const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export function generatePassword(policy: PasswordPolicy): string {
  const chars =
    (policy.useLetters ? LETTERS : "") +
    (policy.useDigits ? DIGITS : "") +
    (policy.useSymbols ? SYMBOLS : "");

  if (!chars) throw new Error("Selecione ao menos um tipo de caractere.");
  if (!Number.isFinite(policy.length) || policy.length < 1) throw new Error("Tamanho inválido.");

  // Geração criptograficamente segura
  const buf = new Uint32Array(policy.length);
  crypto.getRandomValues(buf);

  let out = "";
  for (let i = 0; i < buf.length; i++) {
    out += chars[buf[i] % chars.length];
  }
  return out;
}