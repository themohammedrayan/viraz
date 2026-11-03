import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../globals.css'
import { dirOf, isLocale, locales, tr } from '@/i18n/config'
import { site } from '@/content/site'
import { fontVars } from '@/lib/fonts'
import { brandLd } from '@/lib/seo'
import { BagProvider } from '@/lib/bag-store'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppFab } from '@/components/WhatsAppFab'
import { BackToTop } from '@/components/BackToTop'
import { RevealObserver } from '@/components/Reveal'
import { JsonLd } from '@/components/JsonLd'

export const dynamicParams = false
export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export const viewport: Viewport = { themeColor: '#0b0906', width: 'device-width', initialScale: 1 }

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${locale === 'ar' ? 'عطور فاخرة وصابون أيورفيدي' : 'Luxury Perfumes & Ayurvedic Soaps'}`,
      template: `%s | ${site.name}`,
    },
    description: tr(site.description, locale),
    applicationName: site.name,
    keywords: ['VIRAZ', 'VIRAZ perfume', 'luxury perfume India', 'oud perfume', 'eau de parfum', 'Ayurvedic soap', 'herbal beauty soap', 'Kerala', 'عطور', 'عود', 'صابون أيورفيدي'],
    icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
    formatDetection: { telephone: false },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen">
        <BagProvider>
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <WhatsAppFab locale={locale} />
          <BackToTop locale={locale} />
        </BagProvider>
        <RevealObserver />
        <JsonLd data={brandLd(locale)} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
