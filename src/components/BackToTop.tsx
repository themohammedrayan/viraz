'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import type { Locale } from '@/i18n/config'

/** Floating button (stacked above the WhatsApp button) that scrolls back to the top of the page. */
export function BackToTop({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={locale === 'ar' ? 'العودة إلى الأعلى' : 'Back to top'}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-[5.5rem] end-[26px] z-40 grid size-11 place-items-center rounded-full bg-noir-900 text-gold-300 shadow-lift ring-4 ring-ivory transition duration-300 hover:bg-gold-500 hover:text-noir-950 sm:bottom-24 sm:end-[30px] ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  )
}
