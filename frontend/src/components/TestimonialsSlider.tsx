"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  stars: number;
  gradient: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Karim El Amrani",
    role: "Entrepreneur BTP",
    avatar: "K",
    stars: 5,
    gradient: "linear-gradient(135deg, #f43f5e, #ec4899)",
    text: "Service irréprochable. J'ai loué une mini-pelle pour un chantier à Mohammedia, livraison pile à l'heure et matériel neuf.",
  },
  {
    name: "Sara Mansouri",
    role: "Event Manager",
    avatar: "S",
    stars: 5,
    gradient: "linear-gradient(135deg, #ec4899, #a78bfa)",
    text: "Plateforme très intuitive. Le paiement est sécurisé et le support client est très réactif au téléphone.",
  },
  {
    name: "Omar Tazi",
    role: "Responsable Industriel",
    avatar: "O",
    stars: 5,
    gradient: "linear-gradient(135deg, #004e98, #ec4899)",
    text: "Kreli m'a permis de réduire mes coûts d'investissement. La flexibilité des contrats est un vrai plus.",
  },
  {
    name: "Nadia Benali",
    role: "Chef de Projet",
    avatar: "N",
    stars: 4,
    gradient: "linear-gradient(135deg, #f43f5e, #fdba74)",
    text: "Excellent rapport qualité-prix. Le système de réservation est fluide et le service client répond rapidement.",
  },
];

export default function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goPrev = () => goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const goNext = () => goTo((current + 1) % TESTIMONIALS.length);

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fdf2f8 0%, #fff 100%)" }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-14 w-14 rounded-full"
            style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
          >
            <Heart className="h-7 w-7 fill-white text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-[36px] text-center"
            style={{ color: "#0f172a" }}
          >
            La voix de nos clients
          </motion.h2>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" style={{ color: "#f43f5e" }} />
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[16px] font-medium text-center"
            style={{ color: "#64748b" }}
          >
            Basé sur plus de 1,200 avis vérifiés
          </motion.p>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={goPrev}
              className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full border transition-all shrink-0 hover:-translate-x-0.5"
              style={{ borderColor: "rgba(244,63,94,0.2)", background: "white", color: "#f43f5e" }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative w-full max-w-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 80, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -80, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <div className="relative rounded-[28px] p-8 md:p-12 overflow-hidden"
                    style={{
                      background: "white",
                      border: "1px solid rgba(244,114,182,0.2)",
                      boxShadow: "0 8px 32px -8px rgba(244,63,94,0.15)",
                    }}
                  >
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full opacity-10"
                      style={{ background: testimonial.gradient }}
                    />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full opacity-8"
                      style={{ background: "linear-gradient(135deg, #ec4899, #a78bfa)", opacity: 0.06 }}
                    />

                    {/* Quote icon */}
                    <div className="absolute top-6 left-6 text-5xl leading-none font-serif opacity-15"
                      style={{ color: "#f43f5e" }}
                    >
                      &ldquo;
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Stars */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5"
                            fill={i < testimonial.stars ? "#f43f5e" : "none"}
                            stroke={i < testimonial.stars ? "none" : "#f43f5e"}
                            style={{ color: "#f43f5e" }}
                          />
                        ))}
                      </div>

                      <p className="text-lg md:text-xl leading-relaxed" style={{ color: "#334155" }}>
                        {testimonial.text}
                      </p>

                      <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: "rgba(244,114,182,0.15)" }}>
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[20px] font-black uppercase text-white"
                          style={{ background: testimonial.gradient }}
                        >
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="text-[16px] font-black" style={{ color: "#0f172a" }}>
                            {testimonial.name}
                          </p>
                          <p className="text-[13px] font-semibold" style={{ color: "#ec4899" }}>
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <Heart className="h-5 w-5 fill-current animate-heartbeat" style={{ color: "#fda4af", opacity: 0.6 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={goNext}
              className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full border transition-all shrink-0 hover:translate-x-0.5"
              style={{ borderColor: "rgba(244,63,94,0.2)", background: "white", color: "#f43f5e" }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: current === index ? "28px" : "8px",
                  background: current === index
                    ? "linear-gradient(90deg, #f43f5e, #ec4899)"
                    : "rgba(244,63,94,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
