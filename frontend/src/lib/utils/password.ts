export type PasswordPolicy = {
  useLetters: boolean;
  useDigits: boolean;
  useSymbols: boolean;
  length: number;
};

const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const randomInt = (max: number): number => {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % max;
};

const randomChar = (charset: string): string =>
  charset[randomInt(charset.length)];

const shuffle = (values: string[]): string[] => {
  const buffer = new Uint32Array(values.length);
  crypto.getRandomValues(buffer);

  for (let i = values.length - 1; i > 0; i--) {
    const j = buffer[i] % (i + 1);
    [values[i], values[j]] = [values[j], values[i]];
  }

  return values;
};

export function generatePassword(policy: PasswordPolicy): string {
  const charsets = [
    policy.useLetters ? LETTERS : "",
    policy.useDigits ? DIGITS : "",
    policy.useSymbols ? SYMBOLS : "",
  ].filter(Boolean);

  if (charsets.length === 0) {
    throw new Error("Selecione ao menos um tipo de caractere.");
  }

  if (!Number.isFinite(policy.length) || policy.length < charsets.length) {
    throw new Error("Tamanho insuficiente para os critérios selecionados.");
  }

  const allChars = charsets.join("");
  const password = charsets.map(randomChar);

  while (password.length < policy.length) {
    password.push(randomChar(allChars));
  }

  return shuffle(password).join("");
}