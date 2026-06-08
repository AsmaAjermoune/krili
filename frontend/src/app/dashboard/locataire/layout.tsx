"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, Bell } from "lucide-react";
import Link from "next/link";
import LocataireSidebar from "@/components/dashboard/LocataireSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getNotifications } from "@/lib/api";

export default function LocataireLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      getNotifications().then((r) => setUnread(r.unreadCount)).catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--lm-paper)" }}
      >
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: "var(--lm-signal)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--lm-paper)", color: "var(--lm-ink)" }}
    >
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 overflow-y-auto lg:block">
        <LocataireSidebar unreadMessages={unread} />
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[260px] p-0 border-0" showCloseButton={false}>
          <LocataireSidebar onClose={() => setMobileOpen(false)} unreadMessages={unread} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar — light, matches the desktop direction */}
        <header
          className="flex items-center justify-between px-4 py-3 lg:hidden"
          style={{
            background: "var(--lm-paper)",
            borderBottom: "1px solid var(--lm-line)",
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-black/5"
            style={{ color: "var(--lm-ink)" }}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <Link href="/" className="flex items-center gap-1.5">
            <span
              className="grid h-6 w-6 place-items-center rounded-[6px] text-[12px] font-black"
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
              className="text-[16px] font-extrabold"
              style={{
                fontFamily: "var(--lm-f-display)",
                letterSpacing: "-0.045em",
                color: "var(--lm-ink)",
              }}
            >
              Kreli<span style={{ color: "var(--lm-signal)" }}>.</span>
            </span>
          </Link>

          <Link
            href="/dashboard/locataire"
            className="relative grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-black/5"
            style={{ color: "var(--lm-ink)" }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            {unread > 0 && (
              <span
                className="lm-mono absolute -right-0.5 -top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[9px] font-bold"
                style={{ background: "var(--lm-signal)", color: "var(--lm-paper)" }}
              >
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
        </header>

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ background: "var(--lm-paper)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
