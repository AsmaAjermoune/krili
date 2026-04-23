"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginUser(email, password);
      login(token, user);

      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "proprietaire" || user.role === "both") {
        router.push("/dashboard/proprietaire");
      } else {
        router.push("/dashboard/locataire");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#ebebeb" }}>
      {/* Simple Navbar */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black text-primary">Kre</span>
            <span className="text-xl font-black text-brand">li</span>
          </Link>
          <Link href="/catalogue" className="text-sm text-muted hover:text-ink transition-colors">
            Catalogue
          </Link>
        </div>
      </header>

      {/* Form card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <div className="text-center mb-8">
            <div
              className="mx-auto mb-4 h-14 w-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,78,152,0.1)" }}
            >
              <Lock className="h-6 w-6" style={{ color: "#004e98" }} />
            </div>
            <h1 className="font-display text-2xl font-black text-ink">Bon retour !</h1>
            <p className="mt-1.5 text-sm text-muted">
              Connectez-vous à votre compte Kreli
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@exemple.ma"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted-light transition"
                  onFocus={(e) => { e.target.style.borderColor = "#004e98"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-10 pr-10 text-sm text-ink outline-none placeholder:text-muted-light transition"
                  onFocus={(e) => { e.target.style.borderColor = "#004e98"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#ff6700" }}
            >
              {loading ? "Connexion..." : "Se connecter"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/auth/signup" className="font-bold text-brand hover:text-brand-dark">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>

      <div className="py-4 text-center text-xs text-muted">
        © 2024 Kreli. Tous droits réservés.
      </div>
    </div>
  );
}
