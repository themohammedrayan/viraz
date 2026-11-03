'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { href, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { useBag } from '@/lib/bag-store'
import { itemCount } from '@/lib/bag-reducer'
import { LangSwitch } from './LangSwitch'
import { buttonClass, cx } from './ui'

export function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const pathname = usePathname() || `/${locale}`
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { state, ready } = useBag()
  const count = ready ? itemCount(state) : 0

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const rest = pathname.replace(/^\/(en|ar)(?=\/|$)/, '')
  const isActive = (p: string) => (p === '' ? rest === '' : rest === p || rest.startsWith(p + '/'))
  const nav = [
    { path: '/shop/perfumes', label: t.nav.perfumes },
    { path: '/shop/soaps', label: t.nav.soaps },
    { path: '/shop/cosmetics', label: t.nav.cosmetics },
    { path: '/about', label: t.nav.about },
    { path: '/wholesale', label: t.nav.wholesale },
    { path: '/contact', label: t.nav.contact },
  ]

  return (
    <header className={cx('sticky top-0 z-50 bg-noir-950/95 text-white backdrop-blur transition-shadow', scrolled ? 'shadow-[0_8px_30px_-12px_rgb(0_0_0/0.6)]' : '')}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-noir-950">
        {t.nav.skip}
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-[78rem] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href={href(locale)} className="flex shrink-0 items-center gap-3" aria-label="VIRAZ — home">
          <Image src="/images/brand/viraz-mark.webp" alt="" width={320} height={278} priority sizes="72px" className="h-11 w-auto lg:h-12" />
          <span className="hidden font-display text-xl font-semibold tracking-[0.3em] text-gold-300 sm:inline">VIRAZ</span>
        </Link>

        <nav aria-label="Main" className="hidden h-full lg:block">
          <ul className="flex h-full items-stretch">
            {nav.map((n) => (
              <li key={n.path}>
                <Link
                  href={href(locale, n.path)}
                  aria-current={isActive(n.path) ? 'page' : undefined}
                  className={cx(
                    'relative flex h-full items-center px-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors xl:px-4',
                    'after:absolute after:inset-x-3 after:bottom-5 after:h-px after:origin-center after:scale-x-0 after:bg-gold-400 after:transition-transform hover:after:scale-x-100',
                    isActive(n.path) ? 'text-gold-300 after:scale-x-100' : 'text-white/80 hover:text-gold-300',
                  )}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LangSwitch locale={locale} className="hidden rounded-full px-3 py-2 text-xs font-semibold text-white/80 hover:text-gold-300 sm:inline-flex" />
          <Link href={href(locale, '/bag')} className="relative rounded-full p-2.5 text-white hover:bg-white/10" aria-label={`${t.nav.bag} (${count})`}>
            <ShoppingBag className="size-6" strokeWidth={1.5} aria-hidden />
            {count > 0 && (
              <span className="absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[0.68rem] font-bold text-noir-950 tabular-nums">{count}</span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2.5 text-white hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.close : t.nav.menu}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

      <div id="mobile-nav" hidden={!open} className="h-[calc(100dvh-4.5rem)] overflow-y-auto bg-noir-950 px-4 pb-10 lg:hidden">
        <nav aria-label="Mobile">
          <ul>
            {[{ path: '/shop', label: t.nav.shop }, ...nav, { path: '/faq', label: t.nav.faq }].map((n) => (
              <li key={n.path} className="border-b border-white/10">
                <Link href={href(locale, n.path)} className={cx('block py-4 font-display text-2xl', isActive(n.path) ? 'text-gold-300' : 'text-white')}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-col gap-3">
          <Link href={href(locale, '/bag')} className={buttonClass('gold')}>{t.nav.bag} ({count})</Link>
          <LangSwitch locale={locale} className={buttonClass('light')} />
        </div>
      </div>
    </header>
  )
}
