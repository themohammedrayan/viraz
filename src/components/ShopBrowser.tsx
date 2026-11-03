'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { tr, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { categories } from '@/content/products'
import { ProductCard } from './ProductCard'
import { cx } from './ui'

/** Client-side search + category filter over the static catalogue. */
export function ShopBrowser({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const [cat, setCat] = useState<string>('all')
  const [q, setQ] = useState('')
  const live = categories.filter((c) => c.items.length)
  const all = useMemo(() => live.flatMap((c) => c.items.map((p) => ({ c, p }))), [live])
  const needle = q.trim().toLowerCase()
  const list = all.filter(({ c, p }) =>
    (cat === 'all' || c.slug === cat) &&
    (!needle || [p.name, p.tagline, c.name, ...p.notes, ...p.benefits].some((x) => x.en.toLowerCase().includes(needle) || x.ar.includes(q.trim()))),
  )
  const chip = (active: boolean) =>
    cx('shrink-0 rounded-full border px-4 py-2 text-sm transition', active ? 'border-noir-900 bg-noir-900 text-white' : 'border-line bg-white text-ink hover:border-noir-900')
  const perfumes = list.filter((x) => x.c.slug === 'perfumes')
  const others = list.filter((x) => x.c.slug !== 'perfumes')

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={t.shop.all} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          <button type="button" aria-pressed={cat === 'all'} onClick={() => setCat('all')} className={chip(cat === 'all')}>
            {t.shop.all} <span className="opacity-60">({all.length})</span>
          </button>
          {live.map((c) => (
            <button key={c.slug} type="button" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)} className={chip(cat === c.slug)}>
              {tr(c.name, locale)} <span className="opacity-60">({c.items.length})</span>
            </button>
          ))}
        </div>
        <label className="relative block lg:w-80">
          <span className="sr-only">{t.shop.search}</span>
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.shop.searchPh}
            className="w-full rounded-full border border-line bg-white py-2.5 pe-10 ps-10 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label="Clear" className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-ink">
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>
      <p className="mb-6 text-sm text-muted" aria-live="polite">{t.shop.count(list.length)}</p>
      {list.length ? (
        <div className="space-y-14">
          {perfumes.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
              {perfumes.map(({ c, p }) => <ProductCard key={p.id} c={c} p={p} locale={locale} reveal={false} />)}
            </div>
          )}
          {others.length > 0 && (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map(({ c, p }) => <ProductCard key={p.id} c={c} p={p} locale={locale} reveal={false} />)}
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">{t.shop.none}</p>
      )}
    </div>
  )
}
