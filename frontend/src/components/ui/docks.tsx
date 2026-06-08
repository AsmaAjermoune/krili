"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/context/I18nContext";
import { useEffect, useState } from "react";
import { CurtainThemeToggle } from "@/components/ui/curtain-theme-toggle";

export function ThemeDock() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const active =
    "bg-black/10 dark:bg-white/15 font-semibold";
  const base =
    "px-4 py-2 flex items-center gap-2 text-black dark:text-white bg-transparent hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300 focus:outline-none focus:ring-0 group";

  return (
    <div className="inline-flex rounded-xl overflow-hidden relative bg-white/20 dark:bg-black/40 backdrop-blur-md shadow-lg shadow-black/20 border border-gray-300 dark:border-white/10 transition-colors duration-500">
      <button
        onClick={() => setTheme("light")}
        className={`${base} rounded-l-xl border-r border-gray-300 dark:border-white/10 ${theme === "light" ? active : ""}`}
        aria-label="Light mode"
        aria-pressed={theme === "light"}
      >
        <Sun className="w-4 h-4 text-current transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        <span className="select-none text-sm">{t("theme.light")}</span>
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`${base} border-r border-gray-300 dark:border-white/10 ${theme === "dark" ? active : ""}`}
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
      >
        <Moon className="w-4 h-4 text-current transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        <span className="select-none text-sm">{t("theme.dark")}</span>
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`${base} rounded-r-xl ${theme === "system" ? active : ""}`}
        aria-label="System theme"
        aria-pressed={theme === "system"}
      >
        <Monitor className="w-4 h-4 text-current transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        <span className="select-none text-sm">{t("theme.system")}</span>
      </button>
    </div>
  );
}

export function ThemeToggleIcon({ scrolled = false }: { scrolled?: boolean }) {
  return <CurtainThemeToggle size={36} duration={550} scrolled={scrolled} />;
}
