import Link from 'next/link'
import { Check } from 'lucide-react'
import { href, tr } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { categories, getCategory } from '@/content/products'
import { faqs } from '@/content/faq'
import { site, waLink } from '@/content/site'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { size } from '@/lib/img'
import { Img } from '@/components/Img'
import { Icon, WhatsAppIcon } from '@/components/Icon'
import { ProductCard } from '@/components/ProductCard'
import { FaqList } from '@/components/FaqList'
import { Arrow, ButtonLink, Container, Kicker, Ornament, Section, SectionTitle, cx } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const locale = await getLocale(params)
  return pageMeta(
    locale,
    '/',
    locale === 'ar' ? 'VIRAZ — عطور فاخرة وصابون أيورفيدي' : 'VIRAZ — Luxury Perfumes & Ayurvedic Soaps',
    site.description,
  )
}

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  const perfumes = getCategory('perfumes')!
  const soaps = getCategory('soaps')!
  const desk = size('/images/hero/collection-desktop.webp')
  const mob = size('/images/hero/collection-mobile.webp')

  return (
    <>
      {/* Hero: the whole range in one image (scripts/collection.py), shown uncropped with the page title beneath it. */}
      <section className="bg-noir-950 text-white">
        <h2 className="sr-only">The VIRAZ collection</h2>
        <picture>
          <source media="(max-width: 639px)" srcSet="/images/hero/collection-mobile.webp" width={mob.width} height={mob.height} />
          <img
            src="/images/hero/collection-desktop.webp"
            width={desk.width}
            height={desk.height}
            alt="The VIRAZ collection: eau de parfum bottles beside Papaya, Milk, Aloe Vera & Neem, Honey Oat Milk, Sandal and Charcoal Powder Ayurvedic beauty soaps"
            fetchPriority="high"
            className="block h-auto w-full"
          />
        </picture>
        <Container className="relative pb-16 pt-12 text-center sm:pb-20 sm:pt-14">
          <Kicker light className="justify-center text-center max-sm:[&>span]:hidden">{t.home.kicker}</Kicker>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-gilded sm:text-7xl">{t.home.title}</h1>
          <Ornament className="mt-6" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{t.home.body}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={href(locale, '/shop/perfumes')}>{t.nav.perfumes} <Arrow /></ButtonLink>
            <ButtonLink href={href(locale, '/shop/soaps')} variant="light">{t.nav.soaps} <Arrow /></ButtonLink>
          </div>
        </Container>
        <div className="border-t border-white/10">
          <Container>
            <ul className="grid grid-cols-2 lg:grid-cols-4">
              {t.home.promises.map((p, i) => (
                <li key={p.title} className={cx('flex flex-col items-center px-3 py-8 text-center sm:px-6', i % 2 === 1 && 'border-s border-white/10', i >= 2 && 'max-lg:border-t max-lg:border-white/10', i === 2 && 'lg:border-s lg:border-white/10')}>
                  <Icon name={p.icon} className="size-8 text-gold-400" />
                  <h3 className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold-100">{p.title}</h3>
                  <p className="mt-2 hidden max-w-[16rem] text-sm leading-relaxed text-white/55 sm:block">{p.body}</p>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </section>

      {/* Collections */}
      <Section>
        <SectionTitle center kicker={t.home.catsKicker} title={t.home.catsTitle} />
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={href(locale, `/shop/${c.slug}`)}
              data-reveal=""
              className={cx(
                'group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl p-7 text-white shadow-card',
                c.theme === 'herbal' ? 'bg-herbal-800' : 'bg-noir-900',
              )}
            >
              <Img src={c.cover} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className={cx('-z-20 object-cover transition-transform duration-700 group-hover:scale-105', c.slug === 'perfumes' && 'object-[50%_78%]', c.comingSoon && 'opacity-50 grayscale-[40%]')} />
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-noir-950 via-noir-950/50 to-transparent" />
              {c.comingSoon && <span className="absolute end-5 top-5 rounded-full border border-gold-300/60 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-100">{t.common.soon}</span>}
              <h3 className="font-display text-4xl font-semibold">{tr(c.name, locale)}</h3>
              <p className="mt-2 max-w-xs text-sm text-white/75">{tr(c.short, locale)}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
                {t.common.explore} <Arrow className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Signature perfumes */}
      <Section tone="noir" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 start-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl rtl:translate-x-1/2" />
        <SectionTitle
          light
          kicker={t.home.perfumesKicker}
          title={<span className="text-gilded">{t.home.perfumesTitle}</span>}
          lead={t.home.perfumesBody}
          action={<ButtonLink href={href(locale, '/shop/perfumes')} variant="light">{t.common.viewAll} <Arrow /></ButtonLink>}
        />
        <div data-reveal="" className="relative mb-12 overflow-hidden rounded-3xl ring-1 ring-gold-500/30">
          <Img src="/images/perfumes/collection.webp" alt="VIRAZ Premium Perfumes Collection: Oud, Amber, Blue, Royal, Floral, Rose, Musk, Oudh, Silver and Zen eau de parfums" sizes="(min-width: 1248px) 1200px, 100vw" className="h-auto w-full" />
        </div>
        <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {perfumes.items.map((p) => <ProductCard key={p.id} c={perfumes} p={p} locale={locale} dark />)}
        </div>
      </Section>

      {/* Ayurvedic soaps */}
      <Section tone="herbal">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div data-reveal="" className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-lift lg:max-w-none">
            <Img src="/images/soaps/range.webp" alt="VIRAZ Ayurvedic herbal beauty soap range — Papaya, Milk, Aloe Vera & Neem, Honey Oat Milk, Sandal and Charcoal Powder" sizes="(min-width: 1024px) 40vw, 90vw" className="h-auto w-full" />
          </div>
          <div>
            <Kicker>{t.home.soapsKicker}</Kicker>
            <h2 className="font-display text-[2.2rem] font-semibold leading-[1.08] text-herbal-800 sm:text-5xl">{t.home.soapsTitle}</h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">{t.home.soapsBody}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {t.home.soapsPoints.map((x) => (
                <li key={x} className="flex items-center gap-3 rounded-full bg-white px-4 py-3 text-sm font-medium text-ink shadow-card">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-herbal-700 text-white"><Check className="size-4" aria-hidden /></span>
                  {x}
                </li>
              ))}
            </ul>
            <ButtonLink href={href(locale, '/shop/soaps')} variant="herbal" className="mt-9">{t.common.shopNow} <Arrow /></ButtonLink>
          </div>
        </div>
        <div className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {soaps.items.map((p) => <ProductCard key={p.id} c={soaps} p={p} locale={locale} />)}
        </div>
      </Section>

      {/* How ordering works */}
      <Section tone="white">
        <SectionTitle center kicker={t.home.howKicker} title={t.home.howTitle} />
        <ol className="grid gap-6 md:grid-cols-3">
          {t.home.how.map((s, i) => (
            <li key={s.title} data-reveal="" className="relative rounded-3xl border border-line bg-ivory p-8 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full border border-gold-500 font-display text-2xl text-gold-700">{i + 1}</span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-noir-900">{s.title}</h3>
              <p className="mt-2 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <ButtonLink href={waLink(locale === 'ar' ? 'مرحبًا VIRAZ، أودّ الطلب.' : 'Hello VIRAZ, I would like to place an order.')} external variant="whatsapp">
            <WhatsAppIcon /> {t.common.whatsappUs}
          </ButtonLink>
        </div>
      </Section>

      {/* Story + gifting */}
      <Section tone="sand">
        <div className="grid gap-6 lg:grid-cols-2">
          <div data-reveal="" className="flex flex-col justify-center rounded-3xl bg-white p-8 shadow-card sm:p-12">
            <Kicker>{t.home.storyKicker}</Kicker>
            <h2 className="font-display text-4xl font-semibold leading-tight text-noir-900 sm:text-5xl">{t.home.storyTitle}</h2>
            <p className="mt-5 leading-relaxed text-muted">{t.home.storyBody}</p>
            <Link href={href(locale, '/about')} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold-700 hover:text-noir-900">
              {t.nav.about} <Arrow />
            </Link>
          </div>
          <div data-reveal="" className="grid items-center gap-8 overflow-hidden rounded-3xl bg-noir-950 p-8 text-white shadow-lift sm:grid-cols-[1fr_12rem] sm:p-10 xl:grid-cols-[1fr_15rem]">
            <div>
              <h2 className="font-display text-4xl font-semibold leading-tight text-gilded sm:text-5xl">{t.home.giftTitle}</h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/75">{t.home.giftBody}</p>
              <ButtonLink href={href(locale, '/wholesale')} className="mt-7">{t.home.giftCta} <Arrow /></ButtonLink>
            </div>
            <Img src="/images/brand/perfumes-and-soaps.webp" alt="VIRAZ perfumes and herbal soaps — premium quality for personal and commercial use" sizes="240px" className="mx-auto h-auto w-48 rotate-2 rounded-xl shadow-lift ring-1 ring-gold-500/40 sm:w-full" />
          </div>
        </div>
      </Section>

      {/* FAQ teaser */}
      <Section>
        <SectionTitle
          kicker={t.faq.eyebrow}
          title={t.faq.title}
          action={<ButtonLink href={href(locale, '/faq')} variant="outline">{t.common.viewAll} <Arrow /></ButtonLink>}
        />
        <FaqList locale={locale} items={faqs.slice(0, 4)} />
      </Section>
    </>
  )
}
