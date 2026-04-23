import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Package,
  Star,
  Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "À propos — Kreli",
  description:
    "Découvrez l'histoire, la mission et l'équipe derrière Kreli, la plateforme marocaine de location professionnelle.",
};

const TEAM = [
  { name: "Sina", role: "Full-Stack Developer", initials: "SI" },
  { name: "Ahmed", role: "Full-Stack Developer", initials: "AH" },
  { name: "Meriem", role: "Full-Stack Developer", initials: "ME" },
  { name: "Asma", role: "Full-Stack Developer", initials: "AS" },
  { name: "Sara", role: "Full-Stack Developer", initials: "SA" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Confiance",
    desc: "Chaque propriétaire et locataire est vérifié. Vos transactions sont sécurisées et transparentes.",
  },
  {
    icon: Package,
    title: "Accessibilité",
    desc: "Des milliers de matériels disponibles partout au Maroc, accessibles en quelques clics.",
  },
  {
    icon: Star,
    title: "Excellence",
    desc: "Nous sélectionnons uniquement du matériel de haute performance pour garantir votre satisfaction.",
  },
];

const STATS = [
  { value: "5 000+", label: "Articles disponibles" },
  { value: "12 000+", label: "Contrats conclus" },
  { value: "98 %", label: "Clients satisfaits" },
  { value: "20+", label: "Villes couvertes" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        className="relative flex min-h-[420px] items-center overflow-hidden"
        style={{ backgroundColor: "#004e98" }}
      >
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1024px] flex-col items-center gap-6 px-4 py-24 text-center">
          <h1
            className="font-display font-black text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: "1.1" }}
          >
            À propos de <span style={{ color: "#ff6700" }}>Kreli</span>
          </h1>
          <p
            className="max-w-[640px] text-[18px] font-light leading-[30px]"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            La plateforme marocaine de référence pour la location de matériels
            professionnels entre particuliers et entreprises.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[#f1f5f9] bg-white py-14">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span
                className="text-[42px] font-black leading-none"
                style={{ color: "#ff6700" }}
              >
                {s.value}
              </span>
              <span
                className="text-[14px] font-semibold"
                style={{ color: "#64748b" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="mx-auto max-w-[1024px] px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <span
                  className="text-[13px] font-black uppercase tracking-[2px]"
                  style={{ color: "#ff6700" }}
                >
                  Notre mission
                </span>
                <h2
                  className="font-display text-[32px] font-black leading-tight"
                  style={{ color: "#0f172a" }}
                >
                  Rendre la location professionnelle accessible à tous
                </h2>
              </div>
              <p
                className="text-[16px] leading-[28px]"
                style={{ color: "#475569" }}
              >
                Kreli connecte les propriétaires de matériels professionnels
                avec ceux qui en ont besoin, sans les contraintes d'un achat
                coûteux. Que vous soyez artisan, entrepreneur ou particulier,
                trouvez l'équipement qu'il vous faut, quand vous en avez besoin.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Matériels vérifiés et certifiés",
                  "Processus de réservation simplifié",
                  "Assistance client 7j/7",
                  "Paiement sécurisé",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle
                      className="h-5 w-5 shrink-0"
                      style={{ color: "#ff6700" }}
                    />
                    <span className="text-[15px]" style={{ color: "#334155" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/catalogue"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-[24px] px-6 py-3.5 text-[15px] font-black text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#ff6700" }}
              >
                Voir le catalogue <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-[24px] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"
                alt="Matériel professionnel"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,78,152,0.4), transparent)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24" style={{ backgroundColor: "#ebebeb" }}>
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="mb-14 text-center">
            <span
              className="text-[13px] font-black uppercase tracking-[2px]"
              style={{ color: "#ff6700" }}
            >
              Ce qui nous anime
            </span>
            <h2
              className="mt-3 font-display text-[32px] font-black"
              style={{ color: "#0f172a" }}
            >
              Nos valeurs fondamentales
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-5 rounded-[20px] bg-white p-8 shadow-sm"
                style={{ boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-[16px]"
                  style={{ backgroundColor: "rgba(255,103,0,0.1)" }}
                >
                  <v.icon className="h-7 w-7" style={{ color: "#ff6700" }} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3
                    className="text-[20px] font-black"
                    style={{ color: "#0f172a" }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-[15px] leading-[26px]"
                    style={{ color: "#64748b" }}
                  >
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="mb-14 text-center">
            <span
              className="text-[13px] font-black uppercase tracking-[2px]"
              style={{ color: "#ff6700" }}
            >
              Les bâtisseurs
            </span>
            <h2
              className="mt-3 font-display text-[32px] font-black"
              style={{ color: "#0f172a" }}
            >
              Notre équipe
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full text-[22px] font-black text-white shadow-md"
                  style={{ backgroundColor: "#004e98" }}
                >
                  {member.initials}
                </div>
                <div>
                  <p
                    className="text-[18px] font-black"
                    style={{ color: "#0f172a" }}
                  >
                    {member.name}
                  </p>
                  <p
                    className="text-[13px] font-medium"
                    style={{ color: "#64748b" }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "#004e98" }} className="py-20">
        <div className="mx-auto flex max-w-[1024px] flex-col items-center gap-6 px-4 text-center">
          <h2 className="font-display text-[36px] font-black text-white">
            Prêt à rejoindre <span style={{ color: "#ff6700" }}>Kreli</span> ?
          </h2>
          <p
            className="max-w-[480px] text-[17px] font-light"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Inscrivez-vous gratuitement et accédez à des milliers d'équipements
            professionnels.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/signup"
              className="rounded-[24px] px-8 py-4 text-[16px] font-black text-white transition-transform hover:scale-105"
              style={{ backgroundColor: "#ff6700" }}
            >
              Créer un compte
            </Link>
            <Link
              href="/catalogue"
              className="rounded-[24px] border-2 border-white/30 px-8 py-4 text-[16px] font-black text-white transition-colors hover:bg-white/10"
            >
              Voir le catalogue
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
