"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

const TapeLeft = () => (
  <svg
    width="72" height="28" viewBox="0 0 72 28" fill="none"
    style={{ position: "absolute", top: -12, left: 32, pointerEvents: "none", zIndex: 2 }}
  >
    <rect x="0" y="4" width="72" height="20" rx="3" fill="rgba(255,244,180,0.92)" />
    <rect x="0" y="4" width="72" height="20" rx="3" stroke="rgba(200,180,80,0.25)" strokeWidth="1" />
    <line x1="0" y1="10" x2="72" y2="10" stroke="rgba(200,180,80,0.18)" strokeWidth="1" />
    <line x1="0" y1="16" x2="72" y2="16" stroke="rgba(200,180,80,0.18)" strokeWidth="1" />
    <line x1="0" y1="22" x2="72" y2="22" stroke="rgba(200,180,80,0.18)" strokeWidth="1" />
  </svg>
);

const TapeRight = () => (
  <svg
    width="72" height="28" viewBox="0 0 72 28" fill="none"
    style={{ position: "absolute", top: -12, right: 32, pointerEvents: "none", zIndex: 2 }}
  >
    <rect x="0" y="4" width="72" height="20" rx="3" fill="rgba(255,244,180,0.92)" />
    <rect x="0" y="4" width="72" height="20" rx="3" stroke="rgba(200,180,80,0.25)" strokeWidth="1" />
    <line x1="0" y1="10" x2="72" y2="10" stroke="rgba(200,180,80,0.18)" strokeWidth="1" />
    <line x1="0" y1="16" x2="72" y2="16" stroke="rgba(200,180,80,0.18)" strokeWidth="1" />
    <line x1="0" y1="22" x2="72" y2="22" stroke="rgba(200,180,80,0.18)" strokeWidth="1" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LogoMark = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
    <rect x="1" y="1" width="30" height="30" rx="8" fill="#0A0A09" />
    <path d="M11 22V10h2.4l3.4 5.4L19.2 10H21.6V22H19.4V13.5l-3.6 5.7-3.6-5.7V22H11Z" fill="white" />
  </svg>
);

export default function Footer() {
  const { t } = useI18n();
  const [proposed, setProposed] = useState(false);
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: "Plateforme",
      links: [
        { label: t("footer.link_catalogue"), href: "/catalogue" },
        { label: t("footer.link_how"), href: "/about#how" },
        { label: t("footer.link_about"), href: "/about" },
      ],
    },
    {
      heading: "Propriétaires",
      links: [
        { label: "Publier un matériel", href: "/dashboard/proprietaire/ajouter" },
        { label: "Dashboard", href: "/dashboard/proprietaire" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: t("footer.link_contact"), href: "mailto:support@Kreli.ma" },
        { label: t("footer.link_privacy"), href: "#" },
        { label: t("footer.link_terms"), href: "#" },
      ],
    },
  ];

  const socials = [
    { icon: <FacebookIcon />, href: "https://facebook.com", label: "Facebook" },
    { icon: <TwitterIcon />, href: "https://twitter.com", label: "Twitter" },
    { icon: <LinkedInIcon />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer style={{ background: "#EDEDE8", padding: "48px 32px 32px" }}>
        {/* White card — full width */}
        <div
          style={{
            position: "relative",
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "48px 52px 40px",
            boxShadow: "0 1px 3px rgba(10,10,9,0.06), 0 8px 32px rgba(10,10,9,0.04)",
            border: "1px solid rgba(10,10,9,0.07)",
          }}
        >
          {/* Tape decorations */}
          <TapeLeft />
          <TapeRight />

          {/* Main grid: brand left, columns right */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 64,
              alignItems: "start",
            }}
          >
            {/* Brand */}
            <div style={{ maxWidth: 320 }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                  marginBottom: 16,
                }}
              >
                <LogoMark />
                <span
                  style={{
                    fontFamily: "var(--lm-f-display, 'Inter Tight', sans-serif)",
                    fontWeight: 800,
                    fontSize: 19,
                    letterSpacing: "-0.05em",
                    color: "#0A0A09",
                  }}
                >
                  Kreli<span style={{ color: "#FF4D00" }}>.</span>
                </span>
              </Link>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "#5C5C5A",
                  margin: 0,
                }}
              >
                {t("footer.description")}
              </p>

              {/* Proposal easter egg */}
              <div style={{ marginTop: 28 }}>
                {!proposed ? (
                  <button
                    onClick={() => setProposed(true)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      color: "#f472b6",
                      opacity: 0.22,
                      fontWeight: 500,
                      padding: 0,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.22")}
                  >
                    <Heart style={{ width: 11, height: 11, fill: "currentColor" }} />
                    Made with love
                    <Heart style={{ width: 11, height: 11, fill: "currentColor" }} />
                  </button>
                ) : (
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(244,63,94,0.08), rgba(236,72,153,0.06))",
                      border: "1px solid rgba(244,114,182,0.2)",
                      borderRadius: 16,
                      padding: "16px 20px",
                      maxWidth: 280,
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 8 }}>💍</div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A09", margin: "0 0 4px" }}>
                      Aya,{" "}
                      <span style={{ color: "#f43f5e" }}>veux-tu m&apos;épouser ?</span> 🌸
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px" }}>
                      Je t&apos;aime plus que tous les matériels de Kreli réunis. 💕
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setProposed(false)}
                        style={{
                          border: "1px solid rgba(10,10,9,0.12)",
                          background: "transparent",
                          borderRadius: 999,
                          padding: "5px 14px",
                          fontSize: 12,
                          color: "#5C5C5A",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        Non 🥺
                      </button>
                      <button
                        style={{
                          background: "linear-gradient(135deg, #f43f5e, #ec4899)",
                          border: "none",
                          borderRadius: 999,
                          padding: "5px 16px",
                          fontSize: 12,
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Oui ! 💍✨
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Link columns */}
            <div style={{ display: "flex", gap: 56, paddingTop: 4 }}>
              {columns.map(col => (
                <div key={col.heading}>
                  <p
                    style={{
                      fontFamily: "var(--lm-f-mono, monospace)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#0A0A09",
                      margin: "0 0 14px",
                    }}
                  >
                    {col.heading}
                  </p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          style={{
                            fontSize: 13.5,
                            color: "#5C5C5A",
                            textDecoration: "none",
                            fontWeight: 450,
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={e => ((e.target as HTMLElement).style.color = "#0A0A09")}
                          onMouseLeave={e => ((e.target as HTMLElement).style.color = "#5C5C5A")}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(10,10,9,0.07)", margin: "36px 0 24px" }} />

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p style={{ fontSize: 12.5, color: "#8C8C8A", margin: 0 }}>
              © {year} Kreli · {t("footer.rights")}
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    color: "#8C8C8A",
                    textDecoration: "none",
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#0A0A09";
                    el.style.background = "rgba(10,10,9,0.06)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#8C8C8A";
                    el.style.background = "transparent";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
    </footer>
  );
}
