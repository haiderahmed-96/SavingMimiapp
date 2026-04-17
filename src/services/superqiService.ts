// Super Qi Mini Program JSAPI wrapper.
// SDK: https://cdn.marmot-cloud.com/npm/hylid-bridge/2.10.0/index.js (loaded in index.html)
// Docs: https://superqi-dev-docs.pages.dev/api-reference/jsapi

// ── Types for the JSAPI surface we use ──
type AuthScope =
  | "auth_base"
  | "auth_user"
  | "USER_ID"
  | "USER_LOGIN_ID"
  | "HASH_LOGIN_ID"
  | "USER_NAME"
  | "USER_AVATAR"
  | "USER_CONTACTINFO"
  | "NOTIFICATION_INBOX"
  | "AGREEMENT_PAY";

interface GetAuthCodeOptions {
  scopes: AuthScope[];
  success?: (res: GetAuthCodeResult) => void;
  fail?: (err: GetAuthCodeError) => void;
  complete?: () => void;
}

interface GetAuthCodeResult {
  authCode: string;
  authSuccessScopes?: string[];
  authErrorScopes?: Record<string, string>;
}

interface GetAuthCodeError {
  authErrorScopes?: Record<string, string>;
  error?: number | string;
  errorMessage?: string;
}

interface TradePayOptions {
  paymentUrl: string;
  success?: (res: TradePayResult) => void;
  fail?: (err: TradePayResult) => void;
  complete?: () => void;
}

interface TradePayResult {
  resultCode: string; // "9000" success, "8000" processing, "4000" fail, "6001" cancel, "6002" network, "6004" unknown
  error?: number | string;
  errorMessage?: string;
}

interface AlertOptions {
  title?: string;
  content?: string;
  buttonText?: string;
}

interface ToastOptions {
  content: string;
  type?: "none" | "success" | "fail" | "exception";
  duration?: number;
}

interface SuperQiJsBridge {
  getAuthCode: (opts: GetAuthCodeOptions) => Promise<GetAuthCodeResult>;
  tradePay: (opts: TradePayOptions) => Promise<TradePayResult>;
  alert: (opts: AlertOptions) => Promise<void>;
  showToast: (opts: ToastOptions) => Promise<void>;
  getSystemInfo?: (opts?: { success?: (res: unknown) => void }) => Promise<unknown>;
}

declare global {
  interface Window {
    my?: SuperQiJsBridge;
  }
}

// ── Environment detection ──
export function isInSuperQi(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.my !== "undefined" && typeof window.my.getAuthCode === "function";
}

// ── Wrapped APIs (promise-first, safe) ──

export const TradePayResultCode = {
  SUCCESS: "9000",
  PROCESSING: "8000",
  FAIL: "4000",
  CANCEL: "6001",
  NETWORK: "6002",
  UNKNOWN: "6004",
} as const;

/**
 * Request an authorization code from Super Qi. Exchange via backend `/api/auth/user/qi-login`.
 * `auth_base` supports silent auth and never interrupts the user.
 */
export function getAuthCode(scopes: AuthScope[] = ["auth_base"]): Promise<string> {
  if (!isInSuperQi()) {
    return Promise.reject(new Error("Not running inside Super Qi"));
  }
  return new Promise((resolve, reject) => {
    window.my!.getAuthCode({
      scopes,
      success: (res) => {
        if (res?.authCode) resolve(res.authCode);
        else reject(new Error("No authCode returned"));
      },
      fail: (err) => {
        console.warn("[SuperQi] getAuthCode failed", err);
        reject(err);
      },
    });
  });
}

/**
 * Launch the Super Qi cashier for a prepared payment URL.
 * The `paymentUrl` must be obtained from your backend's pay/order preparation.
 */
export function tradePay(paymentUrl: string): Promise<TradePayResult> {
  if (!isInSuperQi()) {
    return Promise.reject(new Error("Not running inside Super Qi"));
  }
  if (!paymentUrl) {
    return Promise.reject(new Error("paymentUrl is required"));
  }
  return new Promise((resolve, reject) => {
    window.my!.tradePay({
      paymentUrl,
      success: (res) => resolve(res),
      fail: (err) => {
        console.warn("[SuperQi] tradePay failed", err);
        reject(err);
      },
    });
  });
}

/** Native alert — falls back to window.alert outside Super Qi. */
export function alert(content: string, title?: string): Promise<void> {
  if (isInSuperQi()) {
    return window.my!.alert({ title, content }).catch(() => void 0);
  }
  if (typeof window !== "undefined") window.alert(title ? `${title}\n\n${content}` : content);
  return Promise.resolve();
}

/** Native toast — silently no-ops outside Super Qi. */
export function showToast(content: string, type: ToastOptions["type"] = "none"): Promise<void> {
  if (isInSuperQi()) {
    return window.my!.showToast({ content, type }).catch(() => void 0);
  }
  return Promise.resolve();
}

export const superqiService = {
  isInSuperQi,
  getAuthCode,
  tradePay,
  alert,
  showToast,
  TradePayResultCode,
};
