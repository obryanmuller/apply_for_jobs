export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL não configurada");
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorMessage = text;

    try {
      // Tenta extrair a mensagem amigável do JSON de erro
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = text || res.statusText || `HTTP ${res.status}`;
    }

    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}