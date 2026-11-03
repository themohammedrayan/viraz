import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { href, tr } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { site, waLink } from '@/content/site'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { PageBanner } from '@/components/PageBanner'
import { WhatsAppIcon } from '@/components/Icon'
import { Arrow, ButtonLink, Section } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return pageMeta(locale, '/contact', t.contact.title, t.contact.body)
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  const rows = [
    { I: Phone, label: t.common.callUs, value: <a dir="ltr" href={`tel:${site.contact.phoneE164}`} className="hover:text-gold-700">{site.contact.phone}</a> },
    { I: Mail, label: t.common.emailUs, value: <a href={`mailto:${site.contact.email}`} className="break-all hover:text-gold-700">{site.contact.email}</a> },
    { I: Clock, label: t.contact.hours, value: tr(site.contact.hours, locale) },
    { I: MapPin, label: t.contact.address, value: tr(site.address.lines, locale) },
  ]
  return (
    <>
      <PageBanner locale={locale} eyebrow={t.contact.eyebrow} title={t.contact.title} body={t.contact.body} crumbs={[{ label: t.nav.contact }]} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-3xl bg-[#0f2e1b] p-8 text-white shadow-lift sm:p-10">
            <div>
              <WhatsAppIcon className="size-10 text-[#4ade80]" />
              <h2 className="mt-6 font-display text-4xl font-semibold">{t.common.whatsappUs}</h2>
              <p className="mt-3 max-w-md leading-relaxed text-white/75">{tr(site.contact.responseTime, locale)}</p>
            </div>
            <ButtonLink href={waLink()} external variant="whatsapp" className="mt-8 self-start"><WhatsAppIcon /> <span dir="ltr">{site.contact.phone}</span></ButtonLink>
          </div>
          <ul className="divide-y divide-line rounded-3xl border border-line bg-white p-2 shadow-card">
            {rows.map(({ I, label, value }) => (
              <li key={label} className="flex gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-noir-950 text-gold-300"><I className="size-5" strokeWidth={1.5} aria-hidden /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
                  <p className="mt-1 text-ink">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href={href(locale, '/wholesale')} variant="outline">{t.nav.wholesale} <Arrow /></ButtonLink>
        </div>
      </Section>
    </>
  )
}
