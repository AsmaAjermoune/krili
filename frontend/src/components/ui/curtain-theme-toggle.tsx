"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type CSSProperties,
} from "react";
import { useTheme } from "next-themes";

type CurtainPhase = "idle" | "falling" | "rising";

const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

// Match the CSS vars: --background light = hsl(0,0%,100%), dark = hsl(222,47%,6%)
const CURTAIN_COLOR = { light: "hsl(0,0%,100%)", dark: "hsl(222,47%,6%)" };

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="1"    x2="12" y2="3"    />
      <line x1="12" y1="21"   x2="12" y2="23"   />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"     y1="12"    x2="3"     y2="12"    />
      <line x1="21"    y1="12"    x2="23"    y2="12"    />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

export function CurtainThemeToggle({
  size     = 36,
  duration = 550,
  scrolled = false,
}: {
  size?:     number;
  duration?: number;
  /** When true, applies a liquid-glass style (for use inside a scrolled navbar). */
  scrolled?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted,  setMounted]  = useState(false);
  const [phase,    setPhase]    = useState<CurtainPhase>("idle");
  const [hovered,  setHovered]  = useState(false);
  const [pressed,  setPressed]  = useState(false);
  const curtainColorRef         = useRef<string>("");

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const toggle = useCallback(() => {
    if (phase !== "idle" || !mounted) return;
    const next = isDark ? "light" : "dark";
    curtainColorRef.current = CURTAIN_COLOR[next];
    setPhase("falling");
    setTimeout(() => {
      setTheme(next);
      setPhase("rising");
      setTimeout(() => setPhase("idle"), duration + 80);
    }, duration);
  }, [phase, isDark, duration, setTheme, mounted]);

  // Placeholder during SSR / before hydration
  if (!mounted) return <div style={{ width: size, height: size, borderRadius: "50%" }} />;

  const btnScale = pressed ? 0.92 : hovered ? 1.08 : 1;

  const btnStyle: CSSProperties = scrolled
    ? {
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.28)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        color: "rgba(255,255,255,0.9)",
      }
    : {
        background: isDark ? "#1e293b" : "#ffffff",
        border: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
        color: isDark ? "#94a3b8" : "#64748b",
      };

  const curtainStyle: CSSProperties = {
    position:      "fixed",
    inset:         0,
    background:    curtainColorRef.current,
    transformOrigin: "top",
    transform:     phase === "falling" ? "scaleY(1)" : "scaleY(0)",
    transition:    phase !== "idle" ? `transform ${duration}ms ${EASING}` : "none",
    zIndex:        9997,
    pointerEvents: "none",
  };

  return (
    <>
      <div aria-hidden="true" style={curtainStyle} />
      <button
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          width: size, height: size,
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
          transform: `scale(${btnScale})`,
          transition: "background 0.3s ease, color 0.3s ease, transform 0.15s ease, border-color 0.3s ease",
          flexShrink: 0,
          ...btnStyle,
        }}
        aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        aria-pressed={isDark}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </>
  );
}
