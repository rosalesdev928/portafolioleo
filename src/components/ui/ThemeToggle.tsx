import { Moon, Sun } from "lucide-react";
import { usePreferences } from "../../hooks/usePreferences";

export default function ThemeToggle() {
  const { theme, t, toggleTheme } = usePreferences();
  const label = theme === "dark" ? t.preferences.light : t.preferences.dark;
  return <button type="button" className="icon-button" onClick={toggleTheme} aria-label={label} title={label}>{theme === "dark" ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}</button>;
}
