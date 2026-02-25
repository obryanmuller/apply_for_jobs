export function buildShareUrl(pwdId: string): string {
  const base = window.location.origin.replace(/\/+$/, "");
  return `${base}/visualizar/${encodeURIComponent(pwdId)}`;
}

export function extractTokenFromInput(inputRaw: string): string | null {
  const input = inputRaw.trim();
  if (!input) return null;

  let token = input;

  try {
    const url = new URL(input);
    const parts = url.pathname.split("/").filter(Boolean);
    token = parts[parts.length - 1] || "";
  } catch {
    token = input.replace(/^\/+|\/+$/g, "");
    const parts = token.split("/").filter(Boolean);
    token = parts[parts.length - 1] || "";
  }

  if (!token) return null;

  const isValid = /^[A-Za-z0-9\-_]+$/.test(token);
  if (!isValid) return null;

  return token;
}