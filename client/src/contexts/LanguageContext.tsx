import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "fa" | "en";
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LANGUAGE_STORAGE_KEY = "solaceLanguage";
const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "fa";
  } catch {
    return "fa";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const value = useMemo(() => ({ language, setLanguage }), [language]);

  useEffect(() => {
    const direction = language === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.documentElement.dataset.language = language;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The current session still works when browser storage is unavailable.
    }
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  const label = language === "fa" ? "انتخاب زبان" : "Choose language";

  return (
    <div className="language-switch" role="group" aria-label={label}>
      <button type="button" onClick={() => setLanguage("fa")} aria-pressed={language === "fa"}>
        فارسی
      </button>
      <span aria-hidden="true">|</span>
      <button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"}>
        English
      </button>
    </div>
  );
}
