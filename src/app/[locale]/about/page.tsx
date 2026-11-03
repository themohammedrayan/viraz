import { href, tr } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { site } from '@/content/site'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { PageBanner } from '@/components/PageBanner'
import { Img } from '@/components/Img'
import { Arrow, ButtonLink, Kicker, Ornament, Section } from '@/components/ui'

const copy = {
  en: {
    lead: 'VIRAZ — “The Essence of Elegance” — was created to make everyday moments feel royal. Our name is written in Arabic calligraphy and crowned with a gold emblem: a promise of craft, generosity and fine taste.',
    pillars: [
      {
        kicker: 'Perfumery',
        title: 'Inspired by Arabian tradition',
        body: 'Oud, amber, saffron, musk, jasmine and rose — the treasured materials of Arabian perfumery, composed into modern eau de parfums that last from morning to night. Every bottle is designed to be kept, displayed and gifted.',
        image: '/images/hero/banner-desktop.webp',
      },
      {
        kicker: 'Ayurveda',
        title: 'Rooted in Kerala’s herbal wisdom',
        body: 'Kerala is the home of Ayurveda. Our beauty soaps draw on that heritage — aloe vera, neem, sandal, rose, papaya, milk and honey — in rich, gentle bars for healthy, glowing skin every day.',
        image: '/images/soaps/sandal.webp',
      },
    ],
    valuesTitle: 'What we stand for',
    values: [
      ['Premium ingredients', 'We choose materials for quality first, in fragrance and in skin care.'],
      ['Lasting performance', 'Perfumes made to last and soaps made to be used every day.'],
      ['Beautiful presentation', 'Gold, glass and gift-ready packs that feel special to open.'],
      ['Personal service', 'Real people on WhatsApp who help you choose, order and gift.'],
    ],
    makerTitle: 'A brand by Saaco Global Company',
    makerBody: 'VIRAZ is created by Saaco Global Company, a Kerala-based business that also trades natural products from India to the Gulf and beyond.',
    makerCta: 'Visit Saaco Global',
  },
  ar: {
    lead: 'وُلدت VIRAZ — «جوهر الأناقة» — لتمنح لحظاتك اليومية طابعًا ملكيًا. يُكتب اسمنا بالخط العربي ويعلوه شعار ذهبي: وعدٌ بالحِرفية والكرم والذوق الرفيع.',
    pillars: [
      {
        kicker: 'العطور',
        title: 'مستوحاة من التراث العربي',
        body: 'العود والعنبر والزعفران والمسك والياسمين والورد — أثمن مواد العطور العربية، في تركيبات عصرية من ماء العطر تدوم من الصباح حتى المساء. كل زجاجة مصمّمة لتُقتنى وتُعرض وتُهدى.',
        image: '/images/hero/banner-desktop.webp',
      },
      {
        kicker: 'الأيورفيدا',
        title: 'متجذّرة في حكمة كيرالا العشبية',
        body: 'كيرالا موطن الأيورفيدا. يستلهم صابون التجميل لدينا هذا الإرث — الألوفيرا والنيم والصندل والورد والبابايا والحليب والعسل — في قوالب غنية ولطيفة لبشرة صحية ومتوهّجة كل يوم.',
        image: '/images/soaps/sandal.webp',
      },
    ],
    valuesTitle: 'ما نؤمن به',
    values: [
      ['مكوّنات فاخرة', 'نختار المواد للجودة أولًا، في العطور وفي العناية بالبشرة.'],
      ['أداء يدوم', 'عطور مصنوعة لتدوم وصابون مصنوع للاستخدام اليومي.'],
      ['تقديم جميل', 'الذهب والزجاج وعبوات جاهزة للإهداء تمنحك متعة الفتح.'],
      ['خدمة شخصية', 'فريق حقيقي على واتساب يساعدك على الاختيار والطلب والإهداء.'],
    ],
    makerTitle: 'علامة من شركة ساكو جلوبال',
    makerBody: 'VIRAZ من إبداع شركة ساكو جلوبال، وهي شركة مقرّها كيرالا تتاجر أيضًا بالمنتجات الطبيعية من الهند إلى الخليج وخارجه.',
    makerCta: 'زيارة ساكو جلوبال',
  },
}

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return pageMeta(locale, '/about', t.about.title, copy[locale].lead)
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  const c = copy[locale]
  return (
    <>
      <PageBanner locale={locale} eyebrow={t.about.eyebrow} title={t.about.title} body={c.lead} image="/images/hero/banner-mobile.webp" crumbs={[{ label: t.nav.about }]} />
      <Section>
        <div className="space-y-16 sm:space-y-24">
          {c.pillars.map((p, i) => (
            <div key={p.title} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <div data-reveal="" className={`relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift ${i % 2 ? 'md:order-2' : ''}`}>
                <Img src={p.image} alt="" fill sizes="(min-width: 768px) 45vw, 95vw" className="object-cover" />
              </div>
              <div>
                <Kicker>{p.kicker}</Kicker>
                <h2 className="font-display text-4xl font-semibold leading-tight text-noir-900 sm:text-5xl">{p.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="noir">
        <h2 className="text-center font-display text-4xl font-semibold text-gilded sm:text-5xl">{c.valuesTitle}</h2>
        <Ornament className="mt-6" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.values.map(([title, body]) => (
            <li key={title} data-reveal="" className="rounded-3xl border border-white/10 p-7">
              <span aria-hidden className="block size-2 rotate-45 bg-gold-500" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-gold-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="sand">
        <figure data-reveal="" className="mx-auto mb-14 max-w-xl overflow-hidden rounded-3xl shadow-lift">
          <Img src="/images/brand/range-poster.webp" alt="The complete VIRAZ collection: six Ayurvedic herbal beauty soaps and ten Premium Perfumes Collection eau de parfums" sizes="(min-width: 640px) 576px, 95vw" className="h-auto w-full" />
        </figure>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold text-noir-900">{c.makerTitle}</h2>
          <p className="mt-4 leading-relaxed text-muted">{c.makerBody}</p>
          <p className="mt-2 text-sm text-muted">{tr(site.address.lines, locale)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={href(locale, '/shop')}>{t.common.shopNow} <Arrow /></ButtonLink>
            <ButtonLink href={site.makerUrl} external variant="outline">{c.makerCta} <Arrow /></ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}
