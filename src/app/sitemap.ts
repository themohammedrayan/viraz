import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { categories } from '@/content/products'
import { site } from '@/content/site'

export const dynamic = 'force-static'

const PATHS = [
  '', '/shop', '/about', '/wholesale', '/faq', '/contact', '/legal', '/privacy',
  ...categories.map((c) => `/shop/${c.slug}`),
  ...categories.flatMap((c) => c.items.map((i) => `/shop/${c.slug}/${i.id}`)),
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return PATHS.flatMap((p) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${p}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: p === '' ? 1 : p.startsWith('/shop') ? 0.8 : 0.5,
      alternates: { languages: { ...Object.fromEntries(locales.map((x) => [x, `${site.url}/${x}${p}`])), 'x-default': `${site.url}/en${p}` } },
    })),
  )
}
