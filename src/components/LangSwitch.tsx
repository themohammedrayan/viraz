'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { href, localeNames, locales, type Locale } from '@/i18n/config'

export function LangSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname() || `/${locale}`
  const rest = pathname.replace(/^\/(en|ar)(?=\/|$)/, '')
  const other = locales.find((l) => l !== locale)!
  return (
    <Link href={href(other, rest || '/')} hrefLang={other} lang={other} className={`inline-flex items-center gap-1.5 ${className ?? ''}`}>
      <Globe className="size-3.5" aria-hidden /> {localeNames[other]}
    </Link>
  )
}
