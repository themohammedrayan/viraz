import { tr } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { faqs } from '@/content/faq'
import { waLink } from '@/content/site'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { PageBanner } from '@/components/PageBanner'
import { FaqList } from '@/components/FaqList'
import { WhatsAppIcon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { ButtonLink, Section } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/[locale]/faq'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return pageMeta(locale, '/faq', t.faq.title, t.faq.body)
}

export default async function FaqPage({ params }: PageProps<'/[locale]/faq'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return (
    <>
      <PageBanner locale={locale} eyebrow={t.faq.eyebrow} title={t.faq.title} body={t.faq.body} crumbs={[{ label: t.nav.faq }]} />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <FaqList locale={locale} />
          <aside className="self-start rounded-3xl bg-noir-950 p-7 text-white shadow-lift lg:sticky lg:top-28">
            <h2 className="font-display text-3xl font-semibold text-gilded">{t.faq.still}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{t.contact.body}</p>
            <ButtonLink href={waLink()} external variant="whatsapp" className="mt-6 w-full"><WhatsAppIcon /> WhatsApp</ButtonLink>
          </aside>
        </div>
      </Section>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: tr(f.q, locale), acceptedAnswer: { '@type': 'Answer', text: tr(f.a, locale) } })),
      }} />
    </>
  )
}
