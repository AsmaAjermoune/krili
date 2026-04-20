"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  LogOut,
  User,
  Bell,
  CheckCheck,
  Menu,
  X,
  Grid3X3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { getCategories, type Category } from "@/lib/api";
import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DropdownCategory {
  _id: string;
  nom: string;
  subtitle: string;
  image: string;
}

const FALLBACK_DROPDOWN: DropdownCategory[] = [
  {
    _id: "1",
    nom: "BTP & Chantier",
    subtitle: "Grues, pelles, nacelles…",
    image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=96&q=80",
  },
  {
    _id: "2",
    nom: "Outillage Pro",
    subtitle: "Perceuses, meuleuses…",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=96&q=80",
  },
  {
    _id: "3",
    nom: "Événementiel",
    subtitle: "Sono, éclairage, tentes…",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=96&q=80",
  },
  {
    _id: "4",
    nom: "Électronique",
    subtitle: "Mesures, audiovisuel…",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=96&q=80",
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.14, ease: "easeIn" },
  },
};

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dropdownCats, setDropdownCats] = useState<DropdownCategory[]>(FALLBACK_DROPDOWN);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(token);

  useEffect(() => {
    getCategories()
      .then((cats: Category[]) => {
        if (cats.length > 0) {
          const mapped: DropdownCategory[] = cats.slice(0, 6).map((c, i) => ({
            _id: c._id,
            nom: c.nom,
            subtitle: FALLBACK_DROPDOWN[i % FALLBACK_DROPDOWN.length]?.subtitle ?? c.nom,
            image:
              c.image ??
              (FALLBACK_DROPDOWN[i % FALLBACK_DROPDOWN.length]?.image ?? ""),
          }));
          setDropdownCats(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(searchValue.trim())}`);
      setSheetOpen(false);
    }
  }

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setSheetOpen(false);
    router.push("/");
  }

  const handleNotifClick = useCallback(
    async (notif: { _id: string; lu: boolean; lienRedirection: string }) => {
      if (!notif.lu) await markRead(notif._id);
      setNotifOpen(false);
      if (notif.lienRedirection) router.push(notif.lienRedirection);
    },
    [markRead, router]
  );

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{
        borderBottom: "1px solid #f1f5f9",
        boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
      }}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-4 lg:px-8">
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center shrink-0">
          <span
            className="text-[24px] font-black tracking-[-0.6px]"
            style={{ color: "#004e98" }}
          >
            Kre
          </span>
          <span
            className="text-[24px] font-black tracking-[-0.6px]"
            style={{ color: "#ff6700" }}
          >
            li
          </span>
        </Link>

        {/* ── Desktop search ────────────────────────────────────────── */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 lg:flex max-w-[400px]"
        >
          <div
            className="relative flex w-full items-center overflow-hidden py-[9px] pl-10 pr-4"
            style={{ backgroundColor: "#f1f5f9", borderRadius: "9999px" }}
          >
            <Search
              className="absolute left-3 h-[18px] w-[18px] shrink-0"
              style={{ color: "#6b7280" }}
            />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent outline-none text-[14px]"
              style={{ color: "#0f172a" }}
              placeholder="Rechercher un matériel..."
            />
          </div>
        </form>

        {/* ── Desktop nav links ─────────────────────────────────────── */}
        <div className="ml-2 hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className="text-[15px] font-semibold transition-colors hover:opacity-70"
            style={{ color: "#334155" }}
          >
            Accueil
          </Link>

          <div
            className="relative"
            ref={catRef}
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-1 text-[15px] font-semibold transition-colors hover:opacity-70"
              style={{ color: "#334155" }}
              aria-expanded={catOpen}
              aria-haspopup="true"
            >
              Catégories
              <motion.span
                animate={{ rotate: catOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>

            <AnimatePresence>
              {catOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute left-0 top-full mt-3 min-w-[540px] rounded-2xl border border-[#e2e8f0] bg-white shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4">
                    <p className="mb-3 text-[11px] font-black uppercase tracking-[1.5px] text-[#94a3b8]">
                      Parcourir les catégories
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {dropdownCats.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/catalogue?categorie=${cat._id}`}
                          onClick={() => setCatOpen(false)}
                          className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[#f8fafc]"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f1f5f9]">
                            <img
                              src={cat.image}
                              alt={cat.nom}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-bold text-[#0f172a]">
                              {cat.nom}
                            </p>
                            <p className="truncate text-[12px] text-[#64748b]">
                              {cat.subtitle}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div
                    className="border-t border-[#f1f5f9] px-4 py-3"
                    style={{ backgroundColor: "#f8fafc" }}
                  >
                    <Link
                      href="/catalogue"
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-2 text-[13px] font-bold transition-colors hover:opacity-70"
                      style={{ color: "#004e98" }}
                    >
                      <Grid3X3 className="h-4 w-4" />
                      Voir tout le catalogue →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/catalogue"
            className="text-[15px] font-semibold transition-colors hover:opacity-70"
            style={{ color: "#334155" }}
          >
            Catalogue
          </Link>
        </div>

        {/* ── Auth area ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotifOpen((o) => !o);
                    setUserMenuOpen(false);
                  }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] hover:border-[#004e98] transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-4.5 w-4.5 text-[#334155]" style={{ height: 18, width: 18 }} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff6700] px-1 text-[10px] font-bold text-white leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[#e2e8f0] bg-white shadow-xl z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0]">
                        <span className="text-sm font-bold text-[#0f172a]">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllRead()}
                            className="flex items-center gap-1 text-xs font-medium text-[#004e98] hover:opacity-70"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Tout marquer lu
                          </button>
                        )}
                      </div>
                      <div className="max-h-[360px] overflow-y-auto divide-y divide-[#f1f5f9]">
                        {notifications.length === 0 ? (
                          <p className="py-8 text-center text-sm text-[#94a3b8]">
                            Aucune notification
                          </p>
                        ) : (
                          notifications.slice(0, 15).map((n) => (
                            <button
                              key={n._id}
                              onClick={() => handleNotifClick(n)}
                              className={`w-full text-left px-4 py-3 hover:bg-[#f8fafc] transition-colors ${
                                !n.lu ? "bg-[#eff6ff]" : ""
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {!n.lu && (
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#004e98]" />
                                )}
                                <div className={!n.lu ? "" : "pl-4"}>
                                  <p className="text-sm font-semibold text-[#0f172a] leading-snug">
                                    {n.titre}
                                  </p>
                                  <p className="text-xs text-[#64748b] mt-0.5 line-clamp-2">
                                    {n.contenu}
                                  </p>
                                  <p className="text-[11px] text-[#94a3b8] mt-1">
                                    {timeAgo(n.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => {
                    setUserMenuOpen((o) => !o);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-[#e2e8f0] px-3 py-1.5 text-sm font-medium transition-colors hover:border-[#004e98]"
                  style={{ color: "#0f172a" }}
                >
                  <div className="h-7 w-7 rounded-full bg-[#004e98]/10 flex items-center justify-center overflow-hidden">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt={user.nom}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-[#004e98]" />
                    )}
                  </div>
                  <span className="hidden md:inline text-[14px] font-semibold">
                    {user.nom.split(" ")[0]}
                  </span>
                  <motion.span
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#e2e8f0] bg-white shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-[#f1f5f9]">
                        <p className="text-sm font-semibold text-[#0f172a]">
                          {user.nom}
                        </p>
                        <p className="text-xs text-[#64748b] truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f8fafc] transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Mon tableau de bord
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex px-4 py-2 text-[15px] font-bold transition-colors hover:opacity-70"
                style={{ color: "#004e98" }}
              >
                Se connecter
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full px-5 py-2 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#ff6700",
                  boxShadow:
                    "0px 4px 14px -3px rgba(255,103,0,0.35)",
                }}
              >
                S&apos;inscrire
              </Link>
            </>
          )}

          {/* ── Mobile hamburger ──────────────────────────────────── */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] hover:border-[#004e98] transition-colors"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {sheetOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <X className="h-4.5 w-4.5 text-[#334155]" style={{ height: 18, width: 18 }} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <Menu className="h-4.5 w-4.5 text-[#334155]" style={{ height: 18, width: 18 }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </SheetTrigger>

            <SheetContent side="right" showCloseButton={false} className="w-[320px] sm:max-w-[320px] p-0 overflow-y-auto">
              <div className="flex flex-col min-h-full">
                <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
                  <Link
                    href="/"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center"
                  >
                    <span className="text-[22px] font-black" style={{ color: "#004e98" }}>
                      Kre
                    </span>
                    <span className="text-[22px] font-black" style={{ color: "#ff6700" }}>
                      li
                    </span>
                  </Link>
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2e8f0] hover:border-[#004e98] transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="h-4 w-4 text-[#334155]" />
                  </button>
                </div>

                <div className="px-5 py-4 border-b border-[#f1f5f9]">
                  <form onSubmit={handleSearch}>
                    <div
                      className="relative flex items-center overflow-hidden py-2.5 pl-9 pr-3"
                      style={{ backgroundColor: "#f1f5f9", borderRadius: "9999px" }}
                    >
                      <Search
                        className="absolute left-3 h-4 w-4"
                        style={{ color: "#6b7280" }}
                      />
                      <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full bg-transparent outline-none text-[14px]"
                        style={{ color: "#0f172a" }}
                        placeholder="Rechercher un matériel..."
                      />
                    </div>
                  </form>
                </div>

                <div className="flex flex-col px-3 py-3">
                  <Link
                    href="/"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center rounded-lg px-3 py-3 text-[15px] font-semibold text-[#334155] hover:bg-[#f8fafc] transition-colors"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/catalogue"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center rounded-lg px-3 py-3 text-[15px] font-semibold text-[#334155] hover:bg-[#f8fafc] transition-colors"
                  >
                    Catalogue
                  </Link>

                  <div className="mt-1">
                    <p className="px-3 pt-2 pb-1 text-[11px] font-black uppercase tracking-[1.5px] text-[#94a3b8]">
                      Catégories
                    </p>
                    <div className="space-y-1">
                      {dropdownCats.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/catalogue?categorie=${cat._id}`}
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#f8fafc] transition-colors"
                        >
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#f1f5f9]">
                            <img
                              src={cat.image}
                              alt={cat.nom}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#0f172a]">
                              {cat.nom}
                            </p>
                            <p className="text-[11px] text-[#64748b]">{cat.subtitle}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-[#f1f5f9] px-5 py-5">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 rounded-xl bg-[#f8fafc] px-4 py-3">
                        <div className="h-9 w-9 rounded-full bg-[#004e98]/10 flex items-center justify-center overflow-hidden shrink-0">
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt={user.nom}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-[#004e98]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#0f172a] truncate">
                            {user.nom}
                          </p>
                          <p className="text-xs text-[#64748b] truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-full border border-[#e2e8f0] py-2.5 text-[14px] font-bold text-[#334155] hover:border-[#004e98] transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Tableau de bord
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 rounded-full bg-red-50 py-2.5 text-[14px] font-bold text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/auth/login"
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center justify-center rounded-full border-2 py-3 text-[15px] font-bold transition-colors hover:bg-[#f8fafc]"
                        style={{ borderColor: "#004e98", color: "#004e98" }}
                      >
                        Se connecter
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center justify-center rounded-full py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#ff6700" }}
                      >
                        S&apos;inscrire
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
