"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getMyProfile, updateMyProfile, type AuthUser } from "@/lib/api";
import { User, Mail, Phone, MapPin, Save, ArrowLeft } from "lucide-react";

export default function LocataireProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    adresse: "",
  });

  useEffect(() => {
    if (authLoading) return;
    loadProfile();
  }, [authLoading]);

  async function loadProfile() {
    try {
      const data = await getMyProfile();
      setProfile(data);
      setForm({
        nom: data.nom || "",
        telephone: data.telephone || "",
        adresse: data.adresse || "",
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      localStorage.setItem("kreli_user", JSON.stringify(updated));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6700] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard/locataire"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#0f172a]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-8 font-display text-2xl font-black text-[#0f172a]">
            Mon profil
          </h1>

          {/* Avatar section */}
          <div className="mb-8 flex items-center gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[#004e98]">
              {profile?.photo ? (
                <Image src={profile.photo} alt={profile.nom} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-[#0f172a]">{profile?.nom}</p>
              <p className="text-sm text-[#64748b]">{profile?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-[#004e98]/10 px-3 py-1 text-xs font-bold text-[#004e98]">
                {profile?.role === "locataire" ? "Locataire" : profile?.role === "proprietaire" ? "Propriétaire" : "Locataire & Propriétaire"}
              </span>
            </div>
          </div>

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Profil mis à jour avec succès !
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0f172a]">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-9 pr-4 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] transition focus:border-[#004e98]"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0f172a]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] py-3 pl-9 pr-4 text-sm text-[#64748b]"
                />
              </div>
              <p className="mt-1 text-xs text-[#94a3b8]">L'email ne peut pas être modifié</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0f172a]">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-9 pr-4 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] transition focus:border-[#004e98]"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0f172a]">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={form.adresse}
                  onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-9 pr-4 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] transition focus:border-[#004e98]"
                  placeholder="Votre adresse"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6700] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              {!saving && <Save className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
