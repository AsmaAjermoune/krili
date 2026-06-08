"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

import fr from "@/locales/fr.json";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import zgh from "@/locales/zgh.json";

export type Locale = "fr" | "en" | "ar" | "zgh";

const VALID_LOCALES: readonly Locale[] = ["fr", "en", "ar", "zgh"];
const MESSAGES: Record<Locale, Record<string, unknown>> = { fr, en, ar, zgh };
const RTL_LOCALES: Locale[] = ["ar"];
const STORAGE_KEY = "Kreli_locale";
// Regex that matches the locale prefix at the start of a pathname
const LOCALE_PATH_RE = new RegExp(`^/(${VALID_LOCALES.join("|")})(\/|$)`);

function resolve(obj: Record<string, unknown>, key: string): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc !== null && acc !== undefined && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : key;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  // On mount: resolve locale from path > URL param > cookie > localStorage
  useEffect(() => {
    try {
      const pathLocale = window.location.pathname.split("/")[1] as Locale | null;
      const urlParam = new URLSearchParams(window.location.search).get("locale") as Locale | null;
      const cookieLocale = getCookie(STORAGE_KEY) as Locale | null;
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;

      const resolved = [pathLocale, urlParam, cookieLocale, stored].find(
        (l): l is Locale => !!l && (VALID_LOCALES as readonly string[]).includes(l)
      );
      if (resolved) setLocaleState(resolved);
    } catch {
      // SSR / private-browsing guard
    }
  }, []);

  // Keep <html dir> and <html lang> in sync
  useEffect(() => {
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      setCookie(STORAGE_KEY, newLocale);

      // Navigate to the locale-prefixed version of the current path
      const currentPath = window.location.pathname;
      // Strip any existing locale prefix first
      const stripped = currentPath.replace(LOCALE_PATH_RE, "/");
      const newPath = `/${newLocale}${stripped === "/" ? "" : stripped}`;
      window.location.href = newPath + window.location.search;
    } catch {
      // SSR guard
    }
  }, []);

  const t = useCallback(
    (key: string): string => resolve(MESSAGES[locale], key),
    [locale]
  );

  const dir: "ltr" | "rtl" = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  const value = useMemo(
    () => ({ locale, setLocale, t, dir }),
    [locale, setLocale, t, dir]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[useI18n] called outside <I18nProvider>.");
    }
    return { locale: "fr", setLocale: () => {}, t: (key) => key, dir: "ltr" };
  }
  return ctx;
}
