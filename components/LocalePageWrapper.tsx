"use client";
import { useLocale } from "../lib/locale-context";
import { ReactNode } from "react";

export function DE({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  return locale === "de" ? <>{children}</> : null;
}

export function EN({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  return locale === "en" ? <>{children}</> : null;
}

export function T({ en, de }: { en: string; de: string }) {
  const { locale } = useLocale();
  return <>{locale === "de" ? de : en}</>;
}
