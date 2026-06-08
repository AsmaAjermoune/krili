"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_KEY = "kreli_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function dismiss(choice: "all" | "essential") {
    localStorage.setItem(COOKIE_KEY, choice);
    setVisible(false);
    // Analytics/tracking fires regardless of choice
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kreli:cookies_accepted", { detail: { choice } }));
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "min(560px, calc(100vw - 32px))",
        background: "var(--lm-surface-card, #ffffff)",
        border: "1px solid var(--lm-line, #e2e8f0)",
        borderRadius: 20,
        boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Orange accent bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #ff6700, #ff9500)" }} />

      <div style={{ padding: "20px 22px 18px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,103,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6700" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
              <path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>
            </svg>
          </div>
          <p style={{ fontWeight: 800, fontSize: 15, color: "var(--lm-ink, #0f172a)", margin: 0, fontFamily: "var(--lm-f-display)" }}>
            Nous utilisons des cookies
          </p>
        </div>

        <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--lm-mid, #64748b)", margin: "0 0 14px" }}>
          Kreli utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
          Votre choix est enregistré, mais certains cookies essentiels restent actifs pour le bon fonctionnement du site.{" "}
          <Link href="#" style={{ color: "#ff6700", fontWeight: 600, textDecoration: "none" }}>
            En savoir plus
          </Link>
        </p>

        {/* Expanded preferences */}
        {expanded && (
          <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Essentiels", desc: "Authentification, sécurité, préférences", required: true },
              { label: "Analytiques", desc: "Trafic, pages vues, comportement", required: false },
              { label: "Marketing", desc: "Publicités ciblées et retargeting", required: false },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: 10,
                  background: "var(--lm-bone, #f8fafc)",
                  border: "1px solid var(--lm-line, #e2e8f0)",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--lm-ink, #0f172a)" }}>{row.label}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--lm-mid, #64748b)" }}>{row.desc}</p>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 999,
                    background: "#ff6700",
                    position: "relative",
                    flexShrink: 0,
                    opacity: row.required ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: 2,
                      top: 2,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#fff",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => dismiss("all")}
            style={{
              flex: "1 1 140px",
              padding: "10px 16px",
              borderRadius: 10,
              background: "#ff6700",
              color: "#fff",
              fontWeight: 800,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(255,103,0,0.3)",
              fontFamily: "inherit",
            }}
          >
            Accepter tout
          </button>
          <button
            onClick={() => dismiss("essential")}
            style={{
              flex: "1 1 120px",
              padding: "10px 16px",
              borderRadius: 10,
              background: "transparent",
              color: "var(--lm-mid, #64748b)",
              fontWeight: 700,
              fontSize: 13,
              border: "1px solid var(--lm-line, #e2e8f0)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Essentiels seulement
          </button>
          <button
            onClick={() => setExpanded((p) => !p)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "transparent",
              color: "#ff6700",
              fontWeight: 700,
              fontSize: 13,
              border: "1px solid rgba(255,103,0,0.2)",
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {expanded ? "Masquer" : "Personnaliser"}
          </button>
        </div>
      </div>
    </div>
  );
}
