"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { X, LogOut, Users, Home } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/proprietaire", label: "Tableau de bord", icon: "grid", exact: true },
  { href: "/dashboard/proprietaire/materiels", label: "Mes matériels", icon: "package" },
  { href: "/dashboard/proprietaire/ajouter", label: "Ajouter", icon: "plus" },
  { href: "/dashboard/proprietaire/locations", label: "Demandes", icon: "inbox" },
  { href: "/dashboard/proprietaire/revenus", label: "Revenus", icon: "chart" },
  { href: "/dashboard/proprietaire/messages", label: "Messages", icon: "chat" },
  { href: "/dashboard/proprietaire/profile", label: "Mon profil", icon: "user" },
];

const ICONS: Record<string, React.ReactNode> = {
  grid: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/>
      <rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>
    </svg>
  ),
  package: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3H8L4 7v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7l-4-4z"/><path d="M4 7h16M9 11h6"/>
    </svg>
  ),
  plus: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  inbox: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13l3-9h12l3 9M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6M3 13h5l2 3h4l2-3h5"/>
    </svg>
  ),
  chart: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16"/><path d="M7 16V10M12 16V6M17 16v-4"/>
    </svg>
  ),
  chat: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12c0 4.4-4 8-9 8-1.4 0-2.7-.3-3.9-.8L3 21l1.3-4.4A7.7 7.7 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8z"/>
    </svg>
  ),
  user: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
    </svg>
  ),
};

interface Props {
  onClose?: () => void;
  unreadMessages?: number;
}

export default function ProprietaireSidebar({ onClose, unreadMessages = 0 }: Props) {
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

  const canSwitchToLocataire = user?.role === "locataire" || user?.role === "both";
  const initials = user?.nom
    ? user.nom.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "P";

  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: "var(--lm-bone)",
        borderRight: "1px solid var(--lm-line)",
        padding: "28px 16px 20px",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "0 10px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "var(--lm-ink)", textDecoration: "none" }}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect x="1" y="1" width="30" height="30" rx="8" style={{ fill: "var(--lm-ink)" }} />
            <path d="M11 22V10h2.4l3.4 5.4L19.2 10H21.6V22H19.4V13.5l-3.6 5.7-3.6-5.7V22H11Z" fill="white"/>
          </svg>
          <span style={{ font: "700 17px/1 var(--lm-f-display, 'Inter Tight', sans-serif)", letterSpacing: "-0.045em" }}>
            Kreli<span style={{ color: "var(--lm-signal)" }}>.</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--lm-mid)", display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 8 }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact);
          const isMessages = icon === "chat";
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                color: active ? "var(--lm-paper)" : "var(--lm-char)",
                background: active ? "var(--lm-ink)" : "transparent",
                cursor: "pointer",
                transition: "background .12s, color .12s",
                textDecoration: "none",
              }}
            >
              {ICONS[icon]}
              <span style={{ flex: 1 }}>{label}</span>
              {isMessages && unreadMessages > 0 && (
                <span style={{
                  background: active ? "var(--lm-signal)" : "var(--lm-ink)",
                  color: "var(--lm-paper)",
                  minWidth: 20,
                  height: 20,
                  padding: "0 6px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontFamily: "var(--lm-f-mono, monospace)",
                  fontWeight: 600,
                  display: "grid",
                  placeItems: "center",
                }}>
                  {unreadMessages}
                </span>
              )}
            </Link>
          );
        })}

        <div style={{ height: 1, background: "var(--lm-line)", margin: "8px 4px" }} />

        <Link
          href="/"
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            color: "var(--lm-mid)",
            textDecoration: "none",
            transition: "background .12s",
          }}
        >
          <Home size={17} />
          <span style={{ flex: 1 }}>Retour à l&apos;accueil</span>
        </Link>

        {canSwitchToLocataire && (
          <Link
            href="/dashboard/locataire"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--lm-mid)",
              textDecoration: "none",
              transition: "background .12s",
            }}
          >
            <Users size={17} />
            <span style={{ flex: 1 }}>Espace Locataire</span>
          </Link>
        )}
      </nav>

      <div style={{ flex: 1 }} />

      {/* User card */}
      <div style={{
        marginTop: 16,
        padding: 14,
        border: "1px solid var(--lm-line)",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "var(--lm-paper)",
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 999,
          background: "var(--lm-signal)",
          color: "#FFFFFF",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--lm-f-display, 'Inter Tight', sans-serif)",
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: "-0.02em",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {user?.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photo} alt={user.nom} style={{ width: 38, height: 38, objectFit: "cover" }} />
          ) : (
            initials
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--lm-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.nom}
          </div>
          <div style={{ fontFamily: "var(--lm-f-mono, monospace)", fontSize: 10.5, color: "var(--lm-mid)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            LOUEUR
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: 30,
            height: 30,
            border: "none",
            background: "transparent",
            color: "var(--lm-mid)",
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
          title="Se déconnecter"
        >
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
}
