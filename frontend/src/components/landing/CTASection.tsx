// frontend/src/components/landing/CTASection.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24"
      style={{ background: 'linear-gradient(135deg, #0f0520 0%, #1a0a2e 40%, #1a1a2e 70%, #0d1a35 100%)' }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full animate-gentle-pulse"
          style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)' }}
        />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full animate-gentle-pulse animation-delay-1000"
          style={{ background: 'radial-gradient(circle, rgba(0,78,152,0.2) 0%, rgba(167,139,250,0.08) 50%, transparent 70%)' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)' }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #f472b6 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" as const }}
        >
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(236,72,153,0.15))',
              border: '1px solid rgba(244,63,94,0.25)',
            }}
          >
            <Heart className="h-8 w-8 fill-current animate-heartbeat" style={{ color: '#f472b6' }} />
          </div>

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              border: '1px solid rgba(236,72,153,0.25)',
              background: 'rgba(236,72,153,0.1)',
              color: '#f9a8d4',
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Rejoignez notre communauté
          </div>

          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Vous avez du matériel à louer ?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg" style={{ color: '#cbd5e1' }}>
            Rentabilisez vos équipements professionnels en les mettant à disposition
            d&apos;autres professionnels partout au Maroc.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 font-semibold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                  boxShadow: '0 4px 24px -4px rgba(244,63,94,0.5)',
                }}
              >
                Devenir propriétaire <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 rounded-2xl border px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-all"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                }}
              >
                Explorer le catalogue
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
