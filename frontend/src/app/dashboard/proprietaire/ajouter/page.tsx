"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getCategories, createMateriel, uploadMaterielImage, type Category } from "@/lib/api";
import { ArrowLeft, ImageIcon, X, Package, CheckCircle, AlertCircle, Upload } from "lucide-react";

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const ITEM = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const ETAT_OPTIONS = [
  { value: "neuf",     label: "Neuf",     bg: "#DDEEDF", color: "#1A6B3F", border: "#1A6B3F" },
  { value: "bon_etat", label: "Bon état", bg: "#DDEEFF", color: "#1A4B8F", border: "#1A4B8F" },
  { value: "usage",    label: "Usagé",    bg: "#FAEBC1", color: "#B27200", border: "#B27200" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 12,
  border: "1px solid var(--lm-line)", background: "var(--lm-bone)",
  fontSize: 14, color: "var(--lm-ink)", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box", transition: "border-color .15s",
};

export default function AjouterMaterielPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    description: "",
    categorieId: "",
    prixParJour: "",
    caution: "",
    localisation: "",
    etat: "bon_etat" as "neuf" | "bon_etat" | "usage",
  });

  const [photos, setPhotos] = useState<{ url: string; preview: string }[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.role !== "proprietaire" && user.role !== "both" && user.role !== "admin")) {
      router.push("/auth/login");
      return;
    }
    getCategories().then(setCategories).catch(() => {}).finally(() => setLoading(false));
  }, [authLoading, user, router]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = 6 - photos.length;
    const toProcess = Array.from(files).slice(0, remaining);

    for (const file of toProcess) {
      if (!file.type.startsWith("image/")) continue;
      const preview = URL.createObjectURL(file);
      const idx = photos.length;
      setPhotos((prev) => [...prev, { url: "", preview }]);
      setUploadingIdx(idx);
      try {
        const url = await uploadMaterielImage(file);
        setPhotos((prev) => prev.map((p, i) => (i === idx ? { url, preview } : p)));
      } catch {
        setPhotos((prev) => prev.filter((_, i) => i !== idx));
        setError("Erreur lors de l'upload d'une photo");
      }
      setUploadingIdx(null);
    }
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      URL.revokeObjectURL(prev[idx].preview);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.categorieId) return setError("Veuillez sélectionner une catégorie");
    if (photos.some((p) => !p.url)) return setError("Attendez que les photos finissent de s'uploader");

    setSaving(true);
    try {
      await createMateriel({
        nom: form.nom,
        description: form.description,
        categorieId: form.categorieId,
        prixParJour: Number(form.prixParJour),
        caution: Number(form.caution) || 0,
        localisation: form.localisation,
        etat: form.etat,
        photos: photos.map((p) => ({ url: p.url })),
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/proprietaire/materiels"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{ display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(10,10,9,0.08)", borderTopColor: "#FF4D00", animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 48px", maxWidth: 720, margin: "0 auto" }}>
      <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-6">

        {/* Back */}
        <motion.div variants={ITEM}>
          <Link href="/dashboard/proprietaire/materiels" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--lm-mid)", textDecoration: "none" }}>
            <ArrowLeft size={14} />
            Retour à mes matériels
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={ITEM} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,77,0,0.08)", display: "grid", placeItems: "center" }}>
            <Package size={24} style={{ color: "#FF4D00" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--lm-f-display,'Inter Tight',sans-serif)", fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--lm-ink)", margin: 0 }}>
              Ajouter un matériel
            </h1>
            <p className="lm-eyebrow" style={{ marginTop: 4 }}>Renseignez les informations de votre équipement</p>
          </div>
        </motion.div>

        {/* Banners */}
        {success && (
          <motion.div variants={ITEM} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 14, border: "1px solid #BBF7D0", background: "#F0FDF4", padding: "12px 16px", fontSize: 13, color: "#15803D" }}>
            <CheckCircle size={16} />
            Matériel créé avec succès ! Redirection en cours…
          </motion.div>
        )}
        {error && (
          <motion.div variants={ITEM} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 14, border: "1px solid #FECACA", background: "#FEF2F2", padding: "12px 16px", fontSize: 13, color: "#B0241A" }}>
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        <motion.div variants={ITEM} style={{ borderRadius: 28, border: "1px solid var(--lm-line)", background: "var(--lm-surface-card)", padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Nom */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--lm-ink)", marginBottom: 8 }}>
                Nom du matériel <span style={{ color: "#FF4D00" }}>*</span>
              </label>
              <input
                required
                type="text"
                style={inputStyle}
                placeholder="Ex: Perceuse à percussion Makita 800W"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
            </div>

            {/* Catégorie */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--lm-ink)", marginBottom: 8 }}>
                Catégorie <span style={{ color: "#FF4D00" }}>*</span>
              </label>
              <select
                required
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.categorieId}
                onChange={(e) => setForm({ ...form, categorieId: e.target.value })}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.nom}</option>
                ))}
              </select>
            </div>

            {/* Prix + Caution */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--lm-ink)", marginBottom: 8 }}>
                  Prix/jour (DH) <span style={{ color: "#FF4D00" }}>*</span>
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  style={inputStyle}
                  placeholder="150"
                  value={form.prixParJour}
                  onChange={(e) => setForm({ ...form, prixParJour: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--lm-ink)", marginBottom: 8 }}>Caution (DH)</label>
                <input
                  type="number"
                  min="0"
                  style={inputStyle}
                  placeholder="500"
                  value={form.caution}
                  onChange={(e) => setForm({ ...form, caution: e.target.value })}
                />
              </div>
            </div>

            {/* État */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--lm-ink)", marginBottom: 10 }}>État du matériel</label>
              <div style={{ display: "flex", gap: 10 }}>
                {ETAT_OPTIONS.map((opt) => {
                  const active = form.etat === opt.value;
                  return (
                    <label
                      key={opt.value}
                      style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "10px 0", borderRadius: 12, cursor: "pointer",
                        border: `2px solid ${active ? opt.border : "rgba(10,10,9,0.1)"}`,
                        background: active ? opt.bg : "transparent",
                        color: active ? opt.color : "#6B6B6B",
                        fontSize: 13, fontWeight: 700, transition: "all .15s",
                      }}
                    >
                      <input type="radio" name="etat" value={opt.value} checked={active} onChange={() => setForm({ ...form, etat: opt.value as "neuf" | "bon_etat" | "usage" })} style={{ display: "none" }} />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Localisation */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--lm-ink)", marginBottom: 8 }}>Localisation</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Ex: Agadir, Centre-ville"
                value={form.localisation}
                onChange={(e) => setForm({ ...form, localisation: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--lm-ink)", marginBottom: 8 }}>Description</label>
              <textarea
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Décrivez votre matériel, ses caractéristiques, les conditions de location…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Photos upload */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--lm-ink)", marginBottom: 8 }}>
                Photos <span style={{ fontWeight: 400, color: "#A8A8A6" }}>(max 6 · JPG, PNG, WebP)</span>
              </label>

              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                style={{
                  border: `2px dashed ${dragOver ? "#FF4D00" : "var(--lm-line)"}`,
                  borderRadius: 16,
                  background: dragOver ? "rgba(255,77,0,0.03)" : "var(--lm-bone)",
                  padding: "28px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  transition: "border-color .15s, background .15s",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--lm-hover)", display: "grid", placeItems: "center" }}>
                  <Upload size={20} style={{ color: "var(--lm-mid)" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--lm-ink)", margin: 0 }}>Cliquez ou glissez vos photos ici</p>
                  <p style={{ fontSize: 12, color: "#A8A8A6", margin: "4px 0 0" }}>
                    {photos.length}/6 photo{photos.length !== 1 ? "s" : ""} ajoutée{photos.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {/* Preview grid */}
              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: "relative", paddingBottom: "75%", borderRadius: 12, overflow: "hidden", background: "rgba(10,10,9,0.05)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.preview}
                        alt=""
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {uploadingIdx === i && (
                        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(10,10,9,0.4)" }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#FFFFFF", animation: "spin 0.7s linear infinite" }} />
                        </div>
                      )}
                      {!p.url && uploadingIdx !== i && (
                        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(239,68,68,0.4)" }}>
                          <AlertCircle size={20} style={{ color: "#FFFFFF" }} />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", border: "none", background: "rgba(10,10,9,0.6)", color: "#FFFFFF", display: "grid", placeItems: "center", cursor: "pointer" }}
                      >
                        <X size={12} />
                      </button>
                      {i === 0 && (
                        <div style={{ position: "absolute", bottom: 6, left: 6, borderRadius: 6, background: "rgba(10,10,9,0.6)", padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                          Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving || success}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 14,
                border: "none",
                background: saving || success ? "var(--lm-line)" : "#FF4D00",
                color: saving || success ? "var(--lm-muted)" : "#FFFFFF",
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                cursor: saving || success ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {saving ? (
                <>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(10,10,9,0.2)", borderTopColor: "#0A0A09", animation: "spin 0.7s linear infinite" }} />
                  Création en cours…
                </>
              ) : (
                <>
                  <ImageIcon size={16} />
                  Publier le matériel
                </>
              )}
            </button>

          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
