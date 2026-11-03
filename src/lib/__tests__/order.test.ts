import { describe, expect, it } from 'vitest'
import {
  formatEnquiry, formatOrder, isPhone, isPin, makeRef, orderWhatsappUrl, priceLines, validateEnquiry, validateOrder, type Order,
} from '../order'
import { findSize } from '@/content/products'

const flora = findSize('golden-flora', '50ml')!.s.mrp
const aloe = findSize('aloe-vera', '1x125g')!.s.mrp

function order(over: Partial<Order> = {}): Order {
  const { lines, subtotal } = priceLines([
    { productId: 'golden-flora', sizeId: '50ml', qty: 1 },
    { productId: 'aloe-vera', sizeId: '1x125g', qty: 2 },
  ])
  return {
    ref: 'VZ-261103-ABCD', lines, subtotal, name: 'Asha Menon', phone: '98470 12345', email: '',
    address: '12 MG Road, Near Park', city: 'Kochi', state: 'Kerala', pin: '682 011', payment: 'upi', ...over,
  }
}

describe('priceLines', () => {
  it('prices from the catalogue and skips unknown items', () => {
    const r = priceLines([
      { productId: 'golden-flora', sizeId: '50ml', qty: 1 },
      { productId: 'aloe-vera', sizeId: '1x125g', qty: 2 },
      { productId: 'ghost', sizeId: 'x', qty: 3 },
    ])
    expect(r.lines).toHaveLength(2)
    expect(r.lines[1]).toMatchObject({ name: 'Aloe Vera Beauty Soap', size: '125 g', unit: aloe, total: aloe * 2 })
    expect(r.subtotal).toBe(flora + aloe * 2)
  })
})

describe('validation', () => {
  it('accepts a complete order', () => {
    expect(validateOrder(order())).toEqual({})
  })
  it('flags missing and malformed fields', () => {
    const e = validateOrder(order({ name: ' ', phone: '12345', email: 'bad@', address: 'x', city: '', state: '', pin: '012345', lines: [] }))
    expect(e).toEqual({ name: true, phone: true, email: true, address: true, city: true, state: true, pin: true, lines: true })
  })
  it('phone and PIN rules', () => {
    expect(isPhone('+91 98470-12345')).toBe(true)
    expect(isPhone('09847012345')).toBe(true)
    expect(isPhone('+971 50 123 4567')).toBe(true)
    expect(isPhone('5847012345')).toBe(false)
    expect(isPin('673008')).toBe(true)
    expect(isPin('67300')).toBe(false)
  })
})

describe('formatting', () => {
  it('makes deterministic references', () => {
    expect(makeRef('VZ', new Date(Date.UTC(2026, 10, 3)), () => 0)).toBe('VZ-261103-AAAA')
  })

  it('writes a readable WhatsApp order with totals and address', () => {
    const text = formatOrder(order({ notes: 'Gift wrap please' }))
    expect(text).toContain('Ref: VZ-261103-ABCD')
    expect(text).toContain(`1. Golden Flora (50 ml) × 1 — ₹${flora.toLocaleString('en-IN')}`)
    expect(text).toContain('2. Aloe Vera Beauty Soap (125 g) × 2')
    expect(text).toContain(`Subtotal (MRP): ₹${(flora + aloe * 2).toLocaleString('en-IN')}`)
    expect(text).toContain('Payment: UPI / online')
    expect(text).toContain('Kochi, Kerala 682011')
    expect(text).toContain('Notes: Gift wrap please')
    expect(text).not.toContain('Email:')
    const url = orderWhatsappUrl(order())
    expect(url.startsWith('https://wa.me/917592030338?text=')).toBe(true)
    expect(decodeURIComponent(url.split('text=')[1])).toBe(formatOrder(order()))
  })

  it('formats wholesale enquiries', () => {
    const e = { ref: 'VZ-W', kind: 'wholesale' as const, name: 'R', business: 'Shop', location: 'Dubai', phone: '+971501234567', interest: ['Perfumes'], message: 'Hi' }
    expect(validateEnquiry(e)).toEqual({})
    expect(formatEnquiry(e)).toContain('Wholesale / distributor — VIRAZ')
    expect(formatEnquiry(e)).toContain('Interested in: Perfumes')
  })
})
