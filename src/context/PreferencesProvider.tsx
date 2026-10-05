import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PreferencesContext } from "./PreferencesContext";
import { es } from "../i18n/es";
import { en } from "../i18n/en";
import { initialLanguage, initialTheme, readPreference, writePreference } from "../lib/preferences";
import type { Language } from "../lib/preferences";

export default function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(initialTheme);
  const [language, updateLanguage] = useState(initialLanguage);
  const t = language === "en" ? en : es;
  const manuallySelected = useRef(false);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    manuallySelected.current = true;
    writePreference("portfolio-theme", next);
    setTheme(next);
  }, [theme]);
  const setLanguage = useCallback((next: Language) => {
    writePreference("portfolio-language", next);
    updateLanguage(next);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.title = t.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.seo.description);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0f0e" : "#f6f7f2");
  }, [theme, language, t]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const saved = readPreference("portfolio-theme");
      if (!manuallySelected.current && saved !== "dark" && saved !== "light") setTheme(query.matches ? "light" : "dark");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const value = useMemo(() => ({ theme, language, t, toggleTheme, setLanguage }), [theme, language, t, toggleTheme, setLanguage]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
