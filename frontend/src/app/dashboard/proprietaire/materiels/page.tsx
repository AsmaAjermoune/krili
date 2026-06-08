// frontend/src/app/dashboard/proprietaire/materiels/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Package, Grid, List } from 'lucide-react'
import { getMyMateriels, deleteMateriel, updateMateriel, formatPrice, getMaterielImage, type Materiel } from '@/lib/api'

const ETAT: Record<string, string> = { neuf: 'Neuf', bon_etat: 'Bon état', usage: 'Usagé' }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const card      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function MesMaterielsPage() {
  const [items,    setItems]    = useState<Materiel[]>([])
  const [loading,  setLoading]  = useState(true)
  const [view,     setView]     = useState<'grid' | 'list'>('grid')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    getMyMateriels()
      .then(d => setItems(d.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  async function toggle(m: Materiel) {
    setToggling(m._id)
    try {
      await updateMateriel(m._id, { disponible: !m.disponible } as Partial<Materiel>)
      setItems(prev => prev.map(x => x._id === m._id ? { ...x, disponible: !x.disponible } : x))
    } catch { /* swallow */ }
    setToggling(null)
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce matériel ? Cette action est irréversible.')) return
    setDeleting(id)
    try {
      await deleteMateriel(id)
      setItems(prev => prev.filter(x => x._id !== id))
    } catch { /* swallow */ }
    setDeleting(null)
  }

  const imgSrc = (m: Materiel) => getMaterielImage(m) ?? '/placeholder.jpg'

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Mes Matériels</h1>
          <p className="mt-1 text-[#64748b]">
            {items.length} annonce{items.length !== 1 ? 's' : ''} publiée{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-lg bg-[#f1f5f9] p-1 sm:flex">
            {(['grid', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`rounded-md p-1.5 transition-colors ${view === v ? 'bg-white shadow-sm text-[#004e98]' : 'text-[#64748b] hover:text-[#1a1a2e]'}`}
              >
                {v === 'grid' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            ))}
          </div>
          <Link href="/dashboard/proprietaire/ajouter"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ff6700] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e55c00]"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </Link>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-[#e2e8f0]" />
          <h2 className="mb-2 text-lg font-semibold text-[#1a1a2e]">Aucun matériel publié</h2>
          <p className="mb-6 text-[#64748b]">Commencez à gagner de l&apos;argent en louant votre matériel</p>
          <Link href="/dashboard/proprietaire/ajouter"
            className="inline-flex items-center gap-2 rounded-xl bg-[#004e98] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#003a72]"
          >
            <Plus className="h-4 w-4" /> Ajouter un matériel
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show"
          className={view === 'grid'
            ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
            : 'space-y-3'
          }
        >
          {items.map(m => (
            <motion.div key={m._id} variants={card}
              className={`overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white transition-shadow hover:shadow-md ${view === 'list' ? 'flex items-center gap-4 p-4' : ''}`}
            >
              {view === 'grid' ? (
                <>
                  <div className="relative h-44 bg-[#f1f5f9]">
                    <Image src={imgSrc(m)} alt={m.nom} fill className="object-cover"
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      m.disponible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {m.disponible ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 truncate font-semibold text-[#1a1a2e]">{m.nom}</h3>
                    <p className="mb-3 text-xs text-[#64748b]">{m.localisation} · {ETAT[m.etat ?? ''] ?? m.etat}</p>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-bold text-[#ff6700]">
                        {formatPrice(m.prixParJour)}<span className="ml-1 text-xs font-normal text-[#64748b]">/jr</span>
                      </span>
                      {(m.caution ?? 0) > 0 && <span className="text-xs text-[#64748b]">Caution {formatPrice(m.caution!)}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggle(m)} disabled={toggling === m._id}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          m.disponible ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {m.disponible ? <><ToggleRight className="h-4 w-4" /> Dispo</> : <><ToggleLeft className="h-4 w-4" /> Indispo</>}
                      </button>
                      <Link href={`/dashboard/proprietaire/materiels/${m._id}/edit`}
                        className="rounded-lg bg-[#f1f5f9] p-2 text-[#64748b] transition-colors hover:bg-[#004e98]/10 hover:text-[#004e98]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button onClick={() => remove(m._id)} disabled={deleting === m._id}
                        className="rounded-lg bg-[#f1f5f9] p-2 text-[#64748b] transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f1f5f9]">
                    <Image src={imgSrc(m)} alt={m.nom} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-[#1a1a2e]">{m.nom}</h3>
                    <p className="text-xs text-[#64748b]">{m.localisation} · {ETAT[m.etat ?? ''] ?? m.etat}</p>
                    <span className="text-sm font-bold text-[#ff6700]">{formatPrice(m.prixParJour)}/jr</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button onClick={() => toggle(m)} disabled={toggling === m._id}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        m.disponible ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {m.disponible ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </button>
                    <Link href={`/dashboard/proprietaire/materiels/${m._id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b] transition-colors hover:bg-[#004e98]/10 hover:text-[#004e98]"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button onClick={() => remove(m._id)} disabled={deleting === m._id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b] transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
