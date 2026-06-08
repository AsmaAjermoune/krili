"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import ProprietaireSidebar from "@/components/dashboard/ProprietaireSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getNotifications } from "@/lib/api";

export default function ProprietaireLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
      return;
    }
    if (!isLoading && user && user.role !== "proprietaire" && user.role !== "both" && user.role !== "admin") {
      router.push("/dashboard/locataire");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      getNotifications().then((r) => setUnread(r.unreadCount)).catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "var(--lm-bone)" }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2.5px solid rgba(10,10,9,0.08)",
          borderTopColor: "#FF4D00",
          animation: "spin 0.7s linear infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--lm-bone)" }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block" style={{ width: 248, flexShrink: 0, overflowY: "auto" }}>
        <ProprietaireSidebar unreadMessages={unread} />
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[248px] p-0 border-0" showCloseButton={false}>
          <ProprietaireSidebar onClose={() => setMobileOpen(false)} unreadMessages={unread} />
        </SheetContent>
      </Sheet>

      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        {/* Mobile top bar */}
        <header
          className="flex items-center justify-between px-4 py-3 lg:hidden"
          style={{ background: "var(--lm-bone)", borderBottom: "1px solid var(--lm-line)" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "var(--lm-char)" }}
          >
            <Menu size={20} />
          </button>

          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--lm-ink)", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect x="1" y="1" width="30" height="30" rx="8" style={{ fill: "var(--lm-ink)" }} />
              <path d="M11 22V10h2.4l3.4 5.4L19.2 10H21.6V22H19.4V13.5l-3.6 5.7-3.6-5.7V22H11Z" fill="white"/>
            </svg>
            <span style={{ font: "700 16px/1 var(--lm-f-display, 'Inter Tight', sans-serif)", letterSpacing: "-0.04em" }}>
              Kreli<span style={{ color: "#FF4D00" }}>.</span>
            </span>
          </Link>

          <Link
            href="/dashboard/proprietaire/ajouter"
            style={{
              display: "grid",
              placeItems: "center",
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#FF4D00",
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            <Plus size={18} />
          </Link>
        </header>

        {/* Desktop top bar */}
        <header
          className="hidden lg:flex items-center justify-between px-8 py-3"
          style={{ background: "var(--lm-surface-card)", borderBottom: "1px solid var(--lm-line)" }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid var(--lm-line)",
            fontFamily: "var(--lm-f-mono, monospace)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--lm-mid)",
          }}>
            Espace Propriétaire
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href="/dashboard/proprietaire/ajouter"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                height: 36,
                padding: "0 16px",
                borderRadius: 999,
                background: "#FF4D00",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "-0.005em",
                textDecoration: "none",
                transition: "background .15s",
              }}
            >
              <Plus size={14} />
              Ajouter matériel
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</main>
      </div>
    </div>
  );
}
