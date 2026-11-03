import Link from 'next/link'
import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { href, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { Img } from './Img'
import { Container, Kicker } from './ui'

export type Crumb = { label: string; path?: string }

export function Breadcrumbs({ locale, crumbs, light }: { locale: Locale; crumbs: Crumb[]; light?: boolean }) {
  const t = getDict(locale)
  const trail = [{ label: t.nav.home, path: '/' }, ...crumbs]
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-xs ${light ? 'text-white/60' : 'text-muted'}`}>
        {trail.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="flip-rtl size-3 text-gold-500" aria-hidden />}
            {c.path && i < trail.length - 1
              ? <Link href={href(locale, c.path)} className={light ? 'hover:text-gold-300' : 'hover:text-gold-700'}>{c.label}</Link>
              : <span aria-current="page" className={light ? 'text-gold-300' : 'text-ink'}>{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Inner-page banner: noir with an optional artwork panel on the end side. */
export function PageBanner({
  locale, eyebrow, title, body, image, crumbs = [], children,
}: {
  locale: Locale
  eyebrow?: string
  title: string
  body?: string
  image?: string
  crumbs?: Crumb[]
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-noir-950 text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgb(201_160_74/0.18),transparent_60%)] rtl:bg-[radial-gradient(ellipse_at_top_right,rgb(201_160_74/0.18),transparent_60%)]" />
      {image && (
        <div aria-hidden className="absolute inset-y-0 end-0 -z-10 hidden w-[45%] md:block">
          <Img src={image} alt="" fill priority sizes="45vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/50 to-transparent rtl:bg-gradient-to-l" />
        </div>
      )}
      <Container className="py-14 sm:py-20">
        <Breadcrumbs locale={locale} crumbs={crumbs} light />
        <div className="mt-8 max-w-2xl">
          {eyebrow && <Kicker light>{eyebrow}</Kicker>}
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-gilded sm:text-6xl">{title}</h1>
          {body && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{body}</p>}
          {children}
        </div>
      </Container>
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
    </section>
  )
}
