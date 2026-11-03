'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Lock, Mail, Trash2 } from 'lucide-react'
import { href, tr, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { findSize } from '@/content/products'
import { inr, site } from '@/content/site'
import { useBag } from '@/lib/bag-store'
import {
  makeRef, orderMailtoUrl, orderWhatsappUrl, priceLines, validateOrder, type Order, type OrderErrors, type Payment,
} from '@/lib/order'
import { QtyStepper } from './AddToBag'
import { perfumeImg, perfumeStage } from './ProductCard'
import { Img } from './Img'
import { WhatsAppIcon } from './Icon'
import { buttonClass, cx, Field, inputClass } from './ui'

type Form = Omit<Order, 'ref' | 'lines' | 'subtotal'>
const emptyForm: Form = { name: '', phone: '', email: '', address: '', city: '', state: 'Kerala', pin: '', payment: 'upi', notes: '' }

export function BagView({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const { state, dispatch, ready } = useBag()
  const [f, setF] = useState<Form>(emptyForm)
  const [errors, setErrors] = useState<OrderErrors>({})
  const [ref, setRef] = useState<string | null>(null)
  const priced = useMemo(() => priceLines(state.lines), [state.lines])
  const set = <K extends keyof Form>(k: K) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }))

  const build = (): Order | null => {
    const o: Order = { ...f, ref: ref ?? makeRef(), lines: priced.lines, subtotal: priced.subtotal }
    const e = validateOrder(o)
    setErrors(e)
    if (Object.keys(e).length) {
      const first = document.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)
      first?.focus()
      return null
    }
    setRef(o.ref)
    return o
  }

  if (!ready) return <div className="h-64 animate-pulse rounded-2xl bg-sand" aria-busy="true" />

  if (!state.lines.length) {
    return (
      <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-card">
        <p className="font-display text-3xl text-noir-900">{t.bag.empty}</p>
        <Link href={href(locale, '/shop')} className={buttonClass('gold', 'mt-8')}>{t.bag.emptyCta}</Link>
      </div>
    )
  }

  const pays: [Payment, string][] = [['upi', t.bag.payUpi], ['cod', t.bag.payCod], ['bank', t.bag.payBank]]

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_26rem]">
      <div>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-white shadow-card">
          {state.lines.map((l) => {
            const r = findSize(l.productId, l.sizeId)
            if (!r) return null
            return (
              <li key={`${l.productId}:${l.sizeId}`} className="flex gap-4 p-4 sm:p-5">
                <Link href={href(locale, `/shop/${r.c.slug}/${r.p.id}`)} className={cx('relative shrink-0 overflow-hidden rounded-xl', r.c.slug === 'perfumes' ? cx('h-28 w-20', perfumeStage) : 'h-20 w-28 bg-sand')}>
                  <Img src={r.p.image} alt={tr(r.p.name, locale)} fill sizes="112px" className={r.c.slug === 'perfumes' ? perfumeImg : 'object-cover'} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-display text-xl font-semibold leading-tight text-noir-900">{tr(r.p.name, locale)}</p>
                    <p className="mt-0.5 text-sm text-muted">{tr(r.s.label, locale)} · {inr(r.s.mrp)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <QtyStepper value={l.qty} onChange={(qty) => dispatch({ type: 'setQty', productId: l.productId, sizeId: l.sizeId, qty })} label={t.product.qty} />
                    <p className="w-20 text-end font-semibold tabular-nums">{inr(r.s.mrp * l.qty)}</p>
                    <button type="button" onClick={() => dispatch({ type: 'remove', productId: l.productId, sizeId: l.sizeId })} className="rounded-full p-2 text-muted hover:bg-sand hover:text-red-700" aria-label={`${t.bag.remove}: ${tr(r.p.name, locale)}`}>
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href={href(locale, '/shop')} className="font-semibold text-gold-700 underline-offset-4 hover:underline">← {t.common.backToShop}</Link>
          <button type="button" onClick={() => dispatch({ type: 'clear' })} className="text-muted hover:text-red-700">{t.bag.clear}</button>
        </div>

        <form
          className="mt-10 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            const o = build()
            if (o) window.open(orderWhatsappUrl(o), '_blank', 'noopener,noreferrer')
          }}
        >
          <h2 className="font-display text-3xl font-semibold text-noir-900">{t.bag.details}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label={t.bag.name} error={errors.name && t.bag.errors.name}>
              <input name="name" autoComplete="name" value={f.name} onChange={set('name')} className={inputClass(errors.name)} aria-invalid={!!errors.name} />
            </Field>
            <Field label={t.bag.phone} error={errors.phone && t.bag.errors.phone}>
              <input name="phone" type="tel" dir="ltr" autoComplete="tel" inputMode="tel" placeholder="+91" value={f.phone} onChange={set('phone')} className={inputClass(errors.phone)} aria-invalid={!!errors.phone} />
            </Field>
            <Field label={t.bag.address} error={errors.address && t.bag.errors.address} className="sm:col-span-2">
              <textarea name="address" rows={2} autoComplete="street-address" value={f.address} onChange={set('address')} className={inputClass(errors.address)} aria-invalid={!!errors.address} />
            </Field>
            <Field label={t.bag.city} error={errors.city && t.bag.errors.city}>
              <input name="city" autoComplete="address-level2" value={f.city} onChange={set('city')} className={inputClass(errors.city)} aria-invalid={!!errors.city} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t.bag.state} error={errors.state && t.bag.errors.state}>
                <input name="state" autoComplete="address-level1" value={f.state} onChange={set('state')} className={inputClass(errors.state)} aria-invalid={!!errors.state} />
              </Field>
              <Field label={t.bag.pin} error={errors.pin && t.bag.errors.pin}>
                <input name="pin" dir="ltr" autoComplete="postal-code" inputMode="numeric" maxLength={7} value={f.pin} onChange={set('pin')} className={inputClass(errors.pin)} aria-invalid={!!errors.pin} />
              </Field>
            </div>
            <Field label={t.bag.email} error={errors.email && t.bag.errors.email} className="sm:col-span-2">
              <input name="email" type="email" dir="ltr" autoComplete="email" value={f.email} onChange={set('email')} className={inputClass(errors.email)} aria-invalid={!!errors.email} />
            </Field>
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-2">{t.bag.payment}</legend>
              <div className="flex flex-wrap gap-2">
                {pays.map(([v, label]) => (
                  <label key={v} className={cx('cursor-pointer rounded-full border px-4 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400', f.payment === v ? 'border-noir-900 bg-noir-900 text-white' : 'border-line hover:border-noir-900')}>
                    <input type="radio" name="payment" value={v} checked={f.payment === v} onChange={() => setF((x) => ({ ...x, payment: v }))} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label={t.bag.notes} className="sm:col-span-2">
              <textarea name="notes" rows={2} value={f.notes} onChange={set('notes')} className={inputClass()} />
            </Field>
          </div>
          <button type="submit" className={buttonClass('whatsapp', 'mt-8 w-full py-4')}>
            <WhatsAppIcon className="size-5" /> {t.bag.send}
          </button>
          <button
            type="button"
            className="mx-auto mt-4 flex items-center gap-2 text-sm font-semibold text-gold-700 hover:underline"
            onClick={() => { const o = build(); if (o) window.location.href = orderMailtoUrl(o) }}
          >
            <Mail className="size-4" aria-hidden /> {t.bag.sendEmail}
          </button>
          {ref && (
            <p role="status" className="mt-6 rounded-xl bg-herbal-50 p-4 text-sm text-herbal-800">
              <strong>{t.bag.ref}: <span dir="ltr" className="tabular-nums">{ref}</span></strong><br />{t.bag.sent}
            </p>
          )}
        </form>
      </div>

      <aside className="self-start rounded-2xl bg-noir-950 p-6 text-white shadow-lift sm:p-8 lg:sticky lg:top-28">
        <h2 className="font-display text-3xl font-semibold text-gilded">{t.bag.title}</h2>
        <dl className="mt-6 space-y-3 text-sm">
          {priced.lines.map((l) => (
            <div key={`${l.productId}:${l.sizeId}`} className="flex justify-between gap-4 text-white/75">
              <dt>{tr(findSize(l.productId, l.sizeId)!.p.name, locale)} <span className="text-white/45">× {l.qty}</span></dt>
              <dd className="tabular-nums">{inr(l.total)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-white/15 pt-3 text-white/75">
            <dt>{t.bag.delivery}</dt>
            <dd>{site.freeShippingOver && priced.subtotal >= site.freeShippingOver ? (locale === 'ar' ? 'مجاني' : 'Free') : t.bag.deliveryTbc}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-white/15 pt-3 text-base">
            <dt className="font-semibold">{t.bag.subtotal}</dt>
            <dd className="font-display text-2xl font-semibold tabular-nums text-gold-300">{inr(priced.subtotal)}</dd>
          </div>
        </dl>
        <p className="mt-6 flex gap-2.5 text-xs leading-relaxed text-white/60">
          <Lock className="mt-0.5 size-3.5 shrink-0 text-gold-400" aria-hidden />
          {t.bag.howItWorks}
        </p>
      </aside>
    </div>
  )
}
