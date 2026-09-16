// Lightweight, dependency-free session helpers. No login, no PII.

export function makeSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Deterministic numeric seed from a session id (for tie-breaking).
export function seedFromSession(sessionId: string): number {
  let h = 0;
  for (let i = 0; i < sessionId.length; i++) {
    h = (h * 31 + sessionId.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getReferralSource(): string {
  if (typeof document === "undefined") return "direct";
  const ref = document.referrer;
  const utm = new URLSearchParams(window.location.search).get("utm_source");
  if (utm) return utm;
  if (!ref) return "direct";
  try {
    return new URL(ref).hostname;
  } catch {
    return "direct";
  }
}

export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}
