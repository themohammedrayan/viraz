'use client'

import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from 'react'
import { findSize } from '@/content/products'
import { bagReducer, emptyBag, type BagAction, type BagState } from './bag-reducer'

const KEY = 'viraz.bag.v1'
const isValid = (p: string, s: string) => !!findSize(p, s)

type Ctx = { state: BagState; dispatch: (a: BagAction) => void; ready: boolean }
const BagCtx = createContext<Ctx | null>(null)

export function BagProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bagReducer, emptyBag)
  const [ready, setReady] = useState(false)
  const hydrated = useRef(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) dispatch({ type: 'hydrate', state: JSON.parse(raw), isValid })
    } catch {
      /* storage unavailable or corrupt: start empty */
    }
    hydrated.current = true
    setReady(true)
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* private mode / quota: the bag still works for this visit */
    }
  }, [state])

  return <BagCtx.Provider value={{ state, dispatch, ready }}>{children}</BagCtx.Provider>
}

export function useBag() {
  const c = useContext(BagCtx)
  if (!c) throw new Error('useBag must be used inside <BagProvider>')
  return c
}
