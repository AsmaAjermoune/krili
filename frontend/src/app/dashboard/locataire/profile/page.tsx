"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getMyProfile, updateMyProfile, changePassword, getLocataireStats, uploadMaterielImage, type AuthUser } from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Camera,
  CheckCircle,
  AlertCircle,
  Package,
  Wallet,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const ITEM = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function StatChip({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-base font-black dark:text-white" style={{ color: "#0f172a" }}>{value}</p>
      </div>
    </div>
  );
}

export default function LocataireProfilePage() {
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<{ locations: { total: number }; totalDepenses: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ nom: "", telephone: "", adresse: "" });

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    Promise.all([getMyProfile(), getLocataireStats()])
      .then(([data, st]) => {
        setProfile(data);
        setStats(st);
        setForm({ nom: data.nom || "", telephone: data.telephone || "", adresse: data.adresse || "" });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      updateUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      setPwError("Les mots de passe ne correspondent pas");
      return;
    }
    setPwSaving(true);
    setPwError("");
    setPwSuccess(false);
    try {
      await changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwSuccess(true);
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setPwSaving(false);
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadMaterielImage(file);
      const updated = await updateMyProfile({ photo: url });
      setProfile(updated);
      updateUser(updated);
    } catch {}
  }

  const initials = profile?.nom
    ? profile.nom.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.nom?.charAt(0).toUpperCase() ?? "U";

  const roleBadge =
    profile?.role === "both"
      ? "Locataire & Propriétaire"
      : profile?.role === "locataire"
      ? "Locataire"
      : "Propriétaire";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("fr-MA", { month: "long", year: "numeric" })
    : "—";

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#ff6700] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl shadow-sm border border-slate-100"
        >
          {/* Gradient banner */}
          <div
            className="h-28"
            style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#004e98 100%)" }}
          >
            <div
              className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#ff6700,transparent 70%)" }}
            />
          </div>

          <div className="relative bg-white px-8 pb-7">
            {/* Avatar */}
            <div className="absolute -top-12 flex items-end gap-4">
              <div className="relative">
                <div
                  className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white shadow-lg text-3xl font-black text-white"
                  style={{ background: "linear-gradient(135deg,#004e98,#0066cc)" }}
                >
                  {profile?.photo ? (
                    <Image src={profile.photo} alt={profile.nom} fill className="object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#ff6700] text-white shadow-md transition-transform hover:scale-110"
                  title="Modifier la photo"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Info row */}
            <div className="pt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[#0f172a] dark:text-white">{profile?.nom}</h1>
                  <p className="mt-0.5 text-sm text-slate-400">{profile?.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#004e98]/10 px-3 py-1 text-xs font-bold text-[#004e98]">
                      {roleBadge}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                      Compte vérifié
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Membre depuis {memberSince}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        {stats && (
          <motion.div
            variants={STAGGER}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            <motion.div variants={ITEM}>
              <StatChip
                icon={Package}
                label="Locations totales"
                value={String(stats.locations.total)}
                color="#004e98"
                bg="rgba(0,78,152,0.08)"
              />
            </motion.div>
            <motion.div variants={ITEM}>
              <StatChip
                icon={Wallet}
                label="Total dépensé"
                value={`${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(stats.totalDepenses)} MAD`}
                color="#ff6700"
                bg="rgba(255,103,0,0.08)"
              />
            </motion.div>
            <motion.div variants={ITEM} className="col-span-2 sm:col-span-1">
              <StatChip
                icon={Shield}
                label="Statut du compte"
                value={profile?.statut === "actif" ? "Actif" : "Inactif"}
                color="#22c55e"
                bg="#f0fdf4"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Edit form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
              <User className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h2 className="font-bold text-[#0f172a] dark:text-white">Informations personnelles</h2>
              <p className="text-xs text-slate-400">Modifiez vos informations de profil</p>
            </div>
          </div>

          {success && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700">Profil mis à jour avec succès !</p>
            </div>
          )}
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0f172a] dark:text-white">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-3 pl-10 pr-4 text-sm text-[#0f172a] dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-[#004e98] focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#004e98]/10"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0f172a] dark:text-white">
                Email
                <span className="ml-2 text-xs font-normal text-slate-400">(non modifiable)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm text-slate-400"
                />
              </div>
            </div>

            {/* Téléphone + Adresse in grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0f172a] dark:text-white">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-3 pl-10 pr-4 text-sm text-[#0f172a] dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-[#004e98] focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#004e98]/10"
                    placeholder="+212 6 00 00 00 00"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0f172a] dark:text-white">Adresse</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.adresse}
                    onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-3 pl-10 pr-4 text-sm text-[#0f172a] dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-[#004e98] focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#004e98]/10"
                    placeholder="Votre adresse"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:opacity-60 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg,#ff6700,#ff8c38)",
                boxShadow: "0 4px 14px rgba(255,103,0,0.25)",
              }}
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Security section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
              <Shield className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h2 className="font-bold text-[#0f172a] dark:text-white">Sécurité</h2>
              <p className="text-xs text-slate-400">Modifiez votre mot de passe</p>
            </div>
          </div>

          {pwSuccess && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700">Mot de passe mis à jour !</p>
            </div>
          )}
          {pwError && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm font-medium text-red-700">{pwError}</p>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0f172a] dark:text-white">Mot de passe actuel</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-[#f8fafc] dark:bg-slate-700 py-3 pl-10 pr-10 text-sm text-[#0f172a] dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-[#004e98] focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#004e98]/10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3.5 top-1/2 -translate-y-1/2" tabIndex={-1}>
                  {showCurrent ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0f172a] dark:text-white">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNext ? "text" : "password"}
                  required
                  value={pwForm.next}
                  onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-[#f8fafc] dark:bg-slate-700 py-3 pl-10 pr-10 text-sm text-[#0f172a] dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-[#004e98] focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#004e98]/10"
                  placeholder="Min. 8 car., 1 majuscule, 1 chiffre"
                />
                <button type="button" onClick={() => setShowNext(!showNext)} className="absolute right-3.5 top-1/2 -translate-y-1/2" tabIndex={-1}>
                  {showNext ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0f172a] dark:text-white">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-[#f8fafc] dark:bg-slate-700 py-3 pl-10 pr-4 text-sm text-[#0f172a] dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus:border-[#004e98] focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#004e98]/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pwSaving}
              className="flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-60 hover:text-white"
              style={{ borderColor: "#004e98", color: "#004e98" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#004e98"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = ""; (e.currentTarget as HTMLButtonElement).style.color = "#004e98"; }}
            >
              {pwSaving ? (
                <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />Mise à jour…</>
              ) : (
                <><Lock className="h-3.5 w-3.5" />Mettre à jour le mot de passe</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-red-50 border border-red-200 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-red-800">Zone de danger</h2>
              <p className="mt-1 text-xs text-red-600">La suppression de votre compte est irréversible. Toutes vos données seront perdues.</p>
            </div>
            <button
              className="shrink-0 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              onClick={() => alert("Fonctionnalité disponible prochainement.")}
            >
              Supprimer mon compte
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
