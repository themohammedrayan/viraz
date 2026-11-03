import { getDict } from '@/i18n/dict'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { PageBanner } from '@/components/PageBanner'
import { ShopBrowser } from '@/components/ShopBrowser'
import { Section } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/[locale]/shop'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return pageMeta(locale, '/shop', t.shop.title, t.shop.body)
}

export default async function ShopPage({ params }: PageProps<'/[locale]/shop'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return (
    <>
      <PageBanner locale={locale} title={t.shop.title} body={t.shop.body} image="/images/perfumes/collection.webp" crumbs={[{ label: t.nav.shop }]} />
      <Section>
        <ShopBrowser locale={locale} />
      </Section>
    </>
  )
}
