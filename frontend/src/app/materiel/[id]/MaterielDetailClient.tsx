"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Share2,
  Heart,
  CheckCircle,
  Lock,
  Star,
  Phone,
  MessageCircle,
  X,
  Calendar,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice, createLocation, type Materiel } from "@/lib/api";

interface MaterielDetailProps {
  materiel: Materiel;
  similar: Materiel[];
}

function buildImgUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/${url}`;
}

function getFirstPhoto(m: Materiel): string | null {
  if (m.photos && m.photos.length > 0) return buildImgUrl(m.photos[0].url);
  return null;
}

function getEtatLabel(etat?: string) {
  const labels: Record<string, string> = {
    neuf: "Neuf",
    bon_etat: "Bon état",
    usage: "Occasion",
  };
  return etat ? labels[etat] : null;
}

export default function MaterielDetailClient({
  materiel,
  similar,
}: MaterielDetailProps) {
  const router = useRouter();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);

  const photos = materiel.photos || [];
  const mainPhoto =
    photos.length > 0 ? buildImgUrl(photos[selectedPhotoIndex]?.url) : null;
  const categorieNom =
    typeof materiel.categorieId === "object" ? materiel.categorieId?.nom : "";
  const proprietaire =
    typeof materiel.proprietaireId === "object"
      ? materiel.proprietaireId
      : null;
  const etatLabel = getEtatLabel(materiel.etat);

  const days =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
  const rentalCost = days > 0 ? days * materiel.prixParJour : 0;
  const serviceFee = 25;
  const total = rentalCost + serviceFee;

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleReserve = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("kreli_token")
        : null;
    if (!token) {
      router.push(`/auth/login?redirect=/materiel/${materiel._id}`);
      return;
    }
    if (!startDate || !endDate) {
      setIsReservationOpen(true);
      return;
    }
    setReservationError(null);
    setIsReservationOpen(true);
  };

  const handleConfirmReservation = async () => {
    if (!startDate || !endDate) {
      setReservationError(
        "Veuillez sélectionner les dates de début et de fin.",
      );
      return;
    }
    setReservationLoading(true);
    setReservationError(null);
    try {
      await createLocation({
        materielId: materiel._id,
        dateDebut: startDate,
        dateFinPrevue: endDate,
      });
      setIsReservationOpen(false);
      router.push("/dashboard/locataire?tab=locations");
    } catch (err: unknown) {
      setReservationError(
        err instanceof Error ? err.message : "Erreur lors de la réservation",
      );
    } finally {
      setReservationLoading(false);
    }
  };

  const handleContact = () => {
    setIsContactOpen(true);
  };

  const handleSendMessage = () => {
    alert("Message envoyé au propriétaire!");
    setIsContactOpen(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-muted hover:text-brand">
            Accueil
          </Link>
          <span className="text-muted">/</span>
          <Link href="/catalogue" className="text-muted hover:text-brand">
            Catalogue
          </Link>
          <span className="text-muted">/</span>
          <span className="font-medium text-ink">{materiel.nom}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column */}
          <div>
            {/* Gallery */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-white shadow-sm">
              {mainPhoto ? (
                <Image
                  src={mainPhoto}
                  alt={materiel.nom}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <span className="text-muted">Pas d&apos;image</span>
                </div>
              )}
              <button className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors">
                <Heart className="h-5 w-5 text-muted hover:text-red-500" />
              </button>
              <button className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors">
                <Share2 className="h-5 w-5 text-muted" />
              </button>
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhotoIndex(i)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl transition-all ${selectedPhotoIndex === i ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"}`}
                  >
                    <Image
                      src={buildImgUrl(p.url)}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title + Badges */}
            <div className="mt-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-ink leading-tight">
                    {materiel.nom}
                  </h1>
                  {categorieNom && (
                    <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20">
                      {categorieNom}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted">
                  <MapPin className="h-4 w-4 text-brand" />
                  {materiel.localisation || "Maroc"}
                </span>
                {etatLabel && (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {etatLabel}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Vérifié
                </span>
              </div>
            </div>

            {/* Description */}
            {materiel.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-ink mb-4">Description</h2>
                <p className="text-muted leading-relaxed whitespace-pre-line">
                  {materiel.description}
                </p>
              </div>
            )}

            {/* Caractéristiques */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink mb-4">
                Caractéristiques
              </h2>
              <Card>
                <CardContent className="p-0">
                  {[
                    { label: "Catégorie", value: categorieNom },
                    { label: "État", value: etatLabel },
                    { label: "Localisation", value: materiel.localisation },
                    {
                      label: "Disponibilité",
                      value: materiel.disponible
                        ? "Disponible"
                        : "Indisponible",
                    },
                  ]
                    .filter((r) => r.value)
                    .map((row, i) => (
                      <div
                        key={row.label}
                        className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <span className="text-muted">{row.label}</span>
                        <span className="font-semibold text-ink">
                          {row.value}
                        </span>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            {/* Localisation Map */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink mb-4">Localisation</h2>
              <div className="h-48 rounded-2xl bg-gray-200 flex flex-col items-center justify-center text-muted">
                <MapPin className="h-10 w-10 mb-2 text-primary" />
                <p className="text-sm font-medium">
                  {materiel.localisation || "Maroc"}
                </p>
                <p className="text-xs mt-1">Voir sur la carte</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-black text-brand">
                      {formatPrice(materiel.prixParJour)}
                    </span>
                    <span className="text-sm text-muted ml-1">/jour</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/30"
                  >
                    Pro
                  </Badge>
                </div>

                {/* Date Pickers */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs font-bold text-muted uppercase tracking-wide mb-2 block">
                      Début
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={getMinDate()}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-muted uppercase tracking-wide mb-2 block">
                      Fin
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || getMinDate()}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                {days > 0 && (
                  <div className="space-y-2 border-t pt-4 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">
                        {formatPrice(materiel.prixParJour)} x {days} jour
                        {days > 1 ? "s" : ""}
                      </span>
                      <span className="font-medium text-ink">
                        {formatPrice(rentalCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Frais de service</span>
                      <span className="font-medium text-ink">
                        {formatPrice(serviceFee)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span className="text-ink">Total</span>
                      <span className="text-brand text-lg">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Caution Warning */}
                {materiel.caution && materiel.caution > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-sm text-amber-800 mb-4">
                    <Lock className="h-4 w-4 shrink-0" />
                    Caution : {formatPrice(materiel.caution)} (non débité)
                  </div>
                )}

                {/* Reserve Button */}
                <Button
                  onClick={handleReserve}
                  className="w-full h-12 text-base font-bold bg-brand hover:bg-brand-dark transition-colors"
                >
                  Réserver maintenant
                </Button>

                {/* Contact Button */}
                <Button
                  variant="outline"
                  onClick={handleContact}
                  className="w-full mt-3 border-gray-300 hover:border-brand hover:text-brand"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contacter le propriétaire
                </Button>

                {/* Owner Info */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs font-bold text-muted uppercase tracking-wide mb-4">
                    Propriétaire
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {proprietaire?.photo ? (
                        <Image
                          src={proprietaire.photo}
                          alt={proprietaire.nom}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        proprietaire?.nom?.charAt(0).toUpperCase() || "?"
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-ink">
                        {proprietaire?.nom || "Propriétaire"}
                      </p>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-brand text-brand" />
                        <span className="font-semibold text-brand">4.9</span>
                        <span className="text-muted">(24 avis)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Materials */}
        {similar.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-ink">
                Matériel similaire
              </h2>
              <Link
                href="/catalogue"
                className="text-sm font-bold text-brand hover:text-brand-dark"
              >
                Voir tout
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((m) => {
                const imgUrl = getFirstPhoto(m);
                const catNom =
                  typeof m.categorieId === "object" ? m.categorieId?.nom : "";
                return (
                  <Link
                    key={m._id}
                    href={`/materiel/${m._id}`}
                    className="group rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-44 bg-gray-100">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={m.nom}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          sizes="300px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted">
                          Pas d&apos;image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {catNom && (
                        <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1">
                          {catNom}
                        </p>
                      )}
                      <p className="font-bold text-ink text-sm line-clamp-1">
                        {m.nom}
                      </p>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-base font-black text-brand">
                          {formatPrice(m.prixParJour)}
                        </span>
                        <span className="text-xs text-muted">/jour</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Reservation Modal */}
      <Dialog
        open={isReservationOpen}
        onOpenChange={(open) => {
          if (!reservationLoading) {
            setIsReservationOpen(open);
            setReservationError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la réservation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {(!startDate || !endDate) && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Veuillez sélectionner les dates de début et de fin avant de
                confirmer.
              </p>
            )}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-bold text-ink mb-2">{materiel.nom}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Période</span>
                <span className="font-medium">
                  {startDate || "—"} → {endDate || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted">Durée</span>
                <span className="font-medium">
                  {days > 0 ? `${days} jour${days > 1 ? "s" : ""}` : "—"}
                </span>
              </div>
            </div>
            {days > 0 && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">
                    Location ({formatPrice(materiel.prixParJour)} x {days}j)
                  </span>
                  <span className="font-medium">{formatPrice(rentalCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Frais de service</span>
                  <span className="font-medium">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-brand">{formatPrice(total)}</span>
                </div>
              </div>
            )}
            {materiel.caution && materiel.caution > 0 && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                Caution requise : {formatPrice(materiel.caution)}
              </div>
            )}
            {reservationError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {reservationError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReservationOpen(false)}
              disabled={reservationLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmReservation}
              disabled={reservationLoading || !startDate || !endDate}
              className="bg-brand hover:bg-brand-dark"
            >
              {reservationLoading
                ? "Envoi en cours…"
                : "Confirmer la réservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Contacter {proprietaire?.nom || "le propriétaire"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Votre message</Label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Bonjour, je suis intéressé par la location de ${materiel.nom}. Pouvez-vous me donner plus d'informations ?`}
              className="w-full min-h-[120px] rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-brand hover:bg-brand-dark"
            >
              Envoyer le message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
