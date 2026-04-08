import { create } from "zustand";
import { authService } from "../services/authService";
import type { AuthUser } from "../types";
import { getToken } from "../services/api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadSession: () => Promise<void>;
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
      authService.saveSession(res.token, res.user);
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
      authService.saveSession(res.token, res.user);
      set({ user: res.user, isAuthenticated: true, loading: false });
      return true;
    } catch (err: unknown) {
      const message = (err as { error?: string })?.error || "فشل إنشاء الحساب";
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  loadSession: async () => {
    if (!getToken()) return;
    try {
      const user = await authService.me();
      set({ user, isAuthenticated: true });
    } catch {
      authService.logout();
      set({ user: null, isAuthenticated: false });
    }
  },
}));
