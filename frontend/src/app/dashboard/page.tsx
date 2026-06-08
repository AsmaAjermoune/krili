"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRedirectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace("/auth/login"); return; }
    if (user.role === "admin") router.replace("/dashboard/admin");
    else if (user.role === "proprietaire") router.replace("/dashboard/proprietaire");
    else router.replace("/dashboard/locataire");
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#ff6700] border-t-transparent" />
    </div>
  );
}
