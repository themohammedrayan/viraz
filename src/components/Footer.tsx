import Link from 'next/link'
import Image from 'next/image'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { href, tr, type Locale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { categories } from '@/content/products'
import { site, waLink } from '@/content/site'
import { WhatsAppIcon } from './Icon'
import { Container } from './ui'

function ColTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-300">{children}</h2>
}

export function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const year = new Date().getFullYear()
  const help = [
    ['/about', t.nav.about], ['/wholesale', t.nav.wholesale], ['/faq', t.nav.faq], ['/contact', t.nav.contact], ['/legal', t.footer.legal], ['/privacy', t.footer.privacy],
  ] as const
  const socials = Object.entries(site.social).filter(([, url]) => url)

  return (
    <footer className="bg-noir-950 text-[0.95rem] text-white/65">
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href={href(locale)} aria-label="VIRAZ — home" className="inline-block">
            <Image src="/images/brand/viraz-logo.webp" alt="VIRAZ — The Essence of Elegance" width={640} height={510} sizes="200px" className="h-28 w-auto" />
          </Link>
          <p className="mt-6 max-w-sm leading-relaxed">{t.footer.about}</p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1fae53] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#178f43]">
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map(([k, url]) => (
                <li key={k}>
                  <a className="inline-grid size-9 place-items-center rounded-full border border-white/15 text-xs font-semibold uppercase hover:border-gold-400 hover:text-gold-300" href={url} target="_blank" rel="noopener noreferrer" aria-label={k}>
                    {k.slice(0, 2)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2">
          <ColTitle>{t.footer.shop}</ColTitle>
          <ul className="space-y-3">
            <li><Link className="hover:text-gold-300" href={href(locale, '/shop')}>{t.common.viewAll}</Link></li>
            {categories.map((c) => (
              <li key={c.slug}><Link className="hover:text-gold-300" href={href(locale, `/shop/${c.slug}`)}>{tr(c.name, locale)}</Link></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <ColTitle>{t.footer.help}</ColTitle>
          <ul className="space-y-3">
            {help.map(([p, l]) => <li key={p}><Link className="hover:text-gold-300" href={href(locale, p)}>{l}</Link></li>)}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <ColTitle>{t.footer.reach}</ColTitle>
          <ul className="space-y-4">
            <li className="flex gap-3"><Phone className="mt-1 size-4 shrink-0 text-gold-400" aria-hidden /><a dir="ltr" className="hover:text-gold-300" href={`tel:${site.contact.phoneE164}`}>{site.contact.phone}</a></li>
            <li className="flex gap-3"><Mail className="mt-1 size-4 shrink-0 text-gold-400" aria-hidden /><a className="break-all hover:text-gold-300" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
            <li className="flex gap-3"><Clock className="mt-1 size-4 shrink-0 text-gold-400" aria-hidden /><span>{tr(site.contact.hours, locale)}</span></li>
            <li className="flex gap-3"><MapPin className="mt-1 size-4 shrink-0 text-gold-400" aria-hidden /><span>{tr(site.address.lines, locale)}</span></li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. {t.footer.rights}</p>
          <p>
            {t.footer.madeBy}{' '}
            <a href={site.makerUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-300 hover:text-gold-100">{site.maker}</a>
            {' · '}Kerala, India
          </p>
        </Container>
      </div>
    </footer>
  )
}
