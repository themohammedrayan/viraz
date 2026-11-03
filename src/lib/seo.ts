import type { Metadata } from 'next'
import { href, locales, ogLocale, tr, type L, type Locale } from '@/i18n/config'
import { site } from '@/content/site'
import type { Category, Product } from '@/content/products'

/** Per-page metadata with canonical + hreflang alternates for every locale. */
export function pageMeta(locale: Locale, path: string, title: L | string, description: L | string, image = '/images/og.jpg'): Metadata {
  const t = typeof title === 'string' ? title : tr(title, locale)
  const d = typeof description === 'string' ? description : tr(description, locale)
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, href(l, path)]))
  languages['x-default'] = href('en', path)
  return {
    title: t,
    description: d,
    alternates: { canonical: href(locale, path), languages },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: t,
      description: d,
      url: href(locale, path),
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ url: image, alt: site.name }],
    },
    twitter: { card: 'summary_large_image', title: t, description: d, images: [image] },
  }
}

export function brandLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#org`,
        name: site.name,
        alternateName: 'VIRAZ Perfume',
        slogan: tr(site.tagline, locale),
        url: site.url,
        logo: `${site.url}/icon-512.png`,
        email: site.contact.email,
        telephone: site.contact.phoneE164,
        description: tr(site.description, locale),
        parentOrganization: { '@type': 'Organization', name: site.maker, url: site.makerUrl },
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.countryCode,
        },
        contactPoint: [{
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: site.contact.phoneE164,
          email: site.contact.email,
          availableLanguage: ['English', 'Arabic', 'Malayalam', 'Hindi'],
          areaServed: 'IN',
        }],
        sameAs: Object.values(site.social).filter(Boolean),
      },
      { '@type': 'WebSite', '@id': `${site.url}/#web`, url: site.url, name: site.name, inLanguage: locale, publisher: { '@id': `${site.url}/#org` } },
    ],
  }
}

export function productLd(locale: Locale, c: Category, p: Product) {
  const url = `${site.url}${href(locale, `/shop/${c.slug}/${p.id}`)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tr(p.name, locale),
    description: tr(p.description, locale),
    image: `${site.url}${p.image}`,
    brand: { '@type': 'Brand', name: site.name },
    category: tr(c.name, locale),
    url,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: Math.min(...p.sizes.map((s) => s.mrp)),
      highPrice: Math.max(...p.sizes.map((s) => s.mrp)),
      offerCount: p.sizes.length,
      availability: 'https://schema.org/InStock',
      url,
    },
  }
}

export function breadcrumbLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: `${site.url}${href(locale, x.path)}` })),
  }
}
