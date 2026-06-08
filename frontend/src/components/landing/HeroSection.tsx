// frontend/src/components/landing/HeroSection.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, MapPin, ChevronRight, Shield, Star, Zap, Heart, Sparkles } from 'lucide-react'

const STATS = [
  { value: '500+',   label: 'Équipements' },
  { value: '200+',   label: 'Propriétaires vérifiés' },
  { value: '1 200+', label: 'Locations réalisées' },
  { value: '98%',    label: 'Satisfaction' },
]

const TRUST = [
  { icon: Shield, text: 'Paiements sécurisés' },
  { icon: Star,   text: 'Annonces vérifiées' },
  { icon: Zap,    text: 'Réponse en 24 h' },
]

const CITIES = ['Casablanca','Rabat','Marrakech','Tanger','Fès','Agadir']

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 26 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const floatingOrb = {
  hidden: { opacity: 0, scale: 0.8 },
  show:   { opacity: 1, scale: 1, transition: { duration: 1.2 } },
}

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [city,  setCity]  = useState('')
  const router = useRouter()

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (query) p.set('q', query)
    if (city)  p.set('ville', city)
    router.push(`/catalogue?${p.toString()}`)
  }

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0520 0%, #1a0a2e 35%, #1a1a2e 65%, #0d1a35 100%)' }}
    >
      {/* ── Ambient orbs ── */}
      <motion.div variants={floatingOrb} initial="hidden" animate="show"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Rose bloom top-right */}
        <div className="absolute -top-32 -right-32 h-[700px] w-[700px] rounded-full animate-gentle-pulse"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(244,63,94,0.08) 50%, transparent 70%)' }}
        />
        {/* Blue primary bottom-left */}
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full animate-gentle-pulse animation-delay-1000"
          style={{ background: 'radial-gradient(circle, rgba(0,78,152,0.25) 0%, rgba(167,139,250,0.08) 50%, transparent 70%)' }}
        />
        {/* Peach center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(253,186,116,0.05) 0%, transparent 70%)' }}
        />

        {/* Dot-grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #f472b6 1px, transparent 1px)',
            backgroundSize:  '36px 36px',
          }}
        />

        {/* Floating hearts */}
        {[
          { top: '15%', left: '8%', delay: '0s',    size: 18, opacity: 0.25 },
          { top: '25%', left: '88%', delay: '1.2s', size: 12, opacity: 0.2  },
          { top: '70%', left: '5%', delay: '2.1s',  size: 10, opacity: 0.18 },
          { top: '55%', left: '92%', delay: '0.7s', size: 16, opacity: 0.22 },
          { top: '82%', left: '78%', delay: '1.8s', size: 8,  opacity: 0.15 },
        ].map((h, i) => (
          <motion.div
            key={i}
            className="absolute animate-float"
            style={{ top: h.top, left: h.left, animationDelay: h.delay }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: h.opacity, y: 0 }}
            transition={{ delay: 0.8 + i * 0.3, duration: 0.8 }}
          >
            <Heart fill="currentColor" style={{ color: '#f472b6', width: h.size, height: h.size }} />
          </motion.div>
        ))}

        {/* Sparkles */}
        {[
          { top: '10%', left: '20%', delay: '0.5s'  },
          { top: '40%', left: '75%', delay: '1.5s'  },
          { top: '75%', left: '25%', delay: '2.5s'  },
          { top: '60%', left: '60%', delay: '0.9s'  },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute animate-twinkle"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.4 }}
          >
            <Sparkles style={{ color: '#fbbf24', width: 14, height: 14, opacity: 0.5 }} />
          </motion.div>
        ))}
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">

          {/* Badge */}
          <motion.div variants={item}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
                border: '1px solid rgba(236,72,153,0.3)',
                background: 'rgba(236,72,153,0.12)',
                color: '#f9a8d4',
              }}
            >
              <Heart className="h-3.5 w-3.5 fill-current animate-heartbeat" style={{ color: '#f472b6' }} />
              Plateforme #1 de location au Maroc
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Louez le matériel pro{' '}
            <span className="relative inline-block">
              <span
                style={{
                  background: 'linear-gradient(135deg, #ff6700 0%, #ec4899 50%, #f43f5e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                dont vous avez besoin
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 w-full"
                style={{ background: 'linear-gradient(90deg, #ff6700, #ec4899, #f43f5e)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              />
            </span>
            {', '}aujourd&apos;hui.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p variants={item} className="mb-8 max-w-xl text-lg leading-relaxed" style={{ color: '#cbd5e1' }}>
            BTP, outillage, événementiel, agriculture — trouvez l&apos;équipement idéal
            parmi des centaines d&apos;annonces vérifiées partout au Maroc.
          </motion.p>

          {/* Search bar */}
          <motion.form variants={item} onSubmit={onSearch} className="mb-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-md transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
              }}
            >
              <Search className="h-5 w-5 shrink-0" style={{ color: '#94a3b8' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Mini pelle, groupe électrogène, écran LED…"
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-md transition-all sm:w-44"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
              }}
            >
              <MapPin className="h-5 w-5 shrink-0" style={{ color: '#94a3b8' }} />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="flex-1 cursor-pointer appearance-none bg-transparent text-sm text-white outline-none"
              >
                <option value="" className="bg-[#1a0a2e]">Toutes les villes</option>
                {CITIES.map(c => <option key={c} value={c} className="bg-[#1a0a2e]">{c}</option>)}
              </select>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #ff6700 0%, #ec4899 100%)',
                boxShadow: '0 4px 24px -4px rgba(236,72,153,0.5)',
              }}
            >
              Rechercher <ChevronRight className="h-4 w-4" />
            </motion.button>
          </motion.form>

          {/* Trust badges */}
          <motion.div variants={item} className="mb-12 flex flex-wrap gap-5">
            {TRUST.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm" style={{ color: '#cbd5e1' }}>
                <Icon className="h-4 w-4" style={{ color: '#f472b6' }} />
                {text}
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, ease: "easeOut" as const }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(244,114,182,0.12)',
                }}
              >
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="mt-0.5 text-xs" style={{ color: '#94a3b8' }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
