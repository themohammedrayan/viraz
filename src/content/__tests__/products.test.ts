import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { allProducts, categories, findSize } from '../products'
import dims from '../image-dims.json'

describe('catalogue', () => {
  it('has globally unique product ids (bag and order lookups are by id)', () => {
    const ids = allProducts.map((x) => x.p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has the ten VIRAZ eau de parfums from the range poster', () => {
    expect(categories.find((c) => c.slug === 'perfumes')!.items.map((p) => p.id)).toEqual(
      ['oud', 'amber', 'blue', 'royal', 'floral', 'rose', 'musk', 'oudh', 'silver', 'zen'],
    )
  })

  it('every product has an image on disk, sizes with positive prices, and EN+AR text', () => {
    for (const { p } of allProducts) {
      expect(existsSync(path.join(import.meta.dirname, '../../../public', p.image)), p.image).toBe(true)
      expect((dims as Record<string, number[]>)[p.image], `${p.image} in image-dims.json`).toBeDefined()
      expect(p.sizes.length).toBeGreaterThan(0)
      for (const s of p.sizes) {
        expect(s.mrp).toBeGreaterThan(0)
        expect(findSize(p.id, s.id)?.p.id).toBe(p.id)
      }
      for (const v of [p.name, p.tagline, p.description, p.howTo]) {
        expect(v.en.trim()).not.toBe('')
        expect(v.ar.trim()).not.toBe('')
      }
    }
  })
})
