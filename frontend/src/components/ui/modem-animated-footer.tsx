"use client";

import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandAccent?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  className?: string;
}

export const ModemAnimatedFooter = ({
  brandName = "Loca",
  brandAccent = "Mat",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  bottomSlot,
  className,
}: FooterProps) => {
  const { t } = useI18n();
  const fullBrand = `${brandName}${brandAccent}`;

  return (
    <section className={cn("relative w-full mt-0 overflow-hidden", className)}>
      <footer
        className="relative mt-20 border-t"
        style={{ backgroundColor: "#1a1a2e", borderColor: "#1e293b" }}
      >
        <div className="relative mx-auto flex min-h-[30rem] max-w-7xl flex-col justify-between p-4 py-10 sm:min-h-[35rem] md:min-h-[40rem]">
          <div className="mb-12 flex w-full flex-col sm:mb-20 md:mb-0">
            <div className="flex w-full flex-col items-center">
              <div className="flex flex-1 flex-col items-center space-y-2">
                <Link href="/" className="flex items-center gap-1">
                  <span className="text-3xl font-black tracking-[-0.75px] text-white">
                    {brandName}
                  </span>
                  <span
                    className="text-3xl font-black tracking-[-0.75px]"
                    style={{ color: "#ff6700", marginLeft: "-4px" }}
                  >
                    {brandAccent}
                  </span>
                </Link>
                <p
                  className="w-full max-w-sm px-4 text-center font-semibold sm:w-96 sm:px-0"
                  style={{ color: "#94a3b8" }}
                >
                  {brandDescription}
                </p>
              </div>

              {socialLinks.length > 0 && (
                <div className="mb-8 mt-5 flex gap-4">
                  {socialLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="transition-colors"
                      style={{ color: "#94a3b8" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="h-6 w-6 duration-300 hover:scale-110 hover:text-white">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {navLinks.length > 0 && (
                <div
                  className="flex max-w-full flex-wrap justify-center gap-4 px-4 text-sm font-medium"
                  style={{ color: "#94a3b8" }}
                >
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      className="duration-300 hover:font-semibold hover:text-white"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-center gap-2 px-4 md:mt-24 md:flex-row md:items-center md:justify-between md:gap-1 md:px-0">
            <p
              className="text-center text-base md:text-left"
              style={{ color: "#94a3b8" }}
            >
              ©{new Date().getFullYear()} {fullBrand}. {t("footer.rights")}
            </p>
            {creatorName && creatorUrl && (
              <nav className="flex gap-4">
                <Link
                  href={creatorUrl}
                  target="_blank"
                  className="text-base transition-colors duration-300 hover:font-medium hover:text-white"
                  style={{ color: "#94a3b8" }}
                >
                  {t("footer.crafted_by")} {creatorName}
                </Link>
              </nav>
            )}
          </div>
        </div>

        {/* Large background brand text */}
        <div
          className="pointer-events-none absolute bottom-40 left-1/2 -translate-x-1/2 select-none bg-clip-text px-4 text-center font-extrabold leading-none tracking-tighter text-transparent md:bottom-32"
          style={{
            fontSize: "clamp(3rem, 12vw, 10rem)",
            maxWidth: "95vw",
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.06), transparent)",
          }}
        >
          {fullBrand.toUpperCase()}
        </div>

        {/* Floating brand logo */}
        <div
          className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-3xl border-2 p-3 backdrop-blur-sm duration-400 hover:border-white/40 md:bottom-20"
          style={{
            borderColor: "#334155",
            backgroundColor: "rgba(26,26,46,0.6)",
            filter: "drop-shadow(0 0 20px rgba(255,103,0,0.25))",
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg sm:h-16 sm:w-16 md:h-24 md:w-24"
            style={{
              background: "linear-gradient(135deg, #ff6700, #ff8a3c)",
            }}
          >
            {brandIcon || (
              <Package className="h-8 w-8 text-white drop-shadow-lg sm:h-10 sm:w-10 md:h-14 md:w-14" />
            )}
          </div>
        </div>

        {/* Bottom divider line */}
        <div
          className="absolute bottom-32 left-1/2 h-1 w-full -translate-x-1/2 backdrop-blur-sm sm:bottom-34"
          style={{
            background:
              "linear-gradient(to right, transparent, #334155, transparent)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-28 h-24 w-full blur-[1em]"
          style={{
            background:
              "linear-gradient(to top, #1a1a2e, rgba(26,26,46,0.8), rgba(26,26,46,0.4))",
          }}
        />

        {bottomSlot && <div className="relative z-20">{bottomSlot}</div>}
      </footer>
    </section>
  );
};
