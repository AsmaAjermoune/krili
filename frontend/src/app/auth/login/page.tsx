"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { requestAndSaveLocation } from "@/lib/userLocation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LoginForm() {
  const { login } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginUser(email, password);
      requestAndSaveLocation();
      login(token, user);
      const redirect = searchParams.get("redirect");
      if (redirect?.startsWith("/dashboard")) {
        router.push(redirect);
      } else if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "proprietaire" || user.role === "both") {
        router.push("/dashboard/proprietaire");
      } else {
        router.push("/dashboard/locataire");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.err_invalid_credentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900" style={{ backgroundColor: "#f1f5f9" }}>
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-[480px] rounded-2xl bg-white dark:bg-slate-800 px-8 py-10"
          style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)" }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-[26px] font-black text-[#0f172a] dark:text-white">
              {t("auth.login_title")}
            </h1>
            <p className="mt-1.5 text-[14px] text-[#64748b] dark:text-slate-400">
              {t("auth.login_subtitle")}
            </p>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 py-3 text-[14px] font-semibold text-[#334155] dark:text-slate-200 transition-colors hover:bg-[#f8fafc] dark:hover:bg-slate-600"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              {t("auth.social_google")}
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 py-3 text-[14px] font-semibold text-[#334155] dark:text-slate-200 transition-colors hover:bg-[#f8fafc] dark:hover:bg-slate-600"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect width="18" height="18" rx="4" fill="#1877F2"/>
                <path d="M12.5 9H10.5V16H7.5V9H6V6.5H7.5V5C7.5 3.619 8.119 2 10.5 2H12.5V4.5H11C10.724 4.5 10.5 4.724 10.5 5V6.5H12.5L12 9H12.5Z" fill="white"/>
              </svg>
              {t("auth.social_facebook")}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6 flex items-center">
            <div className="flex-1 border-t border-[#e2e8f0] dark:border-slate-600" />
            <span className="mx-4 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#94a3b8] dark:text-slate-500">
              {t("auth.or_email")}
            </span>
            <div className="flex-1 border-t border-[#e2e8f0] dark:border-slate-600" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[14px] font-semibold text-[#0f172a] dark:text-slate-300">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.email_placeholder")}
                  className="w-full rounded-xl border border-[#e2e8f0] dark:border-slate-600 bg-[#f8fafc] dark:bg-slate-700 py-3 pl-10 pr-4 text-[14px] text-[#0f172a] outline-none transition focus:border-[#004e98] focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-[#004e98]/10 dark:placeholder:text-slate-500 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#0f172a] dark:text-slate-300">
                  {t("auth.password")}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[13px] font-semibold transition-colors hover:opacity-70"
                  style={{ color: "#ff6700" }}
                >
                  {t("auth.forgot_password")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.password_placeholder")}
                  className="w-full rounded-xl border border-[#e2e8f0] dark:border-slate-600 bg-[#f8fafc] dark:bg-slate-700 py-3 pl-10 pr-10 text-[14px] text-[#0f172a] outline-none transition focus:border-[#004e98] focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-[#004e98]/10 dark:placeholder:text-slate-500 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#94a3b8" }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#cbd5e1] accent-[#004e98]"
              />
              <span className="text-[14px] text-[#475569] dark:text-slate-400">
                {t("auth.remember_me")}
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-3.5 text-[15px] font-black text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
              style={{ backgroundColor: "#ff6700", boxShadow: "0 4px 14px rgba(255,103,0,0.3)" }}
            >
              {loading ? t("auth.login_loading") : t("auth.login_button")}
            </button>
          </form>

          {/* Sign up */}
          <p className="mt-6 text-center text-[14px] text-[#64748b] dark:text-slate-400">
            {t("auth.no_account")}{" "}
            <Link href="/auth/signup" className="font-bold transition-colors hover:opacity-70" style={{ color: "#ff6700" }}>
              {t("auth.signup_link")}
            </Link>
          </p>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-t border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-800 py-6">
        <div className="mx-auto flex max-w-sm items-center justify-around gap-6">
          {[
            { icon: "🔒", label: t("auth.trust_secure") },
            { icon: "🎧", label: t("auth.trust_support") },
            { icon: "🤝", label: t("auth.trust_community") },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <span className="text-[22px]">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-[2px] text-[#94a3b8] dark:text-slate-500">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen dark:bg-slate-900" style={{ backgroundColor: "#f1f5f9" }} />}>
      <LoginForm />
    </Suspense>
  );
}
