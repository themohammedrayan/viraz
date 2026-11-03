/**
 * Shopping bag state. Only product/size ids and quantities are stored — names
 * and prices are always looked up from the catalogue, so a tampered
 * localStorage entry can never change what a customer is charged.
 */
export type BagLine = { productId: string; sizeId: string; qty: number }
export type BagState = { lines: BagLine[] }

export type BagAction =
  | { type: 'add'; productId: string; sizeId: string; qty?: number }
  | { type: 'setQty'; productId: string; sizeId: string; qty: number }
  | { type: 'remove'; productId: string; sizeId: string }
  | { type: 'clear' }
  | { type: 'hydrate'; state: unknown; isValid: (productId: string, sizeId: string) => boolean }

export const MAX_QTY = 20
export const MAX_LINES = 40
export const emptyBag: BagState = { lines: [] }

const same = (l: BagLine, productId: string, sizeId: string) => l.productId === productId && l.sizeId === sizeId
const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(Number.isFinite(n) ? n : 1)))

export function bagReducer(state: BagState, a: BagAction): BagState {
  switch (a.type) {
    case 'add': {
      const add = clampQty(a.qty ?? 1)
      if (state.lines.some((l) => same(l, a.productId, a.sizeId))) {
        return { lines: state.lines.map((l) => (same(l, a.productId, a.sizeId) ? { ...l, qty: clampQty(l.qty + add) } : l)) }
      }
      if (state.lines.length >= MAX_LINES) return state
      return { lines: [...state.lines, { productId: a.productId, sizeId: a.sizeId, qty: add }] }
    }
    case 'setQty':
      return { lines: state.lines.map((l) => (same(l, a.productId, a.sizeId) ? { ...l, qty: clampQty(a.qty) } : l)) }
    case 'remove':
      return { lines: state.lines.filter((l) => !same(l, a.productId, a.sizeId)) }
    case 'clear':
      return emptyBag
    case 'hydrate':
      return sanitize(a.state, a.isValid)
  }
}

/** Defensive parse of persisted state — localStorage content is untrusted. */
export function sanitize(raw: unknown, isValid: (productId: string, sizeId: string) => boolean): BagState {
  if (!raw || typeof raw !== 'object' || !Array.isArray((raw as BagState).lines)) return emptyBag
  const out: BagLine[] = []
  for (const l of (raw as BagState).lines) {
    if (!l || typeof l.productId !== 'string' || typeof l.sizeId !== 'string') continue
    if (!isValid(l.productId, l.sizeId)) continue
    if (out.some((x) => same(x, l.productId, l.sizeId))) continue
    out.push({ productId: l.productId, sizeId: l.sizeId, qty: clampQty(Number(l.qty)) })
    if (out.length >= MAX_LINES) break
  }
  return { lines: out }
}

export const itemCount = (s: BagState) => s.lines.reduce((n, l) => n + l.qty, 0)
