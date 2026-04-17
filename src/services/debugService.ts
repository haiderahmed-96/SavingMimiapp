import { apiFetch } from "./api";

export const debugService = {
  getCurrentUser: () =>
    apiFetch<{ userId: string; isAuthenticated: boolean }>("/api/debug/user"),

  getTestToken: (userId: number) =>
    apiFetch<{ userId: number; fullName: string; phone: string; token: string; expiresAt: string }>(
      `/api/debug/token/${userId}`
    ),
};
