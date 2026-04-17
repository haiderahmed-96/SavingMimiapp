import {
  apiFetch,
  setToken,
  setRefreshToken,
  clearAllTokens,
  getRefreshToken,
  configureAuth,
} from "./api";
import type { AuthUser, UserLoginResponse, RefreshTokenResponse } from "../types";

const USER_KEY = "user";

export const authService = {
  register: (fullName: string, phoneNumber: string, password: string) =>
    apiFetch<UserLoginResponse>("/api/auth/user/register", {
      method: "POST",
      body: JSON.stringify({ fullName, phoneNumber, password }),
      skipAuthRefresh: true,
    }),

  login: (phoneNumber: string, password: string) =>
    apiFetch<UserLoginResponse>("/api/auth/user/login", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, password }),
      skipAuthRefresh: true,
    }),

  qiLogin: (authCode: string) =>
    apiFetch<UserLoginResponse>("/api/auth/user/qi-login", {
      method: "POST",
      body: JSON.stringify({ authCode }),
      skipAuthRefresh: true,
    }),

  me: () => apiFetch<AuthUser>("/api/auth/user/me"),

  refreshToken: (refreshToken: string) =>
    apiFetch<RefreshTokenResponse>("/api/auth/user/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      skipAuthRefresh: true,
    }),

  logoutRequest: (refreshToken: string) =>
    apiFetch<{ success: boolean }>("/api/auth/user/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      skipAuthRefresh: true,
    }),

  saveSession: (token: string, refreshToken: string, user: AuthUser) => {
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession: () => {
    clearAllTokens();
  },

  getStoredUser: (): AuthUser | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};

// Wire the api.ts module to our refresh endpoint + forced-logout handler.
// onAuthFailure is set later by the auth store via setAuthFailureHandler.
let authFailureHandler: () => void = () => {
  /* no-op until store attaches one */
};

export function setAuthFailureHandler(fn: () => void) {
  authFailureHandler = fn;
}

configureAuth({
  refreshFn: async () => {
    const rt = getRefreshToken();
    if (!rt) throw { status: 401, error: "No refresh token" };
    return authService.refreshToken(rt);
  },
  onAuthFailure: () => authFailureHandler(),
});
