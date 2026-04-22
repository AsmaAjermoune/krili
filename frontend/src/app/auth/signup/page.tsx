"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight,
  HardHat, Wrench, Camera, X
} from "lucide-react";
import { registerUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Role = "proprietaire" | "locataire" | "both";

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<Role>("locataire");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [adresse, setAdresse] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhoto(result);
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhoto("");
    setPhotoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Le mot de passe doit contenir au moins une majuscule.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Le mot de passe doit contenir au moins un chiffre.");
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await registerUser({
        nom,
        email,
        password,
        role,
        telephone,
        adresse,
        photo: photo || undefined,
      });
      login(token, user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-9 pr-4 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] transition focus:border-[#004e98]";

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
      <div className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
          <div className="text-center mb-7">
            <h1 className="font-display text-2xl font-black text-ink">Rejoignez Kreli</h1>
            <p className="mt-1.5 text-sm text-muted">
              Louez du matériel professionnel en toute simplicité
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Photo upload */}
            <div>
              <p className="mb-2 text-sm font-bold text-[#0f172a]">Photo de profil</p>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#e2e8f0]">
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-[#e2e8f0] text-[#94a3b8] hover:border-[#004e98] hover:text-[#004e98]"
                  >
                    <Camera className="h-8 w-8" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <span className="text-sm text-[#64748b]">Cliquez pour ajouter une photo</span>
              </div>
            </div>

            {/* Role selection */}
            <div>
              <p className="mb-2 text-sm font-bold text-ink">Je souhaite être</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("proprietaire")}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition"
                  style={{
                    borderColor: role === "proprietaire" ? "#ff6700" : "#e2e8f0",
                    backgroundColor: role === "proprietaire" ? "rgba(255,103,0,0.05)" : "transparent",
                    color: role === "proprietaire" ? "#ff6700" : "#64748b",
                  }}
                >
                  <HardHat className="h-6 w-6" />
                  Propriétaire
                  <span className="text-[10px] font-normal text-muted">
                    Je propose du matériel à la location
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("locataire")}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition"
                  style={{
                    borderColor: role === "locataire" ? "#ff6700" : "#e2e8f0",
                    backgroundColor: role === "locataire" ? "rgba(255,103,0,0.05)" : "transparent",
                    color: role === "locataire" ? "#ff6700" : "#64748b",
                  }}
                >
                  <Wrench className="h-6 w-6" />
                  Locataire
                  <span className="text-[10px] font-normal text-muted">
                    Je recherche du matériel spécifique
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setRole("both")}
                className="mt-2 w-full rounded-xl border-2 py-2 text-sm font-semibold transition"
                style={{
                  borderColor: role === "both" ? "#ff6700" : "#e2e8f0",
                  backgroundColor: role === "both" ? "rgba(255,103,0,0.05)" : "transparent",
                  color: role === "both" ? "#ff6700" : "#64748b",
                }}
              >
                Les deux à la fois
              </button>
            </div>

            {/* Fields – row 1 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Meriem Abdou" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="06 12 34 56 78" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mail@exemple.ma" className={inputClass} />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Adresse de résidence</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="10 rue de la Mosquée" className={inputClass} />
              </div>
            </div>

            {/* Passwords row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Confirmer</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-9 pr-9 text-sm text-ink outline-none placeholder:text-muted-light transition"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#ff6700" }}
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="font-bold text-brand hover:text-brand-dark">
              Se connecter
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
