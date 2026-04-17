import { create } from "zustand";
import { authService, setAuthFailureHandler } from "../services/authService";
import type { AuthUser } from "../types";
import { getToken, getRefreshToken } from "../services/api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, password: string) => Promise<boolean>;
  qiLogin: (authCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  forceLogout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getStoredUser(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,

  login: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(phone, password);
      authService.saveSession(res.token, res.refreshToken, res.user);
      set({ user: res.user, isAuthenticated: true, loading: false });
      return true;
    } catch (err: unknown) {
      const message = (err as { error?: string })?.error || "فشل تسجيل الدخول";
      set({ error: message, loading: false });
      return false;
    }
  },

  register: async (name, phone, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register(name, phone, password);
      authService.saveSession(res.token, res.refreshToken, res.user);
      set({ user: res.user, isAuthenticated: true, loading: false });
      return true;
    } catch (err: unknown) {
      const message = (err as { error?: string })?.error || "فشل إنشاء الحساب";
      set({ error: message, loading: false });
      return false;
    }
  },

  qiLogin: async (authCode) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.qiLogin(authCode);
      authService.saveSession(res.token, res.refreshToken, res.user);
      set({ user: res.user, isAuthenticated: true, loading: false });
      return true;
    } catch (err: unknown) {
      const message = (err as { error?: string })?.error || "فشل تسجيل الدخول عبر Qi";
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: async () => {
    const rt = getRefreshToken();
    if (rt) {
      try {
        await authService.logoutRequest(rt);
      } catch {
        // best-effort — always clear local state below
      }
    }
    authService.clearSession();
    set({ user: null, isAuthenticated: false });
  },

  forceLogout: () => {
    authService.clearSession();
    set({ user: null, isAuthenticated: false });
  },

  loadSession: async () => {
    if (!getToken()) return;
    try {
      const user = await authService.me();
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      authService.clearSession();
      set({ user: null, isAuthenticated: false });
    }
  },
}));

// Wire the 401-forced-logout callback from api.ts → store.
setAuthFailureHandler(() => {
  useAuthStore.getState().forceLogout();
});
