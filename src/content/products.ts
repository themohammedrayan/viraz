import type { L } from '@/i18n/config'

/**
 * The catalogue. Product names, benefits and notes are taken from the pack
 * and bottle artwork. Sizes and MRPs are placeholders marked TODO(verify):
 * replace them with the real price list before launch.
 */

export type Size = { id: string; label: L; mrp: number }

export type Product = {
  id: string
  name: L
  /** Short line under the name, e.g. "Elegant & Feminine" */
  tagline: L
  image: string
  description: L
  /** Perfumes: key notes. Soaps: hero ingredients. */
  notes: L[]
  /** Benefit lines (soaps: as printed on the box). */
  benefits: L[]
  howTo: L
  sizes: Size[]
  /** Accent colour used for small details on the product page. */
  accent: string
  badge?: L
  /** Full ingredient list (INCI) once supplied by the manufacturer. */
  ingredients?: L
}

export type Category = {
  slug: 'perfumes' | 'soaps' | 'cosmetics'
  name: L
  short: L
  intro: L
  cover: string
  /** Dark luxury (perfumes) or light herbal (soaps) presentation. */
  theme: 'noir' | 'herbal' | 'ivory'
  comingSoon?: boolean
  items: Product[]
}

const t = (en: string, ar: string): L => ({ en, ar })

// TODO(verify): perfume sizes and MRPs
const edp = (mrp50: number, mrp100: number): Size[] => [
  { id: '50ml', label: t('50 ml', '50 مل'), mrp: mrp50 },
  { id: '100ml', label: t('100 ml', '100 مل'), mrp: mrp100 },
]
// TODO(verify): soap MRPs and pack options
const bar = (mrp: number): Size[] => [
  { id: '1x125g', label: t('125 g', '125 غ'), mrp },
  { id: '3x125g', label: t('Pack of 3 × 125 g', 'عبوة 3 × 125 غ'), mrp: mrp * 3 - 30 },
]

const perfumeHowTo = t(
  'Spray from 15–20 cm onto pulse points: wrists, neck and behind the ears. Do not rub — let the fragrance settle and unfold on the skin. For longer wear, also mist lightly onto clothing.',
  'رُشّ من مسافة 15–20 سم على نقاط النبض: المعصمين والرقبة وخلف الأذنين. لا تفرك، بل اترك العطر يستقرّ وينفتح على البشرة. لثبات أطول، رُشّ رذاذًا خفيفًا على الملابس.',
)
const soapHowTo = t(
  'Work the bar into a rich lather with water, massage gently over face and body, then rinse. Use daily. Keep the soap on a draining dish between uses so it lasts longer.',
  'اصنع رغوة غنية بالصابون والماء، ودلّك بلطف على الوجه والجسم ثم اشطف. للاستخدام اليومي. ضع الصابونة على صحن مُصفّى بين الاستخدامات لتدوم أطول.',
)

export const categories: Category[] = [
  {
    slug: 'perfumes',
    name: t('Perfumes', 'العطور'),
    short: t('Long-lasting eau de parfums inspired by Arabian tradition.', 'عطور فاخرة تدوم طويلًا مستوحاة من التراث العربي.'),
    intro: t(
      'Each VIRAZ eau de parfum is blended with premium ingredients — oud, amber, saffron, jasmine and rose — for a fragrance that lasts from morning to night. Bold, refined and made for every moment.',
      'يُمزج كل عطر من VIRAZ بمكوّنات فاخرة — العود والعنبر والزعفران والياسمين والورد — ليمنحك عطرًا يدوم من الصباح حتى المساء. جريء وراقٍ ومصنوع لكل لحظة.',
    ),
    cover: '/images/perfumes/spicy-amber.webp',
    theme: 'noir',
    items: [
      {
        id: 'golden-flora',
        name: t('Golden Flora', 'جولدن فلورا'),
        tagline: t('Elegant & Feminine', 'أنيق وأنثوي'),
        image: '/images/perfumes/golden-flora.webp',
        description: t(
          'A luminous floral bouquet. White jasmine and soft rose open over a warm, creamy vanilla base — graceful by day, radiant by night.',
          'باقة زهرية مشرقة. ينفتح الياسمين الأبيض والورد الناعم على قاعدة دافئة كريمية من الفانيليا — رقيق نهارًا ومتألّق ليلًا.',
        ),
        notes: [t('Jasmine', 'الياسمين'), t('Rose', 'الورد'), t('Vanilla', 'الفانيليا')],
        benefits: [t('Long-lasting eau de parfum', 'ماء عطر يدوم طويلًا'), t('Floral · sweet', 'زهري · حلو'), t('Ideal for daytime and celebrations', 'مثالي للنهار والمناسبات')],
        howTo: perfumeHowTo,
        sizes: edp(1299, 1999),
        accent: '#c9a04a',
        badge: t('Bestseller', 'الأكثر مبيعًا'), // TODO(verify)
      },
      {
        id: 'spicy-amber',
        name: t('Spicy Amber', 'سبايسي أمبر'),
        tagline: t('Bold & Irresistible', 'جريء ولا يُقاوَم'),
        image: '/images/perfumes/spicy-amber.webp',
        description: t(
          'Precious saffron and warm spices wrapped in rich amber. A confident, magnetic trail for evenings and special occasions.',
          'زعفران ثمين وتوابل دافئة يحتضنها عنبر غني. أثر واثق وجذّاب للأمسيات والمناسبات الخاصة.',
        ),
        notes: [t('Saffron', 'الزعفران'), t('Amber', 'العنبر'), t('Spices', 'التوابل')],
        benefits: [t('Long-lasting eau de parfum', 'ماء عطر يدوم طويلًا'), t('Warm · spicy · oriental', 'دافئ · حار · شرقي'), t('Perfect for evenings', 'مثالي للأمسيات')],
        howTo: perfumeHowTo,
        sizes: edp(1299, 1999),
        accent: '#b5651d',
      },
      {
        id: 'royal-oud',
        name: t('Royal Oud', 'رويال عود'),
        tagline: t('Deep & Majestic', 'عميق وملكي'),
        image: '/images/perfumes/royal-oud.webp',
        description: t(
          'The king of fragrances. Smoky oud, resinous amber and soft musk create a deep, regal signature with remarkable staying power.',
          'ملك العطور. عود مدخّن وعنبر راتنجي ومسك ناعم يصنعون بصمة عميقة وملكية بثبات استثنائي.',
        ),
        notes: [t('Oud', 'العود'), t('Amber', 'العنبر'), t('Musk', 'المسك')],
        benefits: [t('Long-lasting eau de parfum', 'ماء عطر يدوم طويلًا'), t('Woody · smoky · rich', 'خشبي · مدخّن · غني'), t('A signature for every occasion', 'بصمة لكل مناسبة')],
        howTo: perfumeHowTo,
        sizes: edp(1499, 2299),
        accent: '#7a5a2a',
        badge: t('Signature', 'التوقيع'),
      },
      {
        id: 'viraz-oud',
        name: t('VIRAZ Oud', 'فيراز عود'), // TODO(verify): product name on the bottle reads "Oud Perfumes"
        tagline: t('Warm & Timeless', 'دافئ وخالد'),
        image: '/images/perfumes/viraz-oud.webp',
        description: t(
          'A classic oud eau de parfum in the house’s signature crown bottle — warm, polished and timeless, for those who love traditional Arabian perfumery.',
          'عطر عود كلاسيكي في زجاجة التاج المميزة للدار — دافئ وأنيق وخالد، لعشّاق العطور العربية التقليدية.',
        ),
        notes: [t('Oud', 'العود'), t('Woods', 'الأخشاب'), t('Amber', 'العنبر')], // TODO(verify)
        benefits: [t('Long-lasting eau de parfum', 'ماء عطر يدوم طويلًا'), t('Woody · warm', 'خشبي · دافئ'), t('Day to night', 'من النهار إلى الليل')],
        howTo: perfumeHowTo,
        sizes: edp(1499, 2299),
        accent: '#9a6a2c',
      },
    ],
  },
  {
    slug: 'soaps',
    name: t('Ayurvedic Soaps', 'الصابون الأيورفيدي'),
    short: t('Premium herbal beauty soaps for healthy, glowing skin.', 'صابون تجميل عشبي فاخر لبشرة صحية ومتوهّجة.'),
    intro: t(
      'The VIRAZ Ayurvedic beauty soap range brings time-honoured herbal care to your daily ritual — aloe vera, neem, sandal, rose, papaya, milk, honey and charcoal — in rich, gentle 125 g bars made in Kerala.',
      'تجمع مجموعة صابون التجميل الأيورفيدي من VIRAZ العناية العشبية العريقة في روتينك اليومي — الألوفيرا والنيم والصندل والورد والبابايا والحليب والعسل والفحم — في قوالب غنية ولطيفة بوزن 125 غ مصنوعة في كيرالا.',
    ),
    cover: '/images/soaps/range.webp',
    theme: 'herbal',
    items: [
      {
        id: 'aloe-vera',
        name: t('Aloe Vera Beauty Soap', 'صابون الألوفيرا للتجميل'),
        tagline: t('Moisturises & protects', 'يرطّب ويحمي'),
        image: '/images/soaps/aloe-vera.webp',
        description: t(
          'Cooling aloe vera gel in a gentle Ayurvedic bar that hydrates as it cleanses, leaving skin soft, fresh and comfortable.',
          'جل الألوفيرا المنعش في قالب أيورفيدي لطيف يرطّب أثناء التنظيف، ليترك البشرة ناعمة ومنتعشة ومرتاحة.',
        ),
        notes: [t('Aloe vera', 'الألوفيرا')],
        benefits: [t('Moisturises skin', 'يرطّب البشرة'), t('Nourishes & protects', 'يغذّي ويحمي'), t('For soft & healthy skin', 'لبشرة ناعمة وصحية')],
        howTo: soapHowTo,
        sizes: bar(99),
        accent: '#2f7d32',
      },
      {
        id: 'aloe-vera-neem',
        name: t('Aloe Vera & Neem Beauty Soap', 'صابون الألوفيرا والنيم للتجميل'),
        tagline: t('Soothes & clarifies', 'يهدّئ وينقّي'),
        image: '/images/soaps/aloe-vera-neem.webp',
        description: t(
          'Neem, the Ayurvedic purifier, meets soothing aloe vera in a cooling bar for clear, balanced skin.',
          'يلتقي النيم، المنقّي الأيورفيدي، مع الألوفيرا المهدّئة في قالب منعش لبشرة صافية ومتوازنة.',
        ),
        notes: [t('Aloe vera', 'الألوفيرا'), t('Neem', 'النيم')],
        benefits: [t('Soothes & cools skin', 'يهدّئ البشرة ويبرّدها'), t('Helps reduce acne & blemishes', 'يساعد على تقليل حب الشباب والشوائب'), t('For healthy & clear skin', 'لبشرة صحية وصافية')],
        howTo: soapHowTo,
        sizes: bar(99),
        accent: '#2f7d32',
        badge: t('New', 'جديد'),
      },
      {
        id: 'papaya',
        name: t('Papaya Beauty Soap', 'صابون البابايا للتجميل'),
        tagline: t('Brightens & renews', 'يفتّح ويجدّد'),
        image: '/images/soaps/papaya.webp',
        description: t(
          'Ripe papaya, rich in natural fruit enzymes, gently polishes away dull skin to reveal a brighter, more radiant complexion.',
          'البابايا الناضجة الغنية بإنزيمات الفاكهة الطبيعية تزيل البشرة الباهتة بلطف لتكشف عن بشرة أكثر إشراقًا ونضارة.',
        ),
        notes: [t('Papaya', 'البابايا')],
        benefits: [t('Brightens skin', 'يفتّح البشرة'), t('Removes dead skin cells', 'يزيل خلايا الجلد الميتة'), t('For soft & radiant skin', 'لبشرة ناعمة ومشرقة')],
        howTo: soapHowTo,
        sizes: bar(99),
        accent: '#e8731a',
      },
      {
        id: 'rose',
        name: t('Rose Beauty Soap', 'صابون الورد للتجميل'),
        tagline: t('Softens & glows', 'ينعّم ويضيء'),
        image: '/images/soaps/rose.webp',
        description: t(
          'Delicately scented with rose, this bar nourishes and softens skin while keeping its natural glow.',
          'صابون بعطر الورد الرقيق يغذّي البشرة وينعّمها مع الحفاظ على توهّجها الطبيعي.',
        ),
        notes: [t('Rose', 'الورد')],
        benefits: [t('Nourishes & softens skin', 'يغذّي البشرة وينعّمها'), t('Maintains natural glow', 'يحافظ على التوهّج الطبيعي'), t('For fresh & healthy skin', 'لبشرة منتعشة وصحية')],
        howTo: soapHowTo,
        sizes: bar(99),
        accent: '#c2185b',
      },
      {
        id: 'sandal',
        name: t('Sandal Beauty Soap', 'صابون الصندل للتجميل'),
        tagline: t('Evens & nourishes', 'يوحّد وينعّم'),
        image: '/images/soaps/sandal.webp',
        description: t(
          'Fragrant sandalwood, treasured in Ayurveda for centuries, in a creamy bar that nourishes skin and helps even its tone.',
          'خشب الصندل العطري، المحبوب في الأيورفيدا منذ قرون، في قالب كريمي يغذّي البشرة ويساعد على توحيد لونها.',
        ),
        notes: [t('Sandalwood', 'خشب الصندل')],
        benefits: [t('Nourishes & softens skin', 'يغذّي البشرة وينعّمها'), t('Helps even skin tone', 'يساعد على توحيد لون البشرة'), t('For healthy & radiant skin', 'لبشرة صحية ومشرقة')],
        howTo: soapHowTo,
        sizes: bar(109),
        accent: '#8d4f22',
      },
      {
        id: 'charcoal',
        name: t('Charcoal Powder Beauty Soap', 'صابون مسحوق الفحم للتجميل'),
        tagline: t('Deep-cleansing', 'تنظيف عميق'),
        image: '/images/soaps/charcoal.webp',
        description: t(
          'Activated charcoal powder draws out everyday impurities, enriched with vitamin E to keep skin nourished — a bold black bar for a deep, fresh clean.',
          'مسحوق الفحم المنشّط يسحب الشوائب اليومية، مع فيتامين E لتغذية البشرة — قالب أسود جريء لتنظيف عميق ومنعش.',
        ),
        notes: [t('Charcoal', 'الفحم'), t('Vitamin E', 'فيتامين E')],
        benefits: [t('Natural skin nourisher', 'مغذٍّ طبيعي للبشرة'), t('Enriched with vitamin E', 'غني بفيتامين E'), t('Deep, fresh cleanse', 'تنظيف عميق ومنعش')],
        howTo: soapHowTo,
        sizes: bar(109),
        accent: '#1c1710',
      },
      {
        id: 'milk',
        name: t('Milk Beauty Soap', 'صابون الحليب للتجميل'),
        tagline: t('Creamy & soft', 'كريمي وناعم'),
        image: '/images/soaps/milk.webp',
        description: t(
          'A rich, creamy milk bar that nourishes and moisturises, helping skin keep its natural softness wash after wash.',
          'قالب حليب غني وكريمي يغذّي ويرطّب، ويساعد البشرة على الاحتفاظ بنعومتها الطبيعية مع كل غسلة.',
        ),
        notes: [t('Milk', 'الحليب')],
        benefits: [t('Nourishes & moisturises skin', 'يغذّي البشرة ويرطّبها'), t('Helps maintain natural softness', 'يساعد على الحفاظ على النعومة الطبيعية'), t('For healthy & radiant skin', 'لبشرة صحية ومشرقة')],
        howTo: soapHowTo,
        sizes: bar(99),
        accent: '#b8862b',
      },
      {
        id: 'honey-oat-milk',
        name: t('Honey Oat Milk Beauty Soap', 'صابون العسل والشوفان والحليب للتجميل'),
        tagline: t('Softens & smooths', 'ينعّم ويملّس'),
        image: '/images/soaps/honey-oat-milk.webp',
        description: t(
          'Golden honey, gentle oats and creamy milk come together in a comforting bar that softens and smooths dry skin.',
          'يجتمع العسل الذهبي والشوفان اللطيف والحليب الكريمي في قالب مريح ينعّم البشرة الجافة ويملّسها.',
        ),
        notes: [t('Honey', 'العسل'), t('Oats', 'الشوفان'), t('Milk', 'الحليب')],
        benefits: [t('Nourishes & moisturises skin', 'يغذّي البشرة ويرطّبها'), t('Softens & smoothens skin', 'ينعّم البشرة ويملّسها'), t('For healthy & radiant skin', 'لبشرة صحية ومشرقة')],
        howTo: soapHowTo,
        sizes: bar(109),
        accent: '#c58b1c',
        badge: t('New', 'جديد'),
      },
    ],
  },
  {
    slug: 'cosmetics',
    name: t('Cosmetics', 'مستحضرات التجميل'),
    short: t('Luxury skin and body care — launching soon.', 'عناية فاخرة بالبشرة والجسم — قريبًا.'),
    intro: t(
      'We are preparing a range of VIRAZ cosmetics in the same spirit as our perfumes and soaps: premium ingredients, beautiful finishes and honest care. Leave your number on WhatsApp and be the first to know.',
      'نحضّر مجموعة من مستحضرات تجميل VIRAZ بروح عطورنا وصابوننا نفسها: مكوّنات فاخرة ولمسات جميلة وعناية صادقة. اترك رقمك على واتساب لتكون أول من يعلم.',
    ),
    cover: '/images/perfumes/viraz-oud.webp',
    theme: 'ivory',
    comingSoon: true,
    items: [],
  },
]

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)

export const allProducts = categories.flatMap((c) => c.items.map((p) => ({ c, p })))

export function findProduct(id: string) {
  return allProducts.find((x) => x.p.id === id)
}

export function findSize(productId: string, sizeId: string) {
  const r = findProduct(productId)
  const s = r?.p.sizes.find((x) => x.id === sizeId)
  return r && s ? { ...r, s } : null
}

export const fromPrice = (p: Product) => Math.min(...p.sizes.map((s) => s.mrp))
