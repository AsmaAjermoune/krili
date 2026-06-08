'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useTheme } from 'next-themes'

const TESTIMONIALS = [
  {
    name: 'Karim Alaoui',
    role: 'Entrepreneur BTP, Casablanca',
    avatar: 'KA',
    color: '#f59e0b',
    text: "Kreli m'a permis de louer une mini-pelle en moins de 2 heures. Le processus est simple, rapide, et le matériel était en parfait état.",
    rating: 5,
  },
  {
    name: 'Sara Moussaoui',
    role: 'Cheffe de chantier, Marrakech',
    avatar: 'SM',
    color: '#22c55e',
    text: "Je recommande Kreli à tous les professionnels du secteur. La sélection de matériel est variée et les prix sont très compétitifs.",
    rating: 5,
  },
  {
    name: 'Omar Tahiri',
    role: 'Directeur de travaux, Rabat',
    avatar: 'OT',
    color: '#0d9488',
    text: "Grâce à Kreli, j'ai pu équiper mon chantier rapidement sans immobiliser du capital. La livraison le jour même est un vrai avantage.",
    rating: 5,
  },
  {
    name: 'Mohammed Amrani',
    role: 'Artisan indépendant, Fès',
    avatar: 'MA',
    color: '#f97316',
    text: "La plateforme est intuitive et le service client est réactif. J'utilise Kreli régulièrement pour mes projets de rénovation.",
    rating: 5,
  },
  {
    name: 'Youssef Bakkali',
    role: "Gérant d'entreprise, Tanger",
    avatar: 'YB',
    color: '#06b6d4',
    text: "Excellent rapport qualité-prix. Le matériel est bien entretenu et la caution est restituée rapidement après chaque location.",
    rating: 5,
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#ff6700] text-[#ff6700]" />
      ))}
    </div>
  )
}

interface CardProps {
  item: (typeof TESTIMONIALS)[0]
  offset: number   // -2 … +2
  onClick?: () => void
  dark: boolean
}

function TestimonialCard({ item, offset, onClick, dark }: CardProps) {
  const abs = Math.abs(offset)

  return (
    <motion.div
      onClick={onClick}
      layout
      animate={{
        x: offset * 300,
        rotate: offset * 7,
        scale: 1 - abs * 0.1,
        opacity: abs > 1 ? 0.35 : abs === 1 ? 0.72 : 1,
        zIndex: 10 - abs,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] md:w-[540px] cursor-pointer select-none"
      style={{ transformOrigin: 'bottom center' }}
    >
      <div
        className="relative p-10 rounded-2xl shadow-xl"
        style={{
          background: dark ? '#1e293b' : '#ffffff',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
          clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
        }}
      >
        {/* Orange corner cut accent */}
        <div
          className="absolute top-0 right-0 w-6 h-6"
          style={{
            background: '#ff6700',
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
          }}
        />

        {/* Quote icon */}
        <div
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'rgba(255,103,0,0.10)' }}
        >
          <Quote className="h-5 w-5" style={{ color: '#ff6700' }} />
        </div>

        {/* Stars */}
        <StarRow count={item.rating} />

        {/* Text */}
        <p
          className="mt-5 text-[16px] leading-[1.75] font-medium"
          style={{ color: dark ? '#cbd5e1' : '#374151' }}
        >
          {item.text}
        </p>

        {/* Author */}
        <div className="mt-6 flex items-center gap-3 pt-5" style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}` }}>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white"
            style={{ backgroundColor: item.color }}
          >
            {item.avatar}
          </div>
          <div>
            <p className={`text-[14px] font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
            <p className="text-[12px]" style={{ color: dark ? '#64748b' : '#9ca3af' }}>{item.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function StaggerTestimonials() {
  const [active, setActive] = useState(0)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'
  const n = TESTIMONIALS.length
  const dragStartX = useRef(0)

  const prev = () => setActive((a) => (a - 1 + n) % n)
  const next = () => setActive((a) => (a + 1) % n)

  const visible = TESTIMONIALS.map((item, i) => {
    let offset = i - active
    if (offset > n / 2) offset -= n
    if (offset < -n / 2) offset += n
    return { item, offset, i }
  }).filter(({ offset }) => Math.abs(offset) <= 2)

  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: dark ? '#0f172a' : '#f0ebe3' }}
    >
      {/* Background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: dark
            ? 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,103,0,0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,103,0,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4">
        {/* Header */}
        <div className="mb-20 flex flex-col items-center gap-4 text-center">
          <span
            className="rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em]"
            style={{ backgroundColor: 'rgba(255,103,0,0.1)', color: '#ff6700' }}
          >
            Avis clients
          </span>
          <h2
            className="font-display font-black tracking-tight"
            style={{
              color: dark ? '#f1f5f9' : '#0f172a',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            }}
          >
            Ce que disent nos utilisateurs
          </h2>
          <p
            className="max-w-md text-[16px] leading-relaxed"
            style={{ color: dark ? '#94a3b8' : '#64748b' }}
          >
            Plus de 1 247 professionnels font confiance à Kreli au quotidien.
          </p>
        </div>

      </div>

      {/* Card stack — full section width so left-1/2 = viewport center */}
      <div
        className="relative h-[520px] md:h-[480px] cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => { dragStartX.current = e.clientX }}
        onMouseUp={(e) => {
          const dx = e.clientX - dragStartX.current
          if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
        }}
        onTouchStart={(e) => { dragStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - dragStartX.current
          if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
        }}
      >
        <AnimatePresence>
          {visible.map(({ item, offset, i }) => (
            <TestimonialCard
              key={i}
              item={item}
              offset={offset}
              dark={dark}
              onClick={offset !== 0 ? () => setActive(i) : undefined}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4">
        {/* Navigation */}
        <div className="mt-14 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Précédent"
            className="flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              color: dark ? '#f1f5f9' : '#0f172a',
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === active ? 24 : 8,
                  height: 8,
                  backgroundColor: i === active ? '#ff6700' : dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Suivant"
            className="flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              color: dark ? '#f1f5f9' : '#0f172a',
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
