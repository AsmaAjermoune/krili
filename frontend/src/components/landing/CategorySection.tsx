// frontend/src/components/landing/CategorySection.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Category } from '@/lib/api'

const CATEGORY_EMOJIS: Record<string, string> = {
  'BTP & Chantier': '🏗',
  'Outillage Pro': '🔧',
  'Evenementiel': '🎪',
  'Electronique': '📷',
  'Agriculture': '🌾',
  'Industrie': '⚙️',
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const card = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.5 } },
}

export default function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-20" style={{ background: 'linear-gradient(180deg, #fff 0%, #fdf2f8 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(244,63,94,0.08)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.15)' }}
          >
            ✨ Catégories
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl" style={{ color: '#1a1a2e' }}>
            Trouvez par domaine
          </h2>
          <p className="mx-auto mt-4 max-w-xl" style={{ color: '#64748b' }}>
            Du BTP à l&apos;événementiel, chaque secteur dispose de son équipement spécialisé.
          </p>
        </motion.div>

        <motion.div
          variants={container} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {categories.map((cat, idx) => (
            <motion.div key={cat._id} variants={card}>
              <Link
                href={`/catalogue?categorie=${cat._id}`}
                className="group flex flex-col items-center gap-3 rounded-2xl p-5 transition-all duration-300"
                style={{
                  border: '1px solid rgba(244,114,182,0.15)',
                  background: 'white',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background =
                    idx % 2 === 0
                      ? 'linear-gradient(135deg, #fdf2f8, #fce7f3)'
                      : 'linear-gradient(135deg, #f0f9ff, #eff6ff)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,94,0.3)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px -6px rgba(244,63,94,0.2)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'white'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,114,182,0.15)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #fce7f3, #fdf2f8)' }}
                >
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.nom} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">
                      {CATEGORY_EMOJIS[cat.nom] ?? '📦'}
                    </div>
                  )}
                </div>
                <span className="text-center text-xs font-semibold leading-tight transition-colors group-hover:text-[#f43f5e]"
                  style={{ color: '#1a1a2e' }}
                >
                  {cat.nom}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/catalogue"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
              color: 'white',
              boxShadow: '0 4px 16px -4px rgba(244,63,94,0.4)',
            }}
          >
            Voir tout le catalogue
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
