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
const perfumeBenefits = [t('Long-lasting eau de parfum', 'ماء عطر يدوم طويلًا'), t('For men & women', 'للرجال والنساء'), t('An ideal gift', 'هدية مثالية')]

type Pair = [string, string]
/** One VIRAZ eau de parfum. Image is the bottle cut from the range poster (scripts/perfumes.py). */
function edpItem(id: string, name: Pair, tagline: Pair, description: Pair, notes: Pair[], family: Pair, accent: string): Product {
  return {
    id,
    name: t(...name),
    tagline: t(...tagline),
    image: `/images/perfumes/${id}.webp`,
    description: t(...description),
    notes: notes.map((n) => t(...n)),
    benefits: [...perfumeBenefits, t(...family)],
    howTo: perfumeHowTo,
    sizes: edp(1299, 1999), // TODO(verify): real sizes and MRPs per perfume
    accent,
  }
}

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
      'Ten signature eau de parfums for men and women — from deep Oud and Oudh to fresh Blue, soft Zen and radiant Rose. Each one blended with premium ingredients, made to last from morning to night and presented as an ideal gift.',
      'عشرة عطور مميزة للرجال والنساء — من العود والعود الملكي العميقين إلى «بلو» المنعش و«زِن» الناعم و«روز» المشرق. كل عطر ممزوج بمكوّنات فاخرة، يدوم من الصباح حتى المساء، ويُقدَّم كهدية مثالية.',
    ),
    cover: '/images/hero/banner-mobile.webp',
    theme: 'noir',
    // TODO(verify): notes, descriptions and accords below are inferred from each
    // perfume's name and bottle colour on the range poster — replace with the
    // perfumer's real notes before launch.
    items: [
      edpItem('oud', ['Oud', 'عود'], ['Deep & Majestic', 'عميق وملكي'],
        ['The king of fragrances: rich, smoky agarwood with warm woods — a deep, regal signature with remarkable staying power.', 'ملك العطور: خشب العود الغني المدخّن مع أخشاب دافئة — بصمة عميقة وملكية بثبات استثنائي.'],
        [['Oud', 'العود'], ['Woods', 'الأخشاب'], ['Smoke', 'الدخان']], ['Woody · smoky', 'خشبي · مدخّن'], '#1c1710'),
      edpItem('amber', ['Amber', 'عنبر'], ['Warm & Golden', 'دافئ وذهبي'],
        ['Glowing amber and soft vanilla wrapped in gentle spice — warm, golden and comforting from first spray to dry-down.', 'عنبر متوهّج وفانيليا ناعمة تحتضنها توابل لطيفة — دافئ وذهبي ومريح من الرشة الأولى حتى الأثر الأخير.'],
        [['Amber', 'العنبر'], ['Vanilla', 'الفانيليا'], ['Spice', 'التوابل']], ['Warm · oriental', 'دافئ · شرقي'], '#c58b1c'),
      edpItem('blue', ['Blue', 'بلو'], ['Fresh & Confident', 'منعش وواثق'],
        ['A cool, fresh burst of citrus and sea breeze over clean woods — confident, energising and easy to wear every day.', 'انتعاش بارد من الحمضيات ونسيم البحر فوق أخشاب نظيفة — واثق ومنشّط وسهل الاستخدام يوميًا.'],
        [['Citrus', 'الحمضيات'], ['Marine', 'نسيم البحر'], ['Woods', 'الأخشاب']], ['Fresh · aquatic', 'منعش · بحري'], '#1d3f9a'),
      edpItem('royal', ['Royal', 'رويال'], ['Regal & Radiant', 'ملكي ومشرق'],
        ['A luminous, regal blend of golden florals and amber woods in a crystal-capped bottle — made for celebrations.', 'مزيج ملكي مشرق من الزهور الذهبية والأخشاب العنبرية في زجاجة بغطاء كريستالي — صُنع للاحتفالات.'],
        [['Saffron', 'الزعفران'], ['Jasmine', 'الياسمين'], ['Amber', 'العنبر']], ['Floral · amber', 'زهري · عنبري'], '#c9a04a'),
      edpItem('floral', ['Floral', 'فلورال'], ['Elegant & Feminine', 'أنيق وأنثوي'],
        ['A rich bouquet of jasmine, violet and white flowers on a soft musky base — graceful by day, radiant by night.', 'باقة غنية من الياسمين والبنفسج والزهور البيضاء على قاعدة مسكية ناعمة — رقيق نهارًا ومتألّق ليلًا.'],
        [['Jasmine', 'الياسمين'], ['Violet', 'البنفسج'], ['Musk', 'المسك']], ['Floral · powdery', 'زهري · بودري'], '#6b2a8c'),
      edpItem('rose', ['Rose', 'روز'], ['Romantic & Fresh', 'رومانسي ومنعش'],
        ['Fresh-cut rose petals with a soft, sweet heart — romantic, bright and endlessly wearable.', 'بتلات ورد مقطوفة حديثًا بقلب ناعم وحلو — رومانسي ومشرق ومناسب لكل وقت.'],
        [['Rose', 'الورد'], ['Peony', 'الفاوانيا'], ['Soft musk', 'مسك ناعم']], ['Floral · rosy', 'زهري · وردي'], '#d6427a'),
      edpItem('musk', ['Musk', 'مسك'], ['Clean & Sensual', 'نظيف وجذّاب'],
        ['Soft white musk with green freshness and a velvety finish — a clean, close-to-skin signature for every day.', 'مسك أبيض ناعم مع انتعاش أخضر ولمسة مخملية — بصمة نظيفة قريبة من البشرة لكل يوم.'],
        [['White musk', 'المسك الأبيض'], ['Green notes', 'نوتات خضراء'], ['Woods', 'الأخشاب']], ['Musky · fresh', 'مسكي · منعش'], '#1f7a3a'),
      edpItem('oudh', ['Oudh', 'عود ملكي'], ['Rich & Opulent', 'غني وفاخر'],
        ['A ruby-red take on oud: precious agarwood softened with rose and saffron for an opulent, evening-ready trail.', 'عود بلمسة ياقوتية: خشب العود الثمين مع الورد والزعفران لأثر فاخر مثالي للأمسيات.'],
        [['Oud', 'العود'], ['Rose', 'الورد'], ['Saffron', 'الزعفران']], ['Woody · rose', 'خشبي · وردي'], '#a3161c'),
      edpItem('silver', ['Silver', 'سيلفر'], ['Crisp & Modern', 'منعش وعصري'],
        ['Crisp, cool and modern — aromatic lavender and bright citrus over smooth woods for a polished, everyday finish.', 'منعش وبارد وعصري — لافندر عطري وحمضيات مشرقة فوق أخشاب ناعمة لإطلالة أنيقة يومية.'],
        [['Lavender', 'اللافندر'], ['Citrus', 'الحمضيات'], ['Cedar', 'الأرز']], ['Fresh · aromatic', 'منعش · عطري'], '#7d848c'),
      edpItem('zen', ['Zen', 'زِن'], ['Soft & Serene', 'ناعم وهادئ'],
        ['A calm, soft cloud of powdery florals and gentle musk — serene, comforting and quietly elegant.', 'سحابة هادئة وناعمة من الزهور البودرية والمسك اللطيف — هادئ ومريح وأنيق بهدوء.'],
        [['Iris', 'السوسن'], ['Cherry blossom', 'زهر الكرز'], ['Musk', 'المسك']], ['Soft · powdery', 'ناعم · بودري'], '#e07fa6'),
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
        id: 'rose-soap',
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
