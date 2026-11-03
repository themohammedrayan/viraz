export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v)
export const dirOf = (l: Locale) => (l === 'ar' ? 'rtl' : 'ltr')

/** A string available in every supported language. */
export type L = Record<Locale, string>
export const tr = (v: L, l: Locale) => v[l]

export const localeNames: Record<Locale, string> = { en: 'English', ar: 'العربية' }
export const ogLocale: Record<Locale, string> = { en: 'en_US', ar: 'ar_AE' }

/** Build a locale-prefixed path: href('ar', '/products') -> '/ar/products' */
export const href = (l: Locale, path = '') => `/${l}${path === '/' ? '' : path}`
