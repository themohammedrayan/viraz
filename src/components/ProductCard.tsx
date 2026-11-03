import Link from 'next/link'
import { href, tr, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { fromPrice, type Category, type Product } from '@/content/products'
import { inr } from '@/content/site'
import { Img } from './Img'
import { cx } from './ui'

/**
 * Warm ivory-to-gold stage for the perfume bottles. The bottles are cut from
 * the range poster with feathered edges, so they sit on a matching backdrop
 * instead of being stretched full-bleed.
 */
export const perfumeStage =
  'bg-[radial-gradient(ellipse_at_50%_42%,#fffaf0_0%,#f6ecd2_42%,#e3c88c_100%)] after:pointer-events-none after:absolute after:inset-x-[18%] after:bottom-[5%] after:h-[5%] after:rounded-[50%] after:bg-noir-950/25 after:blur-md'
export const perfumeImg = 'z-10 object-contain px-[14%] pb-[7%] pt-[9%] drop-shadow-[0_14px_18px_rgb(21_17_11/0.28)]'

/**
 * Perfumes are portrait (2:3) bottles on a stage; soap boxes are landscape
 * (3:2) artwork shown full-bleed.
 */
export function ProductCard({ c, p, locale, dark, reveal = true }: { c: Category; p: Product; locale: Locale; dark?: boolean; reveal?: boolean }) {
  const t = getDict(locale)
  const portrait = c.slug === 'perfumes'
  return (
    <article {...(reveal ? { 'data-reveal': '' } : {})} className="group relative flex flex-col">
      <div className={cx('relative overflow-hidden rounded-2xl', portrait ? cx('aspect-[2/3]', perfumeStage) : 'aspect-[3/2] bg-sand', dark && portrait && 'ring-1 ring-gold-500/30')}>
        <Img
          src={p.image}
          alt={`${tr(p.name, locale)} — VIRAZ`}
          fill
          sizes={portrait ? '(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw'}
          className={cx('transition-transform duration-700 group-hover:scale-[1.04]', portrait ? perfumeImg : 'object-cover')}
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
