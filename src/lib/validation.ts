import { isValidPhoneNumber } from "react-phone-number-input";

/** Pure field validators — return an error message, or null when valid. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function email(v: string): string | null {
  const t = v.trim();
  if (!t) return "E-posta gerekli.";
  return EMAIL_RE.test(t) ? null : "Geçerli bir e-posta gir.";
}

export function required(v: string, label: string): string | null {
  return v.trim() ? null : `${label} gerekli.`;
}

export function password(v: string): string | null {
  return v.length >= 6 ? null : "En az 6 karakter.";
}

export function match(a: string, b: string, msg = "Şifreler eşleşmiyor."): string | null {
  if (!b) return null; // don't complain until the confirm field has content
  return a === b ? null : msg;
}

export function phoneOptional(v: string | undefined): string | null {
  if (!v) return null;
  return isValidPhoneNumber(v) ? null : "Geçerli bir telefon gir.";
}
