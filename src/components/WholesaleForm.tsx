'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { tr, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { categories } from '@/content/products'
import { enquiryMailtoUrl, enquiryWhatsappUrl, makeRef, validateEnquiry, type Enquiry, type EnquiryErrors, type EnquiryKind } from '@/lib/order'
import { WhatsAppIcon } from './Icon'
import { buttonClass, cx, Field, inputClass } from './ui'

type Form = Omit<Enquiry, 'ref'>
const empty: Form = { kind: 'wholesale', name: '', business: '', location: '', phone: '', email: '', interest: [], quantity: '', message: '' }

export function WholesaleForm({ locale }: { locale: Locale }) {
  const t = getDict(locale).wholesale
  const [f, setF] = useState<Form>(empty)
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [ref, setRef] = useState<string | null>(null)
  const set = <K extends keyof Form>(k: K) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }))

  const build = (): Enquiry | null => {
    const e: Enquiry = { ...f, ref: ref ?? makeRef('VZW') }
    const err = validateEnquiry(e)
    setErrors(err)
    if (Object.keys(err).length) {
      document.querySelector<HTMLElement>(`[name="w-${Object.keys(err)[0]}"]`)?.focus()
      return null
    }
    setRef(e.ref)
    return e
  }
  const kinds = Object.entries(t.kinds) as [EnquiryKind, string][]
  const toggle = (name: string) => setF((x) => ({ ...x, interest: x.interest.includes(name) ? x.interest.filter((i) => i !== name) : [...x.interest, name] }))

  return (
    <form
      noValidate
      className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
      onSubmit={(e) => { e.preventDefault(); const q = build(); if (q) window.open(enquiryWhatsappUrl(q), '_blank', 'noopener,noreferrer') }}
    >
      <h2 className="font-display text-3xl font-semibold text-noir-900">{t.form}</h2>
      <fieldset className="mt-6">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-2">{t.kind}</legend>
        <div className="flex flex-wrap gap-2">
          {kinds.map(([k, label]) => (
            <label key={k} className={cx('cursor-pointer rounded-full border px-4 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400', f.kind === k ? 'border-noir-900 bg-noir-900 text-white' : 'border-line hover:border-noir-900')}>
              <input type="radio" name="w-kind" checked={f.kind === k} onChange={() => setF((x) => ({ ...x, kind: k }))} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label={t.name} error={errors.name && t.errors.name}>
          <input name="w-name" autoComplete="name" value={f.name} onChange={set('name')} className={inputClass(errors.name)} aria-invalid={!!errors.name} />
        </Field>
        <Field label={t.business}>
          <input name="w-business" autoComplete="organization" value={f.business} onChange={set('business')} className={inputClass()} />
        </Field>
        <Field label={t.location} error={errors.location && t.errors.location}>
          <input name="w-location" value={f.location} onChange={set('location')} className={inputClass(errors.location)} aria-invalid={!!errors.location} />
        </Field>
        <Field label={t.phone} error={errors.phone && t.errors.phone}>
          <input name="w-phone" type="tel" dir="ltr" autoComplete="tel" value={f.phone} onChange={set('phone')} className={inputClass(errors.phone)} aria-invalid={!!errors.phone} />
        </Field>
        <Field label={t.email} error={errors.email && t.errors.email}>
          <input name="w-email" type="email" dir="ltr" autoComplete="email" value={f.email} onChange={set('email')} className={inputClass(errors.email)} aria-invalid={!!errors.email} />
        </Field>
        <Field label={t.quantity}>
          <input name="w-quantity" value={f.quantity} onChange={set('quantity')} className={inputClass()} />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-2">{t.interest}</legend>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const on = f.interest.includes(c.name.en)
              return (
                <label key={c.slug} className={cx('cursor-pointer rounded-full border px-4 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400', on ? 'border-gold-600 bg-gold-100 text-noir-900' : 'border-line hover:border-noir-900')}>
                  <input type="checkbox" checked={on} onChange={() => toggle(c.name.en)} className="sr-only" />
                  {on ? '✓ ' : ''}{tr(c.name, locale)}
                </label>
              )
            })}
          </div>
        </fieldset>
        <Field label={t.message} className="sm:col-span-2">
          <textarea name="w-message" rows={4} value={f.message} onChange={set('message')} className={inputClass()} />
        </Field>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className={buttonClass('whatsapp', 'flex-1')}><WhatsAppIcon className="size-5" /> {t.send}</button>
        <button type="button" className={buttonClass('outline', 'flex-1')} onClick={() => { const q = build(); if (q) window.location.href = enquiryMailtoUrl(q) }}>
          <Mail className="size-4" aria-hidden /> {t.sendEmail}
        </button>
      </div>
      {ref && <p role="status" className="mt-5 text-sm text-muted">Ref: <span dir="ltr" className="font-semibold tabular-nums text-ink">{ref}</span></p>}
    </form>
  )
}
