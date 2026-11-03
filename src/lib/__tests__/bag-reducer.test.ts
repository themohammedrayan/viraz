import { describe, expect, it } from 'vitest'
import { bagReducer, emptyBag, itemCount, MAX_QTY, sanitize } from '../bag-reducer'
import { findSize } from '@/content/products'

const valid = (p: string, s: string) => !!findSize(p, s)

describe('bagReducer', () => {
  it('adds a line and merges repeat adds of the same size', () => {
    let s = bagReducer(emptyBag, { type: 'add', productId: 'oud', sizeId: '50ml' })
    s = bagReducer(s, { type: 'add', productId: 'oud', sizeId: '50ml', qty: 2 })
    expect(s.lines).toEqual([{ productId: 'oud', sizeId: '50ml', qty: 3 }])
  })

  it('keeps different sizes of one product as separate lines', () => {
    let s = bagReducer(emptyBag, { type: 'add', productId: 'oud', sizeId: '50ml' })
    s = bagReducer(s, { type: 'add', productId: 'oud', sizeId: '100ml' })
    expect(s.lines).toHaveLength(2)
    expect(itemCount(s)).toBe(2)
  })

  it('clamps quantities between 1 and MAX_QTY', () => {
    let s = bagReducer(emptyBag, { type: 'add', productId: 'rose-soap', sizeId: '1x125g' })
    s = bagReducer(s, { type: 'setQty', productId: 'rose-soap', sizeId: '1x125g', qty: 999 })
    expect(s.lines[0].qty).toBe(MAX_QTY)
    s = bagReducer(s, { type: 'setQty', productId: 'rose-soap', sizeId: '1x125g', qty: 0 })
    expect(s.lines[0].qty).toBe(1)
    s = bagReducer(s, { type: 'setQty', productId: 'rose-soap', sizeId: '1x125g', qty: Number.NaN })
    expect(s.lines[0].qty).toBe(1)
  })

  it('removes and clears', () => {
    let s = bagReducer(emptyBag, { type: 'add', productId: 'rose-soap', sizeId: '1x125g' })
    s = bagReducer(s, { type: 'add', productId: 'milk', sizeId: '1x125g' })
    s = bagReducer(s, { type: 'remove', productId: 'rose-soap', sizeId: '1x125g' })
    expect(s.lines.map((l) => l.productId)).toEqual(['milk'])
    expect(bagReducer(s, { type: 'clear' })).toEqual(emptyBag)
  })
})

describe('sanitize', () => {
  it('drops unknown products, bad shapes and duplicates; repairs quantities', () => {
    const raw = {
      lines: [
        { productId: 'royal', sizeId: '100ml', qty: '2' },
        { productId: 'royal', sizeId: '100ml', qty: 5 },
        { productId: 'not-a-product', sizeId: '50ml', qty: 1 },
        { productId: 'royal', sizeId: '5ml', qty: 1 },
        { productId: 7, sizeId: '50ml' },
        null,
        { productId: 'charcoal', sizeId: '3x125g', qty: 1e9 },
      ],
    }
    expect(sanitize(raw, valid).lines).toEqual([
      { productId: 'royal', sizeId: '100ml', qty: 2 },
      { productId: 'charcoal', sizeId: '3x125g', qty: MAX_QTY },
    ])
  })

  it('returns an empty bag for garbage', () => {
    expect(sanitize('nope', valid)).toEqual(emptyBag)
    expect(sanitize({ lines: 'x' }, valid)).toEqual(emptyBag)
    expect(sanitize(null, valid)).toEqual(emptyBag)
  })
})
