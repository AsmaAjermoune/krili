"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMateriel, getCategories, updateMateriel, type Category, type Materiel } from "@/lib/api";
import { ArrowLeft, Save, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

export default function EditMaterielPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    description: "",
    categorieId: "",
    prixParJour: "",
    caution: "",
    localisation: "",
    etat: "bon_etat" as "neuf" | "bon_etat" | "usage",
    disponible: true,
    photos: [] as string[],
  });
  const [photoInput, setPhotoInput] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.role !== "proprietaire" && user.role !== "both" && user.role !== "admin")) {
      router.push("/auth/login");
      return;
    }
    Promise.all([getMateriel(id), getCategories()])
      .then(([mat, cats]) => {
        setCategories(cats);
        setForm({
          nom: mat.nom ?? "",
          description: mat.description ?? "",
          categorieId: typeof mat.categorieId === "object" ? mat.categorieId._id : (mat.categorieId ?? ""),
          prixParJour: String(mat.prixParJour ?? ""),
          caution: String(mat.caution ?? ""),
          localisation: mat.localisation ?? "",
          etat: (mat.etat as "neuf" | "bon_etat" | "usage") ?? "bon_etat",
          disponible: mat.disponible ?? true,
          photos: mat.photos?.map((p) => p.url) ?? [],
        });
      })
      .catch(() => setError("Impossible de charger le matériel"))
      .finally(() => setLoading(false));
  }, [authLoading, user, id]);

  function addPhoto() {
    if (photoInput.trim()) {
      setForm({ ...form, photos: [...form.photos, photoInput.trim()] });
      setPhotoInput("");
    }
  }

  function removePhoto(i: number) {
    setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await updateMateriel(id, {
        nom: form.nom,
        description: form.description,
        categorieId: form.categorieId as unknown as { _id: string; nom: string },
        prixParJour: Number(form.prixParJour),
        caution: Number(form.caution) || 0,
        localisation: form.localisation,
        etat: form.etat,
        disponible: form.disponible,
        photos: form.photos.map((url) => ({ url })),
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/proprietaire/materiels"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#ff6700] border-t-transparent" />
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-[#0f172a] outline-none placeholder:text-slate-400 transition focus:border-[#004e98] focus:bg-white focus:ring-2 focus:ring-[#004e98]/10";

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 lg:px-8 lg:py-8">
      <Link href="/dashboard/proprietaire/materiels"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#004e98]">
        <ArrowLeft className="h-4 w-4" /> Retour à mes matériels
      </Link>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <h1 className="mb-6 text-2xl font-black text-[#0f172a]">Modifier le matériel</h1>

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-700">Matériel mis à jour ! Redirection...</p>
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">Nom du matériel <span className="text-red-500">*</span></label>
            <input type="text" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className={inputCls} placeholder="Ex: Perceuse à percussion" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">Catégorie <span className="text-red-500">*</span></label>
            <select required value={form.categorieId} onChange={(e) => setForm({ ...form, categorieId: e.target.value })} className={inputCls}>
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.nom}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">Prix/jour (DH) <span className="text-red-500">*</span></label>
              <input type="number" required min="0" value={form.prixParJour} onChange={(e) => setForm({ ...form, prixParJour: e.target.value })} className={inputCls} placeholder="100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">Caution (DH)</label>
              <input type="number" min="0" value={form.caution} onChange={(e) => setForm({ ...form, caution: e.target.value })} className={inputCls} placeholder="0" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">État</label>
            <div className="flex gap-4">
              {[{ value: "neuf", label: "Neuf" }, { value: "bon_etat", label: "Bon état" }, { value: "usage", label: "Usagé" }].map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="etat" value={opt.value} checked={form.etat === opt.value}
                    onChange={(e) => setForm({ ...form, etat: e.target.value as "neuf" | "bon_etat" | "usage" })}
                    className="h-4 w-4 text-[#ff6700]" />
                  <span className="text-sm text-[#0f172a]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">Localisation</label>
            <input type="text" value={form.localisation} onChange={(e) => setForm({ ...form, localisation: e.target.value })} className={inputCls} placeholder="Ex: Casablanca, Maarif" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} placeholder="Décrivez votre matériel..." />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">Disponibilité</label>
            <label className="flex cursor-pointer items-center gap-3">
              <div className={`relative h-6 w-11 rounded-full transition-colors ${form.disponible ? "bg-[#004e98]" : "bg-slate-300"}`}
                onClick={() => setForm({ ...form, disponible: !form.disponible })}>
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.disponible ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-slate-600">{form.disponible ? "Disponible à la location" : "Indisponible"}</span>
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">Photos (URLs)</label>
            <div className="flex gap-2">
              <input type="url" value={photoInput} onChange={(e) => setPhotoInput(e.target.value)}
                placeholder="https://..." className={inputCls} />
              <button type="button" onClick={addPhoto}
                className="shrink-0 rounded-xl bg-[#004e98] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#003a72]">
                Ajouter
              </button>
            </div>
            {form.photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.photos.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
                    <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="max-w-[160px] truncate text-[#0f172a]">{url}</span>
                    <button type="button" onClick={() => removePhoto(i)} className="text-red-400 hover:text-red-600">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:opacity-60 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,#ff6700,#ff8c38)", boxShadow: "0 4px 14px rgba(255,103,0,0.25)" }}>
            {saving ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Enregistrement...</>
            ) : (
              <><Save className="h-4 w-4" />Enregistrer les modifications</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
