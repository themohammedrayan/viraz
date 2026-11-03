import Link from 'next/link'
import { href, tr, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { fromPrice, type Category, type Product } from '@/content/products'
import { inr } from '@/content/site'
import { Img } from './Img'
import { cx } from './ui'

/**
 * Perfume artwork is portrait (2:3), soap boxes are landscape (3:2); each
 * card keeps its category's natural ratio so nothing important is cropped.
 */
export function ProductCard({ c, p, locale, dark, reveal = true }: { c: Category; p: Product; locale: Locale; dark?: boolean; reveal?: boolean }) {
  const t = getDict(locale)
  const portrait = c.slug === 'perfumes'
  return (
    <article {...(reveal ? { 'data-reveal': '' } : {})} className="group relative flex flex-col">
      <div className={cx('relative overflow-hidden rounded-2xl', portrait ? 'aspect-[2/3]' : 'aspect-[3/2]', dark ? 'bg-noir-800' : 'bg-sand')}>
        <Img
          src={p.image}
          alt={`${tr(p.name, locale)} — VIRAZ`}
          fill
          sizes={portrait ? '(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw'}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {p.badge && (
          <span className="absolute start-3 top-3 rounded-full bg-noir-950/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-300 backdrop-blur">
            {tr(p.badge, locale)}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className={cx('text-[0.68rem] font-semibold uppercase tracking-[0.22em]', dark ? 'text-gold-400' : 'text-gold-700')}>{tr(p.tagline, locale)}</p>
        <h3 className={cx('mt-1.5 font-display text-2xl font-semibold leading-tight', dark ? 'text-white' : 'text-noir-900')}>
          <Link href={href(locale, `/shop/${c.slug}/${p.id}`)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {tr(p.name, locale)}
          </Link>
        </h3>
        <p className={cx('mt-1 text-sm', dark ? 'text-white/55' : 'text-muted')}>{p.notes.map((n) => tr(n, locale)).join(' · ')}</p>
        <p className={cx('mt-3 text-sm', dark ? 'text-white/80' : 'text-ink-2')}>
          <span className="opacity-70">{t.common.from}</span> <strong className="font-semibold tabular-nums">{inr(fromPrice(p))}</strong>
        </p>
      </div>
    </article>
  )
}
