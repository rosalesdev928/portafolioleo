import { createContext } from "react";
import type { Translations } from "../i18n/es";
import type { Theme, Language } from "../lib/preferences";

export interface Preferences {
  theme: Theme;
  language: Language;
  t: Translations;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
}
export const PreferencesContext = createContext<Preferences | null>(null);
