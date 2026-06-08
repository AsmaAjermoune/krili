'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import RotatingText from '@/components/ui/RotatingText'
import { useI18n } from '@/context/I18nContext'

const CITIES = [
  { name: 'Casablanca', count: 1248, x: 581.3, y: 228.6, showLabel: true,  labelRight: false },
  { name: 'Agadir',     count: 894,  x: 531,   y: 421.9, showLabel: true,  labelRight: true  },
  { name: 'Marrakech',  count: 612,  x: 531.2, y: 318.7, showLabel: false, labelRight: true  },
  { name: 'Rabat',      count: 487,  x: 644.7, y: 171.3, showLabel: false, labelRight: false },
  { name: 'Fès',        count: 312,  x: 725.4, y: 173,   showLabel: false, labelRight: false },
  { name: 'Tanger',     count: 142,  x: 692.1, y: 98.1,  showLabel: false, labelRight: false },
]

const AVATARS = [
  { initials: 'KA', color: '#f59e0b' },
  { initials: 'SM', color: '#22c55e' },
  { initials: 'OT', color: '#0d9488' },
  { initials: 'MA', color: '#f97316' },
  { initials: 'YB', color: '#06b6d4' },
]

const CONNECTIONS: [string, string, number][] = [
  ['Casablanca', 'Marrakech', 0],
  ['Marrakech',  'Agadir',    1],
  ['Casablanca', 'Rabat',     2],
  ['Rabat',      'Fès',       3],
  ['Fès',        'Tanger',    4],
  ['Casablanca', 'Fès',       5],
  ['Casablanca', 'Tanger',    6],
  ['Casablanca', 'Agadir',    7],
  ['Rabat',      'Tanger',    8],
  ['Marrakech',  'Rabat',     9],
  ['Marrakech',  'Fès',      10],
  ['Agadir',     'Rabat',    11],
  ['Agadir',     'Fès',      12],
  ['Marrakech',  'Tanger',   13],
  ['Agadir',     'Tanger',   14],
]

function createArc(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2
  const dist  = Math.hypot(to.x - from.x, to.y - from.y)
  const lift  = Math.max(70, dist * 0.4)
  const midY  = Math.min(from.y, to.y) - lift
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`
}

const MAP_VIEWBOX = '100 30 860 970'

export default function MoroccoHeroSection() {
  const [activeCity, setActiveCity] = useState('Casablanca')
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme } = useTheme()
  const { t } = useI18n()
  const dark = resolvedTheme === 'dark'

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) router.push(`/catalogue?q=${encodeURIComponent(query.trim())}`)
    else router.push('/catalogue')
  }

  return (
    <section
      className="relative"
      style={{ minHeight: '100svh', background: dark ? '#0f172a' : '#f0ebe3', overflowX: 'hidden' }}
    >
      {/* ── Morocco map — absolute, height-driven so it never clips ── */}
      <div
        className="absolute hidden lg:block"
        style={{
          top: '50%',
          left: '20%',
          right: '-50px',
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.94 }}
          animate={{ opacity: 1, x: 0,  scale: 1 }}
          transition={{ duration: 1.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg
            viewBox={MAP_VIEWBOX}
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: '96svh', width: 'auto', display: 'block', filter: 'drop-shadow(0 20px 60px rgba(255,103,0,0.22))' }}
          >
            <defs>
              <style>{`
                @keyframes cityPulse {
                  0%, 100% { opacity: 0.4; r: 28; }
                  50%       { opacity: 0.75; r: 38; }
                }
                .city-pulse { animation: cityPulse 2.4s ease-in-out infinite; }
              `}</style>
            </defs>

            <image href="/ma-orange.svg" x="0" y="0" width="1000" height="1000" />

            {/* ── City connection arcs ── */}
            {CONNECTIONS.map(([fromName, toName, idx]) => {
              const from = CITIES.find(c => c.name === fromName)!
              const to   = CITIES.find(c => c.name === toName)!
              const d    = createArc(from, to)
              const delay = 0.7 + idx * 0.2
              const dotDur = 2.8 + idx * 0.25
              const dotDelay = delay + 0.9
              return (
                <g key={`arc-${fromName}-${toName}`}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray="7 5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <circle r={6} fill="rgba(255,255,255,0.95)">
                    <animateMotion
                      dur={`${dotDur}s`}
                      begin={`${dotDelay}s`}
                      repeatCount="indefinite"
                      keyPoints="0;1"
                      keyTimes="0;1"
                      calcMode="linear"
                      path={d}
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.12;0.88;1"
                      dur={`${dotDur}s`}
                      begin={`${dotDelay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              )
            })}

            {CITIES.map(city => {
              const isActive = activeCity === city.name
              return (
                <g key={city.name} style={{ cursor: 'pointer' }} onClick={() => setActiveCity(city.name)}>
                  <circle cx={city.x} cy={city.y} r={isActive ? 30 : 17}
                    fill={isActive ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.13)'}
                    className={isActive ? 'city-pulse' : ''} />
                  <circle cx={city.x} cy={city.y} r={isActive ? 14 : 8}
                    fill={isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.42)'} />
                  <circle cx={city.x} cy={city.y} r={isActive ? 6 : 3.5} fill="white" />
                </g>
              )
            })}

            {CITIES.map(city => {
              const isActive = activeCity === city.name
              if (!isActive && !city.showLabel) return null
              const lw = 200, lh = 58
              const lx = city.labelRight ? city.x + 24 : city.x - lw - 24
              const ly = city.y - lh / 2
              return (
                <g key={`lbl-${city.name}`}>
                  <rect x={lx} y={ly} width={lw} height={lh} rx={10} fill="white"
                    style={{ filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.18))' }} />
                  <text x={lx + 14} y={ly + 23} fontSize={15} fontWeight="700"
                    fill="#111" fontFamily="system-ui, sans-serif">{city.name}</text>
                  <text x={lx + 14} y={ly + 41} fontSize={12}
                    fill="#888" fontFamily="system-ui, sans-serif">
                    {city.count.toLocaleString('fr-FR')} {t('morocco_hero.city_available')}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>
      </div>

      {/* ── Left: Content — sits above the map ── */}
      <div
        className="relative flex flex-col justify-center px-10 py-20 lg:px-20"
        style={{ zIndex: 10, maxWidth: '780px', minHeight: '100svh' }}
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black mb-8"
          style={{
            color: dark ? '#f1f5f9' : '#111',
            fontSize: 'clamp(4rem, 5.8vw, 6rem)',
            lineHeight: 0.91,
            letterSpacing: '-0.025em',
          }}
        >
          {t('morocco_hero.title_line1')}
          <br />
          {t('morocco_hero.title_line2')}
          <br />
          <em style={{
            fontStyle: 'italic',
            fontFamily: 'Georgia, "Palatino Linotype", serif',
            fontWeight: 400,
            letterSpacing: '-0.01em',
          }}>
            {t('morocco_hero.title_line3')}
          </em>
          <br />
          {/* dir="ltr" isolates RotatingText from RTL page direction — prevents character reversal */}
          <span dir="ltr" style={{ display: 'inline-block' }}>
            <RotatingText
              texts={[t('morocco_hero.rotate_1'), t('morocco_hero.rotate_2'), t('morocco_hero.rotate_3')]}
              mainClassName="text-white font-black overflow-hidden"
              splitLevelClassName="overflow-hidden"
              style={{
                backgroundColor: '#ff6700',
                borderRadius: '16px',
                paddingLeft: '0.26em',
                paddingRight: '0.26em',
                paddingTop: '0.04em',
                paddingBottom: '0.08em',
                lineHeight: 1,
              }}
              staggerFrom="last"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.025}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2500}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mb-8 text-[16px] leading-[1.65]"
          style={{ color: dark ? '#94a3b8' : '#666', maxWidth: '560px' }}
        >
          {t('morocco_hero.subtitle')}
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="flex items-center overflow-hidden mb-8"
          style={{
            background: dark ? '#1e293b' : '#fff',
            borderRadius: '100px',
            maxWidth: '580px',
            boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.10)',
            border: `1.5px solid ${dark ? '#334155' : '#e5e0d8'}`,
          }}
        >
          <div
            className="flex-1 min-w-0 px-6 py-[18px] cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-[3px]"
              style={{ color: '#aaa' }}>
              {t('morocco_hero.search_label')}
            </p>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('morocco_hero.search_placeholder')}
              className={`w-full bg-transparent text-[14px] font-medium outline-none leading-tight ${dark ? 'text-slate-100 placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full font-bold text-white text-[14px] transition-all hover:brightness-110 active:scale-95 flex-shrink-0"
            style={{ backgroundColor: '#ff6700', margin: '6px', padding: '14px 22px', whiteSpace: 'nowrap' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            {t('morocco_hero.search_button')}
          </button>
        </motion.form>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.42 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex items-center">
            {AVATARS.map((av, i) => (
              <div
                key={av.initials}
                className="flex items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{
                  width: 36, height: 36,
                  backgroundColor: av.color,
                  marginLeft: i === 0 ? 0 : -10,
                  border: `2.5px solid ${dark ? '#0f172a' : '#f0ebe3'}`,
                  zIndex: AVATARS.length - i,
                  position: 'relative',
                }}
              >
                {av.initials}
              </div>
            ))}
          </div>
          <div>
            <p className={`text-[13px] font-bold leading-tight ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
              {t('morocco_hero.social_proof')}
            </p>
            <p className="text-[12px]" style={{ color: '#999' }}>
              {t('morocco_hero.social_rating')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 text-[14px] font-semibold transition-all hover:opacity-70"
            style={{ color: dark ? '#94a3b8' : '#555' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {t('morocco_hero.become_renter')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
