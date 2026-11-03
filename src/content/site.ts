import type { L } from '@/i18n/config'

/**
 * Brand facts. Everything a customer may rely on lives here so it can be
 * corrected in one place. Items marked TODO(verify) are sensible defaults
 * that the business owner must confirm before launch (see README).
 */
export const site = {
  name: 'VIRAZ',
  /** Brand owner / manufacturer shown in the footer and legal pages. */
  maker: 'Saaco Global Company',
  makerUrl: 'https://saacoglobal.com',
  legalName: 'Saaco Global Company', // TODO(verify): registered legal entity name
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://viraz.in').replace(/\/$/, ''),
  tagline: { en: 'The Essence of Luxury', ar: 'جوهر الفخامة' } satisfies L,
  description: {
    en: 'VIRAZ crafts long-lasting eau de parfums inspired by Arabian tradition and premium Ayurvedic beauty soaps made in Kerala, India. Order on WhatsApp with delivery across India.',
    ar: 'تقدّم VIRAZ عطورًا فاخرة تدوم طويلًا مستوحاة من التراث العربي، وصابونًا أيورفيديًا فاخرًا مصنوعًا في كيرالا، الهند. اطلب عبر واتساب مع التوصيل إلى جميع أنحاء الهند.',
  } satisfies L,
  contact: {
    phone: '+91 75920 30338',
    phoneE164: '+917592030338',
    whatsapp: '917592030338',
    email: 'care@viraz.in', // TODO(verify): set up this mailbox or replace it
    hours: { en: 'Mon–Sat, 9:30–18:30 IST', ar: 'الاثنين–السبت، 9:30–18:30 بتوقيت الهند' } satisfies L,
    responseTime: { en: 'We reply on WhatsApp within a few working hours.', ar: 'نردّ عبر واتساب خلال ساعات عمل قليلة.' } satisfies L,
  },
  address: {
    street: 'Velliparamba',
    locality: 'Calicut',
    region: 'Kerala',
    postalCode: '673008',
    countryCode: 'IN',
    lines: {
      en: 'Saaco Global Company, Velliparamba, Calicut, Kerala 673008, India',
      ar: 'شركة ساكو جلوبال، فيليبارامبا، كاليكوت، كيرالا 673008، الهند',
    } satisfies L,
  },
  /** Add real profile URLs to show social icons in the footer. Empty = hidden. */
  social: {
    instagram: '', // TODO(verify)
    facebook: '', // TODO(verify)
  },
  /**
   * Licences shown on the legal page and product pages once filled in.
   * Never display a licence the company does not hold.
   */
  licences: [] as { name: string; number: string }[], // TODO(verify): cosmetics / AYUSH manufacturing licence numbers
  /** Free-shipping threshold in ₹, or null to hide the promise. */
  freeShippingOver: null as number | null, // TODO(verify)
}

export const waLink = (text?: string) =>
  `https://wa.me/${site.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')
