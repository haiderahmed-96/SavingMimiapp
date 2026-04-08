const BASE_URL = "";

let cachedToken: string | null = null;

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

export function getUserId(): number {
  const raw = localStorage.getItem("userId");
  return raw ? Number(raw) : 36;
}

export function setUserId(id: number) {
  localStorage.setItem("userId", String(id));
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });
  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const msg = (data.error as string) || (data.message as string) || (data.title as string) || `خطأ ${res.status}`;
    console.error(`[API ${res.status}] ${options.method || "GET"} ${path}:`, data);
    throw { status: res.status, error: msg };
  }
  console.log(`[API OK] ${options.method || "GET"} ${path}`, data);
  return data as T;
}
