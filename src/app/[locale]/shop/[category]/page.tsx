import { notFound } from 'next/navigation'
import { href, locales, tr } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { categories, getCategory } from '@/content/products'
import { waLink } from '@/content/site'
import { getLocale } from '@/lib/locale'
import { breadcrumbLd, pageMeta } from '@/lib/seo'
import { PageBanner } from '@/components/PageBanner'
import { ProductCard } from '@/components/ProductCard'
import { WhatsAppIcon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { ButtonLink, Section, cx } from '@/components/ui'

export const dynamicParams = false
export const generateStaticParams = () => locales.flatMap((locale) => categories.map((c) => ({ locale, category: c.slug })))

export async function generateMetadata({ params }: PageProps<'/[locale]/shop/[category]'>) {
  const locale = await getLocale(params)
  const c = getCategory((await params).category)
  if (!c) return {}
  return pageMeta(locale, `/shop/${c.slug}`, c.name, c.intro, c.items[0]?.image)
}

export default async function CategoryPage({ params }: PageProps<'/[locale]/shop/[category]'>) {
  const locale = await getLocale(params)
  const c = getCategory((await params).category)
  if (!c) notFound()
  const t = getDict(locale)
  const name = tr(c.name, locale)
  const dark = c.theme === 'noir'

  return (
    <>
      <PageBanner
        locale={locale}
        eyebrow={c.comingSoon ? t.common.soon : tr(c.short, locale)}
        title={name}
        body={tr(c.intro, locale)}
        image={c.slug === 'soaps' ? '/images/soaps/range.webp' : c.slug === 'perfumes' ? '/images/perfumes/royal-oud.webp' : undefined}
        crumbs={[{ label: t.nav.shop, path: '/shop' }, { label: name }]}
      >
        {c.comingSoon && (
          <ButtonLink
            href={waLink(locale === 'ar' ? 'مرحبًا VIRAZ، أبلغوني عند إطلاق مستحضرات التجميل.' : 'Hello VIRAZ, please let me know when your cosmetics launch.')}
            external
            variant="whatsapp"
            className="mt-8"
          >
            <WhatsAppIcon /> {t.product.notify}
          </ButtonLink>
        )}
      </PageBanner>

      {c.items.length > 0 ? (
        <Section tone={dark ? 'noir' : c.theme === 'herbal' ? 'herbal' : 'ivory'}>
          <div className={cx('grid gap-x-6 gap-y-12', c.slug === 'perfumes' ? 'grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3')}>
            {c.items.map((p) => <ProductCard key={p.id} c={c} p={p} locale={locale} dark={dark} />)}
          </div>
        </Section>
      ) : (
        <Section>
          <div className="mx-auto max-w-xl text-center">
            <p className="text-lg leading-relaxed text-muted">{t.product.soonBody}</p>
            <ButtonLink href={href(locale, '/shop')} variant="outline" className="mt-8">{t.common.backToShop}</ButtonLink>
          </div>
        </Section>
      )}
      <JsonLd data={breadcrumbLd(locale, [{ name: t.nav.home, path: '/' }, { name: t.nav.shop, path: '/shop' }, { name, path: `/shop/${c.slug}` }])} />
    </>
  )
}
