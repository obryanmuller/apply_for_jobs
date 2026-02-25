export type ExpiresUnit = "Segundos" | "Minutos" | "Dias";

export function toExpirationSeconds(value: number, unit: ExpiresUnit): number {
  if (unit === "Segundos") return value;
  if (unit === "Minutos") return value * 60;
  return value * 60 * 60 * 24;
}

export function formatRemainingFromEpochSeconds(expirationEpochSeconds: number): string {
  const diffMs = expirationEpochSeconds * 1000 - Date.now();
  if (diffMs <= 0) return "Expirada";

  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) return `${seconds} Segundos`;
  return `${minutes} Minutos`;
}