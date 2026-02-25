import { apiFetch } from "./client";
import type { CreatePwdRequest, CreatePwdResponse, GetPwdResponse } from "./types";

export const pwdApi = {
  create(payload: CreatePwdRequest) {
    return apiFetch<CreatePwdResponse>("/pwd", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  get(pwdId: string) {
    return apiFetch<GetPwdResponse>(`/pwd/${encodeURIComponent(pwdId)}`, {
      method: "GET",
    });
  },
};