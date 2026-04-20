"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  Building2,
  X,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { href: "/dashboard/locataire", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/locataire/locations", label: "Mes Locations", icon: Package },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/locataire/profile", label: "Profil", icon: User },
];

interface Props {
  onClose?: () => void;
}

export default function LocataireSidebar({ onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  function navigate(href: string) {
    onClose?.();
    router.push(href);
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const canSwitchToProprio = user?.role === "proprietaire" || user?.role === "both";
  const initials = user?.nom
    ? user.nom.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex h-full flex-col bg-[#0f172a]">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <Link href="/" className="flex items-center" onClick={onClose}>
          <span className="text-2xl font-black text-white">Kre</span>
          <span className="text-2xl font-black text-[#ff6700]">li</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="px-5 pb-2 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ff6700]/15 px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff6700]" />
          <span className="text-xs font-semibold text-[#ff6700]">Espace Locataire</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Tooltip key={href}>
              <TooltipTrigger
                render={
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-[#ff6700] text-white shadow-[0_4px_14px_rgba(255,103,0,0.3)]"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  />
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="h-4 w-4 opacity-60" />}
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          );
        })}

        {canSwitchToProprio && (
          <>
            <div className="my-2 mx-1 border-t border-white/10" />
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Autre espace
            </p>
            <Link
              href="/dashboard/proprietaire"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <Building2 className="h-5 w-5 shrink-0" />
              Propriétaire
            </Link>
          </>
        )}
      </nav>

      {/* User footer with dropdown */}
      <div className="border-t border-white/10 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left hover:bg-white/10 transition-colors focus:outline-none"
          >
            <Avatar className="h-8 w-8 shrink-0">
              {user?.photo && <AvatarImage src={user.photo} alt={user.nom} />}
              <AvatarFallback className="bg-[#004e98] text-xs font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.nom}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/dashboard/locataire/profile")}>
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            {canSwitchToProprio && (
              <DropdownMenuItem onClick={() => navigate("/dashboard/proprietaire")}>
                <Building2 className="mr-2 h-4 w-4" />
                Espace Propriétaire
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
