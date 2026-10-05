import { usePreferences } from "../../hooks/usePreferences";

export default function LanguageToggle() {
  const { language, t, setLanguage } = usePreferences();
  return <div className="language-toggle" role="group" aria-label={t.preferences.language}>
    <button type="button" lang="es" aria-label={t.preferences.spanish} title={t.preferences.spanish} aria-pressed={language === "es"} onClick={() => setLanguage("es")}>ES</button>
    <span aria-hidden="true">/</span>
    <button type="button" lang="en" aria-label={t.preferences.english} title={t.preferences.english} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
  </div>;
}
