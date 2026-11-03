import { site, inr } from '@/content/site'
import { findSize } from '@/content/products'
import type { BagLine } from './bag-reducer'

export type PricedLine = {
  productId: string
  sizeId: string
  name: string
  size: string
  qty: number
  unit: number
  total: number
}

/** Resolve bag lines against the catalogue (English names, so orders read the same for the team). */
export function priceLines(lines: BagLine[]): { lines: PricedLine[]; subtotal: number } {
  const out: PricedLine[] = []
  for (const l of lines) {
    const r = findSize(l.productId, l.sizeId)
    if (!r) continue
    out.push({ productId: l.productId, sizeId: l.sizeId, name: r.p.name.en, size: r.s.label.en, qty: l.qty, unit: r.s.mrp, total: r.s.mrp * l.qty })
  }
  return { lines: out, subtotal: out.reduce((n, l) => n + l.total, 0) }
}

export type Payment = 'upi' | 'cod' | 'bank'

export type Order = {
  ref: string
  lines: PricedLine[]
  subtotal: number
  name: string
  phone: string
  email?: string
  address: string
  city: string
  state: string
  pin: string
  payment: Payment
  notes?: string
}

export type OrderErrors = Partial<Record<'name' | 'phone' | 'email' | 'address' | 'city' | 'state' | 'pin' | 'lines', true>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Indian mobile (10 digits starting 6–9) with optional +91/0, or any international number of 8–15 digits. */
export function isPhone(v: string) {
  const d = v.replace(/[\s\-().]/g, '')
  return /^(\+?91|0)?[6-9]\d{9}$/.test(d) || /^\+\d{8,15}$/.test(d)
}
export const isPin = (v: string) => /^[1-9]\d{5}$/.test(v.replace(/\s/g, ''))

export function validateOrder(o: Order): OrderErrors {
  const e: OrderErrors = {}
  if (!o.lines.length) e.lines = true
  if (!o.name.trim()) e.name = true
  if (!isPhone(o.phone)) e.phone = true
  if (o.email?.trim() && !EMAIL_RE.test(o.email.trim())) e.email = true
  if (o.address.trim().length < 6) e.address = true
  if (!o.city.trim()) e.city = true
  if (!o.state.trim()) e.state = true
  if (!isPin(o.pin)) e.pin = true
  return e
}

/** Reference like VZ-261103-K7Q2. `now` and `rand` are injectable for tests. */
export function makeRef(prefix = 'VZ', now: Date = new Date(), rand: () => number = Math.random): string {
  const yy = String(now.getUTCFullYear()).slice(2)
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(now.getUTCDate()).padStart(2, '0')
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let tail = ''
  for (let i = 0; i < 4; i++) tail += alphabet[Math.floor(rand() * alphabet.length)]
  return `${prefix}-${yy}${mm}${dd}-${tail}`
}

const PAYMENT_LABEL: Record<Payment, string> = {
  upi: 'UPI / online',
  cod: 'Cash on delivery',
  bank: 'Bank transfer',
}

/** Plain-text order, always with English labels so the team processes every message the same way. */
export function formatOrder(o: Order): string {
  const out: string[] = []
  out.push(`New order — ${site.name}`)
  out.push(`Ref: ${o.ref}`)
  out.push('')
  o.lines.forEach((l, i) => out.push(`${i + 1}. ${l.name} (${l.size}) × ${l.qty} — ${inr(l.total)}`))
  out.push('')
  out.push(`Subtotal (MRP): ${inr(o.subtotal)}`)
  out.push('Delivery: to be confirmed')
  out.push(`Payment: ${PAYMENT_LABEL[o.payment]}`)
  out.push('')
  out.push(`Name: ${o.name.trim()}`)
  out.push(`Phone: ${o.phone.trim()}`)
  if (o.email?.trim()) out.push(`Email: ${o.email.trim()}`)
  out.push('Deliver to:')
  out.push(o.address.trim())
  out.push(`${o.city.trim()}, ${o.state.trim()} ${o.pin.replace(/\s/g, '')}`)
  if (o.notes?.trim()) {
    out.push('')
    out.push(`Notes: ${o.notes.trim()}`)
  }
  return out.join('\n')
}

export const orderWhatsappUrl = (o: Order) => `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(formatOrder(o))}`
export const orderMailtoUrl = (o: Order) =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(`Order ${o.ref} — ${o.name.trim()}`)}&body=${encodeURIComponent(formatOrder(o))}`

/* ---------------- Wholesale / gifting enquiries ---------------- */

export type EnquiryKind = 'wholesale' | 'gifting' | 'corporate' | 'other'
export type Enquiry = {
  ref: string
  kind: EnquiryKind
  name: string
  business?: string
  location: string
  phone: string
  email?: string
  interest: string[]
  quantity?: string
  message?: string
}
export type EnquiryErrors = Partial<Record<'name' | 'location' | 'phone' | 'email', true>>

export function validateEnquiry(e: Enquiry): EnquiryErrors {
  const err: EnquiryErrors = {}
  if (!e.name.trim()) err.name = true
  if (!e.location.trim()) err.location = true
  if (!isPhone(e.phone)) err.phone = true
  if (e.email?.trim() && !EMAIL_RE.test(e.email.trim())) err.email = true
  return err
}

const KIND_LABEL: Record<EnquiryKind, string> = {
  wholesale: 'Wholesale / distributor',
  gifting: 'Wedding & event gifting',
  corporate: 'Corporate gifting',
  other: 'General enquiry',
}

export function formatEnquiry(e: Enquiry): string {
  const out = [`${KIND_LABEL[e.kind]} — ${site.name}`, `Ref: ${e.ref}`, '']
  const f = (k: string, v?: string) => { if (v?.trim()) out.push(`${k}: ${v.trim()}`) }
  f('Name', e.name)
  f('Business', e.business)
  f('Location', e.location)
  f('Phone', e.phone)
  f('Email', e.email)
  if (e.interest.length) out.push(`Interested in: ${e.interest.join(', ')}`)
  f('Quantity', e.quantity)
  if (e.message?.trim()) out.push('', 'Message:', e.message.trim())
  return out.join('\n')
}

export const enquiryWhatsappUrl = (e: Enquiry) => `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(formatEnquiry(e))}`
export const enquiryMailtoUrl = (e: Enquiry) =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(`${KIND_LABEL[e.kind]} ${e.ref}${e.business ? ` — ${e.business}` : ''}`)}&body=${encodeURIComponent(formatEnquiry(e))}`
