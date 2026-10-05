export type Theme = "dark" | "light";
export type Language = "es" | "en";

// Storage may be unavailable in private browsing or restricted environments.
export function readPreference(key: string): string | null {
  try { return typeof window === "undefined" ? null : window.localStorage.getItem(key); }
  catch { return null; }
}
export function writePreference(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); }
  catch { /* Preferences still work for the current session. */ }
}
export function initialTheme(): Theme {
  const stored = readPreference("portfolio-theme");
  if (stored === "light" || stored === "dark") return stored;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
export function initialLanguage(): Language {
  return readPreference("portfolio-language") === "en" ? "en" : "es";
}
