import type { RefreshTokenResponse } from "../types";

const BASE_URL = "";

// ── Token storage ──
let cachedToken: string | null = null;
let cachedRefreshToken: string | null = null;

export function getToken(): string | null {
  if (cachedToken) return cachedToken;
  cachedToken = localStorage.getItem("token");
  return cachedToken;
}

export function setToken(token: string) {
  cachedToken = token;
  localStorage.setItem("token", token);
}

export function clearToken() {
  cachedToken = null;
  localStorage.removeItem("token");
}

export function getRefreshToken(): string | null {
  if (cachedRefreshToken) return cachedRefreshToken;
  cachedRefreshToken = localStorage.getItem("refreshToken");
  return cachedRefreshToken;
}

export function setRefreshToken(token: string) {
  cachedRefreshToken = token;
  localStorage.setItem("refreshToken", token);
}

export function clearRefreshToken() {
  cachedRefreshToken = null;
  localStorage.removeItem("refreshToken");
}

export function clearAllTokens() {
  clearToken();
  clearRefreshToken();
  localStorage.removeItem("user");
}

// Optional: expose current user id for UI display only (NEVER send to server).
export function getCurrentUserId(): number | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw) as { id?: number };
    return typeof u.id === "number" ? u.id : null;
  } catch {
    return null;
  }
}

// ── Refresh handling ──
// Set by authService at module init to break the circular dependency.
type RefreshFn = () => Promise<RefreshTokenResponse>;
let refreshFn: RefreshFn | null = null;
let onAuthFailure: (() => void) | null = null;

export function configureAuth(opts: { refreshFn: RefreshFn; onAuthFailure: () => void }) {
  refreshFn = opts.refreshFn;
  onAuthFailure = opts.onAuthFailure;
}

// Single-flight refresh: concurrent 401s share one refresh call.
let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  if (!refreshFn) throw { status: 401, error: "Not authenticated" };
  if (!refreshPromise) {
    refreshPromise = refreshFn()
      .then((res) => {
        setToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        return res.accessToken;
      })
      .catch((err) => {
        clearAllTokens();
        onAuthFailure?.();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// ── Fetch wrapper ──
interface FetchOpts extends RequestInit {
  // Skip 401 auto-refresh (used by auth endpoints themselves).
  skipAuthRefresh?: boolean;
}

async function doFetch(path: string, options: FetchOpts): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });
}

export async function apiFetch<T>(path: string, options: FetchOpts = {}): Promise<T> {
  let res = await doFetch(path, options);

  // Attempt silent token refresh on 401 (once), unless explicitly disabled.
  if (res.status === 401 && !options.skipAuthRefresh && getRefreshToken() && refreshFn) {
    try {
      await performRefresh();
      res = await doFetch(path, options);
    } catch {
      // refresh failed — fall through to the 401 handler below.
    }
  }

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const msg =
      (data.error as string) ||
      (data.message as string) ||
      (data.title as string) ||
      `خطأ ${res.status}`;
    console.error(`[API ${res.status}] ${options.method || "GET"} ${path}:`, data);
    if (res.status === 401 && !options.skipAuthRefresh) {
      // Force logout on unrecoverable 401.
      clearAllTokens();
      onAuthFailure?.();
    }
    throw { status: res.status, error: msg, traceId: data.traceId as string | undefined };
  }

  console.log(`[API OK] ${options.method || "GET"} ${path}`, data);
  return data as T;
}
