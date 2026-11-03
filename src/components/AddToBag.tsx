'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { href, tr, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import type { Product } from '@/content/products'
import { inr } from '@/content/site'
import { useBag } from '@/lib/bag-store'
import { MAX_QTY } from '@/lib/bag-reducer'
import { buttonClass, cx } from './ui'

export function QtyStepper({ value, onChange, label, dark }: { value: number; onChange: (n: number) => void; label: string; dark?: boolean }) {
  const btn = cx('grid size-10 place-items-center rounded-full transition disabled:opacity-30', dark ? 'hover:bg-white/10' : 'hover:bg-sand')
  return (
    <div role="group" aria-label={label} className={cx('inline-flex items-center rounded-full border', dark ? 'border-white/20' : 'border-line bg-white')}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="−1"><Minus className="size-4" /></button>
      <output aria-live="polite" className="w-8 text-center text-sm font-semibold tabular-nums">{value}</output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="+1"><Plus className="size-4" /></button>
    </div>
  )
}

/** Size selector, quantity and Add to bag for a product page. */
export function AddToBag({ locale, product, dark }: { locale: Locale; product: Product; dark?: boolean }) {
  const t = getDict(locale)
  const { dispatch } = useBag()
  const [sizeId, setSizeId] = useState(product.sizes[product.sizes.length > 1 ? 1 : 0].id)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const size = product.sizes.find((s) => s.id === sizeId)!

  return (
    <div>
      <p className={cx('font-display text-4xl font-semibold tabular-nums', dark ? 'text-gold-300' : 'text-noir-900')}>{inr(size.mrp)}</p>
      <p className={cx('mt-1 text-xs', dark ? 'text-white/50' : 'text-muted')}>{t.common.mrpNote}</p>

      <fieldset className="mt-6">
        <legend className={cx('mb-2.5 text-xs font-semibold uppercase tracking-[0.16em]', dark ? 'text-white/70' : 'text-ink-2')}>{t.product.size}</legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const on = s.id === sizeId
            return (
              <label key={s.id} className={cx(
                'cursor-pointer rounded-full border px-4 py-2 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400',
                on ? (dark ? 'border-gold-400 bg-gold-400/10 text-gold-100' : 'border-noir-900 bg-noir-900 text-white') : (dark ? 'border-white/20 text-white/80 hover:border-white/50' : 'border-line bg-white hover:border-noir-900'),
              )}>
                <input type="radio" name={`size-${product.id}`} value={s.id} checked={on} onChange={() => { setSizeId(s.id); setAdded(false) }} className="sr-only" />
                {tr(s.label, locale)}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} onChange={(n) => { setQty(Math.max(1, Math.min(MAX_QTY, n))); setAdded(false) }} label={t.product.qty} dark={dark} />
        <button
          type="button"
          className={buttonClass('gold', 'flex-1 sm:flex-none sm:min-w-56')}
          onClick={() => { dispatch({ type: 'add', productId: product.id, sizeId, qty }); setAdded(true) }}
        >
          {added ? <><Check className="size-4" aria-hidden /> {t.product.added}</> : t.product.add}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-6 text-sm">
        {added && (
          <Link href={href(locale, '/bag')} className={cx('font-semibold underline underline-offset-4', dark ? 'text-gold-300' : 'text-gold-700')}>
            {t.product.viewBag} →
          </Link>
        )}
      </p>
    </div>
  )
}
