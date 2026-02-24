// src/lib/api.ts
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL não configurada");
}

export type CreatePwdRequest = {
  sended_password?: string;

  use_letters: boolean;
  use_digits: boolean;
  use_punctuation: boolean;
  pass_length: number;

  pass_view_limit: number;
  expiration_in_seconds: number;
};

export type CreatePwdResponse = {
  pwdId: string;
};

export type GetPwdResponse = {
  pwdId?: string;
  pwd: string;
  expiration_date: number;
  view_count: number;
};

export async function createPwd(payload: CreatePwdRequest): Promise<CreatePwdResponse> {
  const res = await fetch(`${API_BASE}/pwd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Falha ao criar senha (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}

export async function getPwd(pwdId: string): Promise<GetPwdResponse> {
  const res = await fetch(`${API_BASE}/pwd/${encodeURIComponent(pwdId)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Senha indisponível (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}