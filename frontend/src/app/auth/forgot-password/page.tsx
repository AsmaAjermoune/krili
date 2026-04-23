"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight, KeyRound, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";

type Step = "email" | "code" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur lors de l'envoi");
      }
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi de l'email");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, newPassword }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Code invalide ou expiré");
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-10 pr-4 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] transition focus:border-[#004e98]";

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

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">

          {/* Step: done */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
              >
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="font-display text-2xl font-black text-ink">Mot de passe réinitialisé !</h1>
              <p className="text-sm text-muted">
                Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
              </p>
              <Link
                href="/auth/login"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
                style={{ backgroundColor: "#ff6700" }}
              >
                Se connecter <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Step: email */}
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div
                  className="mx-auto mb-4 h-14 w-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,78,152,0.1)" }}
                >
                  <KeyRound className="h-6 w-6" style={{ color: "#004e98" }} />
                </div>
                <h1 className="font-display text-2xl font-black text-ink">Mot de passe oublié ?</h1>
                <p className="mt-1.5 text-sm text-muted">
                  Entrez votre email pour recevoir un code de réinitialisation.
                </p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mail@exemple.ma"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors disabled:opacity-60"
                  style={{ backgroundColor: "#ff6700" }}
                >
                  {loading ? "Envoi en cours..." : "Envoyer le code"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            </>
          )}

          {/* Step: code + new password */}
          {step === "code" && (
            <>
              <div className="text-center mb-8">
                <div
                  className="mx-auto mb-4 h-14 w-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,103,0,0.1)" }}
                >
                  <Lock className="h-6 w-6" style={{ color: "#ff6700" }} />
                </div>
                <h1 className="font-display text-2xl font-black text-ink">Vérification</h1>
                <p className="mt-1.5 text-sm text-muted">
                  Un code a été envoyé à <strong>{email}</strong>. Entrez-le ci-dessous.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Code de vérification</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-10 pr-10 text-sm text-ink outline-none placeholder:text-muted-light transition focus:border-[#004e98]"
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
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors disabled:opacity-60"
                  style={{ backgroundColor: "#ff6700" }}
                >
                  {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <button
                onClick={() => { setStep("email"); setError(""); }}
                className="mt-4 w-full text-center text-sm text-muted hover:text-ink"
              >
                ← Changer d&apos;email
              </button>
            </>
          )}

          {step !== "done" && (
            <p className="mt-6 text-center text-sm text-muted">
              <Link href="/auth/login" className="font-bold text-primary hover:underline">
                ← Retour à la connexion
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="py-4 text-center text-xs text-muted">
        © 2024 Kreli. Tous droits réservés.
      </div>
    </div>
  );
}
