import { getDict } from '@/i18n/dict'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { Breadcrumbs } from '@/components/PageBanner'
import { BagView } from '@/components/BagView'
import { Section } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/[locale]/bag'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return { ...pageMeta(locale, '/bag', t.bag.title, t.bag.howItWorks), robots: { index: false } }
}

export default async function BagPage({ params }: PageProps<'/[locale]/bag'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return (
    <Section className="!pt-10">
      <Breadcrumbs locale={locale} crumbs={[{ label: t.nav.bag }]} />
      <h1 className="mb-10 mt-6 font-display text-5xl font-semibold text-noir-900 sm:text-6xl">{t.bag.title}</h1>
      <BagView locale={locale} />
    </Section>
  )
}
