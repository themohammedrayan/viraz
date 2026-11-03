import { notFound } from 'next/navigation'
import { Check, Gift, ShieldCheck, Truck } from 'lucide-react'
import { locales, tr } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { categories, getCategory } from '@/content/products'
import { site, waLink } from '@/content/site'
import { getLocale } from '@/lib/locale'
import { breadcrumbLd, pageMeta, productLd } from '@/lib/seo'
import { Breadcrumbs } from '@/components/PageBanner'
import { AddToBag } from '@/components/AddToBag'
import { ProductCard } from '@/components/ProductCard'
import { Img } from '@/components/Img'
import { WhatsAppIcon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { Container, Section, SectionTitle, cx } from '@/components/ui'

export const dynamicParams = false
export const generateStaticParams = () =>
  locales.flatMap((locale) => categories.flatMap((c) => c.items.map((p) => ({ locale, category: c.slug, product: p.id }))))

function resolve(category: string, product: string) {
  const c = getCategory(category)
  const p = c?.items.find((x) => x.id === product)
  return c && p ? { c, p } : null
}

export async function generateMetadata({ params }: PageProps<'/[locale]/shop/[category]/[product]'>) {
  const locale = await getLocale(params)
  const { category, product } = await params
  const r = resolve(category, product)
  if (!r) return {}
  const suffix = r.c.slug === 'perfumes' ? (locale === 'ar' ? 'ماء عطر' : 'Eau de Parfum') : (locale === 'ar' ? 'صابون أيورفيدي' : 'Ayurvedic Soap')
  return pageMeta(locale, `/shop/${r.c.slug}/${r.p.id}`, `${tr(r.p.name, locale)} — ${suffix}`, r.p.description, r.p.image)
}

export default async function ProductPage({ params }: PageProps<'/[locale]/shop/[category]/[product]'>) {
  const locale = await getLocale(params)
  const { category, product } = await params
  const r = resolve(category, product)
  if (!r) notFound()
  const { c, p } = r
  const t = getDict(locale)
  const name = tr(p.name, locale)
  const dark = c.theme === 'noir'
  const portrait = c.slug === 'perfumes'
  const related = c.items.filter((x) => x.id !== p.id).slice(0, portrait ? 3 : 3)
  const trustIcons = [Truck, ShieldCheck, Gift]
  const ask = locale === 'ar' ? `مرحبًا VIRAZ، لدي سؤال عن ${name}.` : `Hello VIRAZ, I have a question about ${name}.`

  return (
    <>
      <section className={cx(dark ? 'bg-noir-950 text-white' : 'bg-ivory text-ink')}>
        <Container className="py-8 sm:py-12">
          <Breadcrumbs locale={locale} light={dark} crumbs={[{ label: t.nav.shop, path: '/shop' }, { label: tr(c.name, locale), path: `/shop/${c.slug}` }, { label: name }]} />
          <div className={cx('mt-8 grid items-start gap-10 lg:gap-16', portrait ? 'lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]' : 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]')}>
            <div className={cx('relative overflow-hidden rounded-3xl shadow-lift', portrait ? 'mx-auto aspect-[2/3] w-full max-w-md lg:max-w-none' : 'aspect-[3/2]', dark ? 'bg-noir-800' : 'bg-sand')}>
              <Img src={p.image} alt={`${name} — VIRAZ ${c.name.en}`} fill priority sizes={portrait ? '(min-width: 1024px) 40vw, 90vw' : '(min-width: 1024px) 55vw, 95vw'} className="object-cover" />
            </div>

            <div>
              <p className={cx('text-[0.7rem] font-semibold uppercase tracking-[0.26em]', dark ? 'text-gold-400' : 'text-gold-700')}>
                {portrait ? (locale === 'ar' ? 'ماء عطر' : 'Eau de Parfum') : tr(c.name, locale)} · {tr(p.tagline, locale)}
              </p>
              <h1 className={cx('mt-3 font-display text-5xl font-semibold leading-[1.02] sm:text-6xl', dark ? 'text-gilded' : 'text-noir-900')}>{name}</h1>
              <p className={cx('mt-5 text-lg leading-relaxed', dark ? 'text-white/75' : 'text-ink-2')}>{tr(p.description, locale)}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className={cx('me-1 self-center text-xs font-semibold uppercase tracking-[0.16em]', dark ? 'text-white/50' : 'text-muted')}>
                  {portrait ? t.product.notes : t.product.ingredients}
                </span>
                {p.notes.map((n) => (
                  <span key={n.en} className={cx('rounded-full border px-3.5 py-1.5 text-sm', dark ? 'border-gold-500/40 text-gold-100' : 'border-line bg-white text-ink')}>{tr(n, locale)}</span>
                ))}
              </div>

              <div className={cx('my-8 h-px', dark ? 'bg-white/10' : 'bg-line')} />
              <AddToBag locale={locale} product={p} dark={dark} />

              <ul className={cx('mt-6 grid gap-3 rounded-2xl p-5 text-sm sm:grid-cols-3', dark ? 'bg-white/5 text-white/75' : 'bg-white text-ink-2 shadow-card')}>
                {t.product.trust.map((x, i) => {
                  const I = trustIcons[i]
                  return <li key={x} className="flex items-center gap-2.5"><I className="size-5 shrink-0 text-gold-500" strokeWidth={1.5} aria-hidden />{x}</li>
                })}
              </ul>
              <p className={cx('mt-2 text-xs', dark ? 'text-white/45' : 'text-muted')}>{t.product.trustNote}</p>
              <a href={waLink(ask)} target="_blank" rel="noopener noreferrer" className={cx('mt-5 inline-flex items-center gap-2 text-sm font-semibold', dark ? 'text-gold-300 hover:text-gold-100' : 'text-herbal-700 hover:text-herbal-800')}>
                <WhatsAppIcon className="size-4" /> {t.product.askQuestion}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Section tone={dark ? 'ivory' : 'white'}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-8 shadow-card">
            <h2 className="font-display text-3xl font-semibold text-noir-900">{t.product.benefits}</h2>
            <ul className="mt-5 space-y-3">
              {p.benefits.map((b) => (
                <li key={b.en} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white" style={{ background: p.accent }}><Check className="size-3.5" aria-hidden /></span>
                  <span className="text-ink-2">{tr(b, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-white p-8 shadow-card">
            <h2 className="font-display text-3xl font-semibold text-noir-900">{t.product.howTo}</h2>
            <p className="mt-5 leading-relaxed text-ink-2">{tr(p.howTo, locale)}</p>
            {p.ingredients && (
              <>
                <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t.product.fullIngredients}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{tr(p.ingredients, locale)}</p>
              </>
            )}
            {site.licences.length > 0 && (
              <p className="mt-6 text-xs text-muted">{site.licences.map((l) => `${l.name}: ${l.number}`).join(' · ')}</p>
            )}
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone={dark ? 'noir' : 'herbal'}>
          <SectionTitle light={dark} title={t.product.related} />
          <div className={cx('grid gap-x-6 gap-y-10', portrait ? 'grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3')}>
            {related.map((x) => <ProductCard key={x.id} c={c} p={x} locale={locale} dark={dark} />)}
          </div>
        </Section>
      )}

      <JsonLd data={productLd(locale, c, p)} />
      <JsonLd data={breadcrumbLd(locale, [
        { name: t.nav.home, path: '/' }, { name: t.nav.shop, path: '/shop' }, { name: tr(c.name, locale), path: `/shop/${c.slug}` }, { name, path: `/shop/${c.slug}/${p.id}` },
      ])} />
    </>
  )
}
