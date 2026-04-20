"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Karim El Amrani",
    role: "Entrepreneur BTP",
    avatar: "K",
    stars: 5,
    text: "Service irréprochable. J'ai loué une mini-pelle pour un chantier à Mohammedia, livraison pile à l'heure et matériel neuf.",
  },
  {
    name: "Sara Mansouri",
    role: "Event Manager",
    avatar: "S",
    stars: 5,
    text: "Plateforme très intuitive. Le paiement est sécurisé et le support client est très réactif au téléphone.",
  },
  {
    name: "Omar Tazi",
    role: "Responsable Industriel",
    avatar: "O",
    stars: 5,
    text: "Kreli m'a permis de réduire mes coûts d'investissement. La flexibilité des contrats est un vrai plus.",
  },
  {
    name: "Nadia Benali",
    role: "Chef de Projet",
    avatar: "N",
    stars: 4,
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

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4">
        <div className="flex flex-col items-center gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-[36px] text-center"
            style={{ color: "#0f172a" }}
          >
            La voix de nos clients
          </motion.h2>
          <div className="flex gap-1" style={{ color: "#ff6700" }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
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

        <div className="relative">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={goPrev}
              className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white hover:border-brand hover:text-brand transition-colors shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative w-full max-w-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full"
                >
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="p-0">
                      <div className="relative rounded-[24px] p-8 md:p-12" style={{ backgroundColor: current % 2 === 0 ? "#ebebeb" : "#ffffff", border: current % 2 !== 0 ? "2px solid #ebebeb" : "none" }}>
                        <Quote className="absolute top-6 left-6 h-10 w-10 text-brand/20" />

                        <div className="flex flex-col gap-6">
                          <div className="flex gap-1" style={{ color: "#ff6700" }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5"
                                fill={i < TESTIMONIALS[current].stars ? "#ff6700" : "none"}
                                stroke={i < TESTIMONIALS[current].stars ? "none" : "#ff6700"}
                              />
                            ))}
                          </div>

                          <p className="text-lg md:text-xl leading-relaxed" style={{ color: "#334155" }}>
                            {TESTIMONIALS[current].text}
                          </p>

                          <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: "#e2e8f0" }}>
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[20px] font-black uppercase text-white"
                              style={{ backgroundColor: "#004e98" }}
                            >
                              {TESTIMONIALS[current].avatar}
                            </div>
                            <div>
                              <p className="text-[16px] font-black" style={{ color: "#0f172a" }}>
                                {TESTIMONIALS[current].name}
                              </p>
                              <p
                                className="text-[14px] font-bold uppercase tracking-[-0.7px]"
                                style={{ color: "#64748b" }}
                              >
                                {TESTIMONIALS[current].role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={goNext}
              className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white hover:border-brand hover:text-brand transition-colors shrink-0"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: current === index ? "32px" : "8px",
                  backgroundColor: current === index ? "#ff6700" : "#e2e8f0",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
