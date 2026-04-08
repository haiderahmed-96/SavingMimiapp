import { apiFetch, setToken, setUserId, clearToken } from "./api";
import type { AuthUser } from "../types";

export const authService = {
  register: (fullName: string, phoneNumber: string, password: string) =>
    apiFetch<{ token: string; user: AuthUser }>("/api/auth/user/register", {
      method: "POST",
      body: JSON.stringify({ fullName, phoneNumber, password }),
    }),

  login: (phoneNumber: string, password: string) =>
    apiFetch<{ token: string; user: AuthUser }>("/api/auth/user/login", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, password }),
    }),

  me: () => apiFetch<AuthUser>("/api/auth/user/me"),

  saveSession: (token: string, user: AuthUser) => {
    setToken(token);
    setUserId(user.id);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    clearToken();
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  },

  getStoredUser: (): AuthUser | null => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
