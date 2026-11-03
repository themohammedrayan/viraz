import { Briefcase, Gift, Store } from 'lucide-react'
import { getDict } from '@/i18n/dict'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { PageBanner } from '@/components/PageBanner'
import { WholesaleForm } from '@/components/WholesaleForm'
import { Section } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/[locale]/wholesale'>) {
  const locale = await getLocale(params)
  const t = getDict(locale).wholesale
  return pageMeta(locale, '/wholesale', t.title, t.body)
}

export default async function WholesalePage({ params }: PageProps<'/[locale]/wholesale'>) {
  const locale = await getLocale(params)
  const d = getDict(locale)
  const t = d.wholesale
  const icons = [Store, Gift, Briefcase]
  return (
    <>
      <PageBanner locale={locale} eyebrow={t.eyebrow} title={t.title} body={t.body} image="/images/perfumes/golden-flora.webp" crumbs={[{ label: d.nav.wholesale }]} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <ul className="space-y-5">
            {t.offers.map((o, i) => {
              const I = icons[i]
              return (
                <li key={o.title} data-reveal="" className="flex gap-5 rounded-3xl border border-line bg-white p-6 shadow-card">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-noir-950 text-gold-300"><I className="size-5" strokeWidth={1.5} aria-hidden /></span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-noir-900">{o.title}</h2>
                    <p className="mt-1.5 leading-relaxed text-muted">{o.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
          <WholesaleForm locale={locale} />
        </div>
      </Section>
    </>
  )
}
