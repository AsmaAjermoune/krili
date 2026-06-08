"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Zap,
  Users,
  TrendingUp,
  MapPin,
  Mail,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TEAM = [
  {
    name: "Youssef El Kaidi",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=YoussefElKaidi&backgroundColor=0A0A09&backgroundType=solid",
    roleKey: "about.role_ceo",
  },
  {
    name: "Sara Benali",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=SaraBenali&backgroundColor=ff6700&backgroundType=solid",
    roleKey: "about.role_cto",
  },
  {
    name: "Omar Tazi",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=OmarTazi&backgroundColor=1a1a2e&backgroundType=solid",
    roleKey: "about.role_ops",
  },
];

export default function AboutClient() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  const VALUES = [
    { icon: ShieldCheck, title: t("about.value_trust"), body: t("about.value_trust_body") },
    { icon: Zap,         title: t("about.value_speed"), body: t("about.value_speed_body") },
    { icon: Users,       title: t("about.value_community"), body: t("about.value_community_body") },
    { icon: TrendingUp,  title: t("about.value_impact"), body: t("about.value_impact_body") },
  ];

  const STATS = [
    { value: "5 000+", label: t("about.stat_refs") },
    { value: "12 000+", label: t("about.stat_contracts") },
    { value: "98 %", label: t("about.stat_satisfaction") },
    { value: "8", label: t("about.stat_cities") },
  ];

  const HOW = [
    t("about.step1"),
    t("about.step2"),
    t("about.step3"),
    t("about.step4"),
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".ab-hero-title", { y: 60, opacity: 0, duration: 1 })
          .from(".ab-hero-body", { y: 30, opacity: 0, duration: 0.8 }, "-=0.55")
          .from(".ab-hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");

        ScrollTrigger.batch(".ab-stat", {
          onEnter: (els) => gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.out" }),
          start: "top 88%", once: true,
        });

        ScrollTrigger.batch(".ab-value-card", {
          onEnter: (els) => gsap.fromTo(els, { y: 56, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", clearProps: "transform,opacity" }),
          start: "top 88%", once: true,
        });

        gsap.utils.toArray<HTMLElement>(".ab-heading").forEach((el) => {
          gsap.from(el, { y: 40, opacity: 0, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });

        ScrollTrigger.batch(".ab-team-card", {
          onEnter: (els) => gsap.fromTo(els, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }),
          start: "top 88%", once: true,
        });

        ScrollTrigger.batch(".ab-how-item", {
          onEnter: (els) => gsap.fromTo(els, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }),
          start: "top 88%", once: true,
        });
      });
      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} style={{ background: "var(--lm-paper)", color: "var(--lm-ink)" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--lm-surface-inverted)", position: "relative", overflow: "hidden" }}>
        {/* Subtle grid texture */}
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: "linear-gradient(var(--lm-line) 1px, transparent 1px), linear-gradient(90deg, var(--lm-line) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Orange glow */}
        <div style={{ position: "absolute", top: -120, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,103,0,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-24 sm:py-32" style={{ position: "relative", zIndex: 1 }}>
          <h1
            className="ab-hero-title font-display font-black leading-none"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", color: "var(--lm-paper)" }}
          >
            {t("about.title_a")}
            <br />
            <span style={{ color: "#ff6700" }}>{t("about.title_b")}</span>
          </h1>
          <p
            className="ab-hero-body mt-6 max-w-2xl text-[17px] font-light leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {t("about.intro")}
          </p>
          <div className="ab-hero-cta mt-10 flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-black text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: "#ff6700", boxShadow: "0 4px 18px rgba(255,103,0,0.35)" }}
            >
              {t("about.cta_catalogue")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-[15px] font-black transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
            >
              {t("about.cta_join")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--lm-surface-card)", borderBottom: "1px solid var(--lm-line)" }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="ab-stat flex flex-col gap-1">
                <span
                  className="font-display font-black"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#ff6700", lineHeight: 1 }}
                >
                  {s.value}
                </span>
                <span className="text-[13px] font-medium" style={{ color: "var(--lm-mid)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--lm-paper)" }} className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="ab-heading mb-3 text-[11px] font-black uppercase tracking-[2px]" style={{ color: "#ff6700" }}>
                {t("about.mission_label")}
              </p>
              <h2
                className="ab-heading font-display font-black leading-tight"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--lm-ink)" }}
              >
                {t("about.mission_title_a")}
                <br />
                {t("about.mission_title_b")}
              </h2>
              <p className="mt-6 text-[16px] leading-relaxed" style={{ color: "var(--lm-mid)" }}>
                {t("about.mission_body_a")}
              </p>
              <p className="mt-4 text-[16px] leading-relaxed" style={{ color: "var(--lm-mid)" }}>
                {t("about.mission_body_b")}
              </p>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{ background: "var(--lm-surface-card)", border: "1px solid var(--lm-line)" }}
            >
              <p className="mb-6 text-[13px] font-black uppercase tracking-[1.5px]" style={{ color: "var(--lm-muted)" }}>
                {t("about.for_owners")}
              </p>
              <div className="flex flex-col gap-4">
                {HOW.map((step, i) => (
                  <div key={i} className="ab-how-item flex items-start gap-4">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-black text-white"
                      style={{ background: "#ff6700" }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-[15px] leading-relaxed" style={{ color: "var(--lm-char)" }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-px" style={{ background: "var(--lm-line)" }} />
              <div className="mt-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 shrink-0" style={{ color: "#ff6700" }} />
                <p className="text-[14px] font-semibold" style={{ color: "var(--lm-ink)" }}>
                  {t("about.transparent")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--lm-bone)" }} className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-14">
            <p className="ab-heading mb-3 text-[11px] font-black uppercase tracking-[2px]" style={{ color: "#ff6700" }}>
              {t("about.values_label")}
            </p>
            <h2
              className="ab-heading font-display font-black leading-tight"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--lm-ink)" }}
            >
              {t("about.values_title")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="ab-value-card flex flex-col gap-5 rounded-2xl p-7 transition-shadow hover:shadow-lg"
                style={{ background: "var(--lm-surface-card)", border: "1px solid var(--lm-line)" }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: "rgba(255,103,0,0.08)" }}
                >
                  <Icon className="h-6 w-6" style={{ color: "#ff6700" }} />
                </div>
                <div>
                  <h3 className="mb-2 text-[18px] font-black" style={{ color: "var(--lm-ink)" }}>
                    {title}
                  </h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--lm-mid)" }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--lm-paper)" }} className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-14">
            <p className="ab-heading mb-3 text-[11px] font-black uppercase tracking-[2px]" style={{ color: "#ff6700" }}>
              {t("about.team_label")}
            </p>
            <h2
              className="ab-heading font-display font-black leading-tight"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--lm-ink)" }}
            >
              {t("about.team_title")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 lg:max-w-3xl">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="ab-team-card rounded-2xl p-6 transition-shadow hover:shadow-lg"
                style={{ background: "var(--lm-surface-card)", border: "1px solid var(--lm-line)" }}
              >
                <div className="mb-5 h-20 w-20 overflow-hidden rounded-2xl" style={{ border: "2px solid var(--lm-line)" }}>
                  <Image src={member.avatar} alt={member.name} width={80} height={80} className="h-full w-full object-cover" unoptimized />
                </div>
                <p className="text-[17px] font-black" style={{ color: "var(--lm-ink)" }}>
                  {member.name}
                </p>
                <p className="mt-1 text-[13px] font-medium" style={{ color: "var(--lm-mid)" }}>
                  {t(member.roleKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact + CTA ────────────────────────────────────────────────── */}
      <section style={{ background: "var(--lm-surface-inverted)", position: "relative", overflow: "hidden" }} className="py-20">
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,103,0,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6" style={{ position: "relative", zIndex: 1 }}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2
                className="ab-heading font-display font-black leading-tight"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--lm-paper)" }}
              >
                {t("about.contact_title_a")}
                <br />
                <span style={{ color: "#ff6700" }}>{t("about.contact_title_b")}</span>
              </h2>
              <p className="mt-4 text-[16px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {t("about.contact_body")}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="mailto:contact@kreli.ma"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-black text-white transition-all hover:scale-105"
                  style={{ background: "#ff6700", boxShadow: "0 4px 18px rgba(255,103,0,0.35)" }}
                >
                  <Mail className="h-4 w-4" />
                  contact@kreli.ma
                </Link>
              </div>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-5 w-5 shrink-0" style={{ color: "#ff6700" }} />
                <p className="text-[15px] font-semibold" style={{ color: "var(--lm-paper)" }}>{t("about.address")}</p>
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t("about.coverage_body")}
              </p>
              <div className="mt-8 flex flex-col gap-2.5">
                {["Agadir", "Casablanca", "Marrakech", "Rabat", "Fès", "Tanger"].map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#ff6700" }} />
                    <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
