import { site, waLink } from '@/content/site'
import { getDict } from '@/i18n/dict'
import type { Locale } from '@/i18n/config'
import { WhatsAppIcon } from './Icon'

export function WhatsAppFab({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const greeting = locale === 'ar'
    ? `مرحبًا ${site.name}، أودّ الاستفسار عن منتجاتكم.`
    : `Hello ${site.name}, I would like to enquire about your products.`
  return (
    <a
      href={waLink(greeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.common.whatsappUs}
      className="fixed bottom-5 end-5 z-40 grid size-14 place-items-center rounded-full bg-[#1fae53] text-white shadow-lift ring-4 ring-ivory transition hover:scale-105 sm:bottom-6 sm:end-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
