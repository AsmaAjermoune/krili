"use client";

import { useMemo, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

const CircularGallery = dynamic(() => import("@/components/ui/CircularGallery"), {
  ssr: false,
  loading: () => <div className="h-full w-full" style={{ background: "transparent" }} />,
});
import MoroccoHeroSection from "@/components/landing/MoroccoHeroSection";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { useI18n } from "@/context/I18nContext";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface CategoryItem {
  _id: string;
  nom: string;
  slug: string;
  subtitle: string;
  image: string;
}

export interface FeaturedItem {
  _id: string;
  nom: string;
  localisation: string;
  prixParJour: number;
  caution: number;
  categorie: string;
  image: string;
}

interface Props {
  categories: CategoryItem[];
  featured: FeaturedItem[];
}

export default function HomeLandingClient({ categories, featured }: Props) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const galleryItems = useMemo(
    () => featured.map((item) => ({ image: item.image, text: item.nom })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(featured.map((f) => f._id))]
  );

  const handleItemClick = useCallback(
    (index: number) => {
      const item = featured[index];
      if (item) router.push(`/materiel/${item._id}`);
    },
    [featured, router]
  );

  const STATS = [
    { value: 5, suffix: "k+", label: t("hero.stat_materials") },
    { value: 12, suffix: "k+", label: t("hero.stat_clients") },
    { value: 98, suffix: "%", label: t("hero.stat_cities") },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ── Hero entrance timeline ──────────────────────────────────────────
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".lm-hero-title", { y: 70, opacity: 0, duration: 1.1 })
          .from(".lm-hero-subtitle", { y: 40, opacity: 0, duration: 0.9 }, "-=0.65")
          .from(".lm-hero-buttons", { y: 30, opacity: 0, duration: 0.75 }, "-=0.55")
          .from(".lm-hero-search", { y: 20, opacity: 0, duration: 0.6 }, "-=0.45");

        // Hero image subtle parallax
        gsap.to(".lm-hero-bg", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: ".lm-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // ── Section heading reveals ─────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>(".lm-section-heading").forEach((el) => {
          gsap.from(el, {
            y: 44,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // ── Category cards — staggered batch reveal ─────────────────────────
        ScrollTrigger.batch(".lm-cat-card", {
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { y: 64, opacity: 0, scale: 0.96 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.85,
                stagger: 0.1,
                ease: "power3.out",
                clearProps: "transform,opacity",
              }
            ),
          start: "top 88%",
          once: true,
        });

        // ── CTA text slide-in ───────────────────────────────────────────────
        gsap.from(".lm-cta-text", {
          x: -55,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".lm-cta-text", start: "top 82%", once: true },
        });

        // ── Stats counter animation ─────────────────────────────────────────
        document.querySelectorAll<HTMLElement>(".lm-stat-value").forEach((el) => {
          const target = Number(el.dataset.target ?? 0);
          const suffix = el.dataset.suffix ?? "";
          const proxy = { val: 0 };

          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () =>
              gsap.to(proxy, {
                val: target,
                duration: 2.2,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = Math.round(proxy.val) + suffix;
                },
              }),
          });
        });

        // ── Stats subtle fade-in ────────────────────────────────────────────
        gsap.from(".lm-stat-item", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".lm-stat-item", start: "top 85%", once: true },
        });
      });

      // Reduced-motion fallback — just fade everything in
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".lm-hero-title",
            ".lm-hero-subtitle",
            ".lm-hero-buttons",
            ".lm-hero-search",
            ".lm-cat-card",
            ".lm-cta-text",
            ".lm-stat-item",
          ],
          { opacity: 1, clearProps: "all" }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <MoroccoHeroSection />

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: dark ? "#0f172a" : "#f0ebe3" }}>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4">
          <div className="lm-section-heading flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <h2
                className="font-display font-black text-[36px] tracking-[-0.9px]"
                style={{ color: dark ? "#f1f5f9" : "#0f172a" }}
              >
                {t("categories_section.title")}
              </h2>
              <div
                className="h-[6px] w-24 rounded-full"
                style={{ backgroundColor: "#ff6700" }}
              />
            </div>
            <p
              className="max-w-[448px] text-[16px] font-medium leading-[24px]"
              style={{ color: dark ? "#94a3b8" : "#64748b" }}
            >
              {t("categories_section.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/catalogue?categorie=${cat._id}`}
                className="lm-cat-card group relative h-[400px] overflow-hidden rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] block"
              >
                <Image
                  src={cat.image}
                  alt={cat.nom}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-8 pb-[52px] pt-8">
                  <span
                    className="text-[14px] font-bold uppercase tracking-[1.4px]"
                    style={{ color: "#ff6700" }}
                  >
                    {cat.subtitle}
                  </span>
                  <span className="text-[24px] font-black leading-[32px] text-white">
                    {cat.nom}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured items ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: dark ? "#0f172a" : "#f0ebe3" }}
      >
        <div className="relative mx-auto flex max-w-[1280px] flex-col gap-12 px-4">
          {/* Section header */}
          <div className="lm-section-heading flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <h2
                className="font-display font-black tracking-[-0.9px]"
                style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", color: dark ? "#f1f5f9" : "#0f172a" }}
              >
                Kreli favorites
              </h2>
              <div className="h-[6px] w-24 rounded-full" style={{ backgroundColor: "#ff6700" }} />
              <p className="max-w-[520px] text-[16px] font-medium" style={{ color: dark ? "#94a3b8" : "#64748b" }}>
                Our selection of the most requested items.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-bold transition-all hover:scale-105"
              style={{
                borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                color: dark ? "#f1f5f9" : "#0f172a",
              }}
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* WebGL gallery stage */}
          <div className="relative w-full cursor-pointer" style={{ height: "600px" }}>
            <CircularGallery
              items={galleryItems}
              bend={3}
              textColor={dark ? "#ffffff" : "#111111"}
              borderRadius={0.05}
              scrollEase={0.02}
              onItemClick={handleItemClick}
            />
          </div>

          <p
            className="lm-mono text-center text-[11px] uppercase tracking-[0.2em]"
            style={{ color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)" }}
          >
            ↔ Drag or click to explore
          </p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <StaggerTestimonials />

      {/* ── CTA + Stats ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ff6700" }} className="py-20">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-16 px-4">
          <div className="lm-cta-text flex min-w-0 flex-1 flex-col gap-6">
            <h2 className="font-display font-black text-[36px] leading-[40px] text-white">
              {t("cta_section.title")}{" "}
              <span style={{ color: "rgba(255,255,255,0.75)" }}>Kreli</span>
            </h2>
            <p
              className="max-w-[512px] text-[18px] font-light leading-[29.25px]"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {t("cta_section.subtitle")}
            </p>
          </div>

          <div className="flex shrink-0 gap-16">
            {STATS.map((s) => (
              <div key={s.label} className="lm-stat-item flex flex-col items-center gap-2">
                <span
                  className="lm-stat-value text-[48px] font-black leading-[48px] text-white"
                  data-target={s.value}
                  data-suffix={s.suffix}
                >
                  {s.value}
                  {s.suffix}
                </span>
                <span
                  className="text-[12px] font-black uppercase tracking-[2.4px]"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
