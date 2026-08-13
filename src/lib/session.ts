const SESSION_KEY = "cls_patient_session";
const KHTH_SESSION_KEY = "cls_khth_session";

export type SessionData = {
  token: string;
  maKcb: string;
  phone: string;
  authenticatedAt: number;
};

export type KhthSessionData = {
  token: string;
  username: string;
  displayName: string;
  role: "khth";
  authenticatedAt: number;
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getSession(): SessionData | null {
  return readJson<SessionData>(SESSION_KEY);
}

export function setSession(data: SessionData) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem("cls_patient_state");
}

export function getKhthSession(): KhthSessionData | null {
  return readJson<KhthSessionData>(KHTH_SESSION_KEY);
}

export function setKhthSession(data: KhthSessionData) {
  sessionStorage.setItem(KHTH_SESSION_KEY, JSON.stringify(data));
}

export function clearKhthSession() {
  sessionStorage.removeItem(KHTH_SESSION_KEY);
}

/** Bệnh nhân hoặc nhân viên KHTH đã đăng nhập */
export function isAuthenticated(): boolean {
  return Boolean(getSession() || getKhthSession());
}

function appPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function logoutAndRedirect() {
  const khth = Boolean(getKhthSession());
  clearSession();
  clearKhthSession();
  if (typeof window !== "undefined") {
    window.location.href = khth ? appPath("/login-khth/") : appPath("/");
  }
}
