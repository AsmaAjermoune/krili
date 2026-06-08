// frontend/src/components/landing/HowItWorksSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Search, CheckCircle, Truck, ThumbsUp } from 'lucide-react'

const STEPS = [
  {
    icon: Search, step: '01', title: 'Cherchez',
    gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)',
    border: 'rgba(244,63,94,0.2)',
    desc: "Parcourez des centaines d'annonces filtrées par catégorie, ville et budget.",
  },
  {
    icon: CheckCircle, step: '02', title: 'Réservez',
    gradient: 'linear-gradient(135deg, #004e98, #ec4899)',
    border: 'rgba(0,78,152,0.2)',
    desc: "Envoyez une demande de location directement au propriétaire en quelques clics.",
  },
  {
    icon: Truck, step: '03', title: 'Récupérez',
    gradient: 'linear-gradient(135deg, #ec4899, #a78bfa)',
    border: 'rgba(167,139,250,0.25)',
    desc: "Coordonnez la remise du matériel avec le propriétaire à l'heure et au lieu convenus.",
  },
  {
    icon: ThumbsUp, step: '04', title: 'Profitez',
    gradient: 'linear-gradient(135deg, #f43f5e, #fdba74)',
    border: 'rgba(244,63,94,0.2)',
    desc: "Utilisez votre équipement et retournez-le à la fin de la période de location.",
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.55 } },
}

export default function HowItWorksSection() {
  return (
    <section className="py-20" style={{ background: 'linear-gradient(180deg, #fff 0%, #fdf2f8 50%, #fff 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="mb-14 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(244,63,94,0.08)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.15)' }}
          >
            🌸 Comment ça marche
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl" style={{ color: '#1a1a2e' }}>
            Louer en 4 étapes simples
          </h2>
        </motion.div>

        <motion.div
          variants={container} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-40px' }}
          className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Connector line */}
          <div className="pointer-events-none absolute top-10 hidden h-px w-full lg:block"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.2), rgba(236,72,153,0.3), rgba(167,139,250,0.2), transparent)' }}
          />

          {STEPS.map(s => (
            <motion.div key={s.step} variants={item}
              className="relative text-center group"
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105"
                style={{ background: `${s.gradient.replace('linear-gradient(135deg, ', 'linear-gradient(135deg, ').replace(')', '33)')}`, border: `1px solid ${s.border}` }}
              >
                <s.icon className="h-9 w-9" style={{ color: '#f43f5e' }} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: s.gradient }}
                >
                  {s.step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold" style={{ color: '#1a1a2e' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
