"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  HardHat,
  Wrench,
  Truck,
  Music2,
  Lightbulb,
  Camera,
  TreePine,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

function useDebounce<T>(value: T, delay = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
  href?: string;
}

interface SearchResult {
  actions: Action[];
}

interface ActionSearchBarProps {
  actions?: Action[];
  placeholder?: string;
  label?: string;
  variant?: "light" | "dark";
}

function ActionSearchBar({
  actions: providedActions,
  placeholder,
  label,
  variant = "light",
}: ActionSearchBarProps) {
  const router = useRouter();
  const { t } = useI18n();

  const actions = useMemo<Action[]>(
    () =>
      providedActions ?? [
        {
          id: "btp",
          label: t("search_actions.btp"),
          icon: <HardHat className="h-4 w-4" style={{ color: "#ff6700" }} />,
          description: t("search_actions.btp_desc"),
          end: t("search_actions.category_badge"),
          href: "/catalogue?categorie=btp",
        },
        {
          id: "outils",
          label: t("search_actions.outils"),
          icon: <Wrench className="h-4 w-4" style={{ color: "#0ea5e9" }} />,
          description: t("search_actions.outils_desc"),
          end: t("search_actions.category_badge"),
          href: "/catalogue?categorie=outils",
        },
        {
          id: "transport",
          label: t("search_actions.transport"),
          icon: <Truck className="h-4 w-4" style={{ color: "#22c55e" }} />,
          description: t("search_actions.transport_desc"),
          end: t("search_actions.category_badge"),
          href: "/catalogue?categorie=transport",
        },
        {
          id: "event",
          label: t("search_actions.event"),
          icon: <Music2 className="h-4 w-4" style={{ color: "#a855f7" }} />,
          description: t("search_actions.event_desc"),
          end: t("search_actions.category_badge"),
          href: "/catalogue?categorie=evenementiel",
        },
        {
          id: "audio-video",
          label: t("search_actions.audio_video"),
          icon: <Camera className="h-4 w-4" style={{ color: "#ef4444" }} />,
          description: t("search_actions.audio_video_desc"),
          end: t("search_actions.category_badge"),
          href: "/catalogue?categorie=audio-video",
        },
        {
          id: "energie",
          label: t("search_actions.energie"),
          icon: <Lightbulb className="h-4 w-4" style={{ color: "#eab308" }} />,
          description: t("search_actions.energie_desc"),
          end: t("search_actions.category_badge"),
          href: "/catalogue?categorie=energie",
        },
        {
          id: "jardin",
          label: t("search_actions.jardin"),
          icon: <TreePine className="h-4 w-4" style={{ color: "#16a34a" }} />,
          description: t("search_actions.jardin_desc"),
          end: t("search_actions.category_badge"),
          href: "/catalogue?categorie=jardin",
        },
        {
          id: "tendance",
          label: t("search_actions.tendance"),
          icon: <Sparkles className="h-4 w-4" style={{ color: "#ff6700" }} />,
          description: t("search_actions.tendance_desc"),
          end: t("search_actions.popular_badge"),
          href: "/catalogue?sort=popular",
        },
      ],
    [providedActions, t]
  );

  const resolvedPlaceholder = placeholder ?? t("search.hero_placeholder");
  const resolvedLabel = label !== undefined ? label : t("search.cmd_label");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!isFocused) {
      setResult(null);
      return;
    }
    if (!debouncedQuery) {
      setResult({ actions });
      return;
    }
    const normalized = debouncedQuery.toLowerCase().trim();
    const filtered = actions.filter(
      (a) =>
        a.label.toLowerCase().includes(normalized) ||
        a.description?.toLowerCase().includes(normalized)
    );
    setResult({ actions: filtered });
  }, [debouncedQuery, isFocused, actions]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/catalogue?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/catalogue");
    }
  }

  function handleSelect(action: Action) {
    setSelectedAction(action);
    setIsFocused(false);
    if (action.href) router.push(action.href);
  }

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { height: { duration: 0.4 }, staggerChildren: 0.06 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  const isDark = variant === "dark";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex flex-col justify-start items-center">
        <form onSubmit={handleSubmit} className="w-full">
          {resolvedLabel && (
            <label
              className={`mb-1.5 block text-[11px] font-black uppercase tracking-[1.5px] ${
                isDark ? "text-white/60" : "text-slate-500"
              }`}
              htmlFor="lm-search"
            >
              {resolvedLabel}
            </label>
          )}
          <div className="relative">
            <Input
              id="lm-search"
              type="text"
              placeholder={resolvedPlaceholder}
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                setSelectedAction(null);
                setIsFocused(true);
              }}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              className={`h-14 rounded-2xl pl-5 pr-12 text-[15px] font-medium shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-offset-0 ${
                isDark
                  ? "bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#ff6700]"
                  : "bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#004e98]"
              }`}
              style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-105"
              style={{
                backgroundColor: "#ff6700",
                boxShadow: "0 4px 14px rgba(255,103,0,0.4)",
              }}
              aria-label={t("search.button")}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {query.length > 0 ? (
                  <motion.div
                    key="send"
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="h-4 w-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="h-4 w-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </form>

        <div className="w-full">
          <AnimatePresence>
            {isFocused && result && !selectedAction && result.actions.length > 0 && (
              <motion.div
                className="mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul className="py-1">
                  {result.actions.map((action) => (
                    <motion.li
                      key={action.id}
                      className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50"
                      variants={item}
                      layout
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(action)}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: "#f8fafc" }}
                        >
                          {action.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[14px] font-semibold text-slate-900">
                            {action.label}
                          </div>
                          {action.description && (
                            <div className="truncate text-[12px] text-slate-500">
                              {action.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {action.end && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[1px] text-slate-600">
                          {action.end}
                        </span>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="border-t border-slate-100 px-4 py-2.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>{t("search.submit")}</span>
                    <span>{t("search.esc")}</span>
                  </div>
                </div>
              </motion.div>
            )}
            {isFocused && result && result.actions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center shadow-xl"
              >
                <p className="text-[14px] font-medium text-slate-600">
                  {t("search.no_match")} &laquo; {debouncedQuery} &raquo;
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  {t("search.free_search_hint")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export { ActionSearchBar };
