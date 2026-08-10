const SESSION_KEY = "cls_patient_session";

export type SessionData = {
  token: string;
  maKcb: string;
  phone: string;
  authenticatedAt: number;
};

export function getSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function setSession(data: SessionData) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem("cls_patient_state");
}

export function logoutAndRedirect() {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
