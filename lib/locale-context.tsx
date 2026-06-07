"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Locale, getTranslations, type Translations } from "./i18n";

type LocaleCtx = {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleCtx | null>(null);

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  return document.cookie.split("; ").find(r => r.startsWith(name + "="))?.split("=")[1] ?? "";
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};max-age=${60*60*24*30};path=/;samesite=lax`;
}

export function LocaleProvider({ children, serverLocale }: { children: ReactNode; serverLocale: Locale }) {
  const [locale, setLocale] = useState<Locale>(serverLocale);

  useEffect(() => {
    const cookie = getCookie("apex-locale") as Locale;
    if (cookie === "de" || cookie === "en") setLocale(cookie);
  }, []);

  const toggleLocale = () => {
    const next: Locale = locale === "en" ? "de" : "en";
    setLocale(next);
    setCookie("apex-locale", next);
  };

  return (
    <LocaleContext.Provider value={{ locale, t: getTranslations(locale), toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
