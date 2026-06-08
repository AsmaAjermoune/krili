"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutGrid,
  Package,
  CreditCard,
  MessageSquare,
  User,
  LogOut,
  Building2,
  X,
  Search,
  Home,
  Heart,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Package;
  exact?: boolean;
  badgeKey?: "messages";
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard/locataire", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/dashboard/locataire/locations", label: "Mes locations", icon: Package },
  { href: "/dashboard/locataire/paiements", label: "Paiements", icon: CreditCard },
  { href: "/dashboard/locataire/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" },
  { href: "/dashboard/locataire/favoris", label: "Favoris", icon: Heart },
  { href: "/dashboard/locataire/profile", label: "Mon profil", icon: User },
];

interface Props {
  onClose?: () => void;
  unreadMessages?: number;
}

export default function LocataireSidebar({ onClose, unreadMessages = 0 }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const canSwitchToProprio = user?.role === "proprietaire" || user?.role === "both";
  const initials = user?.nom
    ? user.nom.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside
      className="flex h-full flex-col"
      style={{
        background: "var(--lm-bone)",
        borderRight: "1px solid var(--lm-line)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-6 pt-7 pb-6">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 place-items-center rounded-[7px] text-[14px] font-black"
            style={{
              background: "var(--lm-ink)",
              color: "var(--lm-paper)",
              fontFamily: "var(--lm-f-display)",
              letterSpacing: "-0.05em",
            }}
          >
            M
          </span>
          <span
            className="text-[18px] font-extrabold"
            style={{
              fontFamily: "var(--lm-f-display)",
              letterSpacing: "-0.045em",
              color: "var(--lm-ink)",
            }}
          >
            Kreli<span style={{ color: "var(--lm-signal)" }}>.</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg transition-colors hover:bg-black/5"
            style={{ color: "var(--lm-mid)" }}
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Section label */}
      <p
        className="lm-eyebrow px-6 pb-3"
        style={{ color: "var(--lm-muted)" }}
      >
        Menu
      </p>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 px-3">
        {PRIMARY_NAV.map(({ href, label, icon: Icon, exact, badgeKey }) => {
          const active = isActive(href, exact);
          const showMsgBadge = badgeKey === "messages" && unreadMessages > 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
              style={
                active
                  ? {
                      background: "var(--lm-ink)",
                      color: "var(--lm-paper)",
                    }
                  : {
                      color: "var(--lm-char)",
                    }
              }
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--lm-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
              <span className="flex-1 truncate">{label}</span>
              {showMsgBadge && (
                <span
                  className="lm-mono grid min-w-[20px] place-items-center rounded-full px-1.5"
                  style={{
                    height: 20,
                    background: active ? "var(--lm-signal)" : "var(--lm-ink)",
                    color: "var(--lm-paper)",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {unreadMessages}
                </span>
              )}
            </Link>
          );
        })}

        {canSwitchToProprio && (
          <Link
            href="/dashboard/proprietaire"
            onClick={onClose}
            className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
            style={{ color: "var(--lm-char)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--lm-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Building2 className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
            <span className="flex-1 truncate">Espace Propriétaire</span>
          </Link>
        )}
      </nav>

      {/* Shortcuts */}
      <p
        className="lm-eyebrow mt-7 px-6 pb-3"
        style={{ color: "var(--lm-muted)" }}
      >
        Raccourcis
      </p>
      <nav className="flex flex-col gap-0.5 px-3">
        <Link
          href="/catalogue"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-[13.5px] font-medium transition-colors"
          style={{ color: "var(--lm-mid)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--lm-hover)";
            e.currentTarget.style.color = "var(--lm-ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--lm-mid)";
          }}
        >
          <Search className="h-[16px] w-[16px] shrink-0" strokeWidth={1.75} />
          Chercher un matériel
        </Link>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-[13.5px] font-medium transition-colors"
          style={{ color: "var(--lm-mid)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--lm-hover)";
            e.currentTarget.style.color = "var(--lm-ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--lm-mid)";
          }}
        >
          <Home className="h-[16px] w-[16px] shrink-0" strokeWidth={1.75} />
          Page d&apos;accueil
        </Link>
      </nav>

      <div className="flex-1" />

      {/* User card */}
      <div className="px-3 pb-3">
        <div
          className="flex items-center gap-3 rounded-2xl p-3"
          style={{
            background: "var(--lm-paper)",
            border: "1px solid var(--lm-line)",
          }}
        >
          <div
            className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-[13px] font-extrabold"
            style={{
              background: "var(--lm-signal)",
              color: "var(--lm-paper)",
              fontFamily: "var(--lm-f-display)",
              letterSpacing: "-0.02em",
            }}
          >
            {user?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photo} alt={user.nom} className="h-10 w-10 object-cover" />
            ) : (
              initials
            )}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2"
              style={{
                background: "#1A6B3F",
                boxShadow: "0 0 0 2px var(--lm-paper)",
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[13.5px] font-bold"
              style={{ color: "var(--lm-ink)", letterSpacing: "-0.01em" }}
            >
              {user?.nom}
            </p>
            <p
              className="lm-mono mt-0.5 truncate text-[10.5px]"
              style={{ color: "var(--lm-mid)" }}
            >
              LOCATAIRE
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors"
            style={{ color: "var(--lm-mid)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(176,36,26,0.08)";
              e.currentTarget.style.color = "#B0241A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--lm-mid)";
            }}
            aria-label="Se déconnecter"
          >
            <LogOut className="h-[15px] w-[15px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
