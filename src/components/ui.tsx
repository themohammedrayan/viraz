import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto w-full max-w-[78rem] px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

type Tone = 'ivory' | 'white' | 'sand' | 'noir' | 'herbal'
const tones: Record<Tone, string> = {
  ivory: 'bg-ivory text-ink',
  white: 'bg-white text-ink',
  sand: 'bg-sand text-ink',
  noir: 'bg-noir-950 text-white',
  herbal: 'bg-herbal-50 text-ink',
}

export function Section({ id, className, children, tone = 'ivory' }: { id?: string; className?: string; children: ReactNode; tone?: Tone }) {
  return (
    <section id={id} className={cx('py-16 sm:py-24', tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  )
}

/** Small-caps kicker with a gold diamond. */
export function Kicker({ children, light, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={cx('mb-4 inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.28em]', light ? 'text-gold-300' : 'text-gold-700', className)}>
      <span aria-hidden className="size-1.5 rotate-45 bg-gold-500" />
      {children}
    </p>
  )
}

export function SectionTitle({
  kicker, title, lead, center, light, className, action,
}: { kicker?: string; title: ReactNode; lead?: ReactNode; center?: boolean; light?: boolean; className?: string; action?: ReactNode }) {
  return (
    <div className={cx('mb-10 sm:mb-14', center ? 'mx-auto max-w-2xl text-center' : action ? 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between' : 'max-w-2xl', className)}>
      <div className={center ? '' : 'max-w-2xl'}>
        {kicker && <Kicker light={light}>{kicker}</Kicker>}
        <h2 className={cx('font-display text-[2.2rem] font-semibold leading-[1.08] sm:text-5xl', light ? 'text-white' : 'text-noir-900')}>{title}</h2>
        {lead && <p className={cx('mt-5 text-[1.05rem] leading-relaxed', light ? 'text-white/70' : 'text-muted')}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

type Variant = 'gold' | 'noir' | 'outline' | 'light' | 'whatsapp' | 'herbal'
const variants: Record<Variant, string> = {
  gold: 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-noir-950 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 shadow-sm',
  noir: 'bg-noir-900 text-white hover:bg-noir-700',
  outline: 'border border-noir-900 text-noir-900 hover:bg-noir-900 hover:text-white',
  light: 'border border-gold-300/60 text-gold-100 hover:bg-gold-100 hover:text-noir-950',
  whatsapp: 'bg-[#1fae53] text-white hover:bg-[#178f43]',
  herbal: 'bg-herbal-700 text-white hover:bg-herbal-800',
}
export const buttonClass = (v: Variant = 'gold', extra?: string) =>
  cx(
    'inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
    variants[v],
    extra,
  )

export function ButtonLink({
  variant = 'gold', className, external, ...p
}: ComponentProps<typeof Link> & { variant?: Variant; external?: boolean }) {
  if (external) {
    const { href, children, ...rest } = p
    return (
      <a href={String(href)} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className)} {...(rest as ComponentProps<'a'>)}>
        {children}
      </a>
    )
  }
  return <Link className={buttonClass(variant, className)} {...p} />
}

export const Arrow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" aria-hidden className={cx('flip-rtl size-4 shrink-0', className)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
)

/** Gold hairline with a diamond, as on the emblem. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx('rule-diamond mx-auto w-40', className)}>
      <span className="size-1.5 rotate-45 bg-current" />
    </div>
  )
}

export function Field({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-2">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1.5 block text-sm text-red-700">{error}</span>}
    </label>
  )
}

export const inputClass = (invalid?: boolean) =>
  cx(
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-gold-400/60',
    invalid ? 'border-red-600' : 'border-line focus:border-gold-500',
  )
