import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1a1a2e" }}>
      <div className="mx-auto max-w-[1280px] px-4 pt-24 pb-12 flex flex-col gap-20">
        {/* Columns */}
        <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-[30px] font-black tracking-[-0.75px] text-white">
                  Kreli
                </span>
              </Link>
              <p className="text-[16px] leading-[26px]" style={{ color: "#94a3b8" }}>
                Leader marocain de la location digitale. Nous connectons l&apos;offre
                et la demande pour optimiser vos performances opérationnelles.
              </p>
            </div>
            <div className="flex gap-4">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors hover:border-white/50"
                style={{ backgroundColor: "rgba(30,41,59,0.5)", borderColor: "#334155" }}
              >
                <svg className="h-[18px] w-[18px] text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors hover:border-white/50"
                style={{ backgroundColor: "rgba(30,41,59,0.5)", borderColor: "#334155" }}
              >
                <svg className="h-4 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors hover:border-white/50"
                style={{ backgroundColor: "rgba(30,41,59,0.5)", borderColor: "#334155" }}
              >
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-8">
            <h4
              className="text-[20px] font-black uppercase tracking-[2px]"
              style={{ color: "#ff6700" }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                "Location de matériel",
                "Service de livraison",
                "Assurance KreliSafe",
                "Espace Loueur",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[16px] font-medium transition-colors hover:text-white"
                    style={{ color: "#94a3b8" }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* L'Entreprise */}
          <div className="flex flex-col gap-8">
            <h4
              className="text-[20px] font-black uppercase tracking-[2px]"
              style={{ color: "#ff6700" }}
            >
              L&apos;Entreprise
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                "Notre histoire",
                "Recrutement",
                "Blog & News",
                "Presse",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[16px] font-medium transition-colors hover:text-white"
                    style={{ color: "#94a3b8" }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Assistance */}
          <div className="flex flex-col gap-8">
            <h4
              className="text-[20px] font-black uppercase tracking-[2px]"
              style={{ color: "#ff6700" }}
            >
              Assistance
            </h4>
            <ul className="flex flex-col gap-6">
              <li>
                <a
                  href="mailto:support@kreli.ma"
                  className="flex items-center gap-4 text-[16px] font-medium transition-colors hover:text-white"
                  style={{ color: "#94a3b8" }}
                >
                  <Mail className="h-4 w-5 shrink-0" />
                  support@kreli.ma
                </a>
              </li>
              <li>
                <a
                  href="tel:+212522909090"
                  className="flex items-center gap-4 text-[16px] font-medium transition-colors hover:text-white"
                  style={{ color: "#94a3b8" }}
                >
                  <Phone className="h-[18px] w-[18px] shrink-0" />
                  +212 522 90 90 90
                </a>
              </li>
              <li>
                <span
                  className="flex items-center gap-4 text-[16px] font-medium"
                  style={{ color: "#94a3b8" }}
                >
                  <MapPin className="h-5 w-4 shrink-0" />
                  Technopark, Agadir
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 border-t pt-12"
          style={{ borderColor: "#1e293b" }}
        >
          <p
            className="text-[14px] font-bold uppercase tracking-[1.4px]"
            style={{ color: "#64748b" }}
          >
            © 2024 Kreli. Built in Morocco.
          </p>
          <div className="flex gap-8">
            {["Confidentialité", "Conditions", "Plan du site"].map((l) => (
              <Link
                key={l}
                href="#"
                className="text-[14px] font-bold uppercase tracking-[1.4px] transition-colors hover:text-white"
                style={{ color: "#64748b" }}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
