import type { L } from '@/i18n/config'

const t = (en: string, ar: string): L => ({ en, ar })

/** Answers marked TODO(verify) describe policies the business must confirm. */
export const faqs: { q: L; a: L }[] = [
  {
    q: t('How do I place an order?', 'كيف أقدّم طلبًا؟'),
    a: t(
      'Add products to your bag, enter your delivery details and tap “Send order on WhatsApp”. Your order arrives with us already filled in; we reply to confirm stock, the delivery charge and payment. Nothing is charged until you confirm.',
      'أضف المنتجات إلى حقيبتك، وأدخل بيانات التوصيل، ثم اضغط «أرسل الطلب عبر واتساب». يصلنا طلبك جاهزًا ونردّ لتأكيد التوفر ورسوم التوصيل والدفع. لا يُخصم أي مبلغ قبل تأكيدك.',
    ),
  },
  {
    q: t('Where do you deliver and how long does it take?', 'إلى أين توصلون وكم يستغرق التوصيل؟'),
    a: t(
      'We deliver across India by courier. Orders are usually dispatched within 1–2 working days and arrive in 3–7 working days depending on your PIN code. For orders to the GCC, please message us on WhatsApp.',
      'نوصل إلى جميع أنحاء الهند عبر شركات الشحن. تُشحن الطلبات عادةً خلال يوم إلى يومي عمل وتصل خلال 3–7 أيام عمل حسب الرمز البريدي. للطلبات إلى دول الخليج، راسلنا عبر واتساب.',
    ), // TODO(verify)
  },
  {
    q: t('How can I pay?', 'كيف يمكنني الدفع؟'),
    a: t(
      'UPI (Google Pay, PhonePe, Paytm) or bank transfer after we confirm your order. Cash on delivery is available for selected PIN codes.',
      'عبر UPI (Google Pay وPhonePe وPaytm) أو التحويل البنكي بعد تأكيد طلبك. الدفع عند الاستلام متاح لرموز بريدية مختارة.',
    ), // TODO(verify)
  },
  {
    q: t('How long does a VIRAZ perfume last?', 'كم يدوم عطر VIRAZ؟'),
    a: t(
      'Our perfumes are eau de parfum concentration, made to last through the day. Longevity varies with skin type and weather — apply to pulse points and lightly on clothing for the longest wear.',
      'عطورنا بتركيز ماء العطر، ومصنوعة لتدوم طوال اليوم. يختلف الثبات حسب نوع البشرة والطقس — ضعه على نقاط النبض ورذاذًا خفيفًا على الملابس لأطول ثبات.',
    ),
  },
  {
    q: t('Are the soaps suitable for sensitive skin?', 'هل الصابون مناسب للبشرة الحساسة؟'),
    a: t(
      'Our Ayurvedic beauty soaps are made for gentle daily use. If you have very sensitive skin or allergies, check the ingredients on the pack and do a small patch test first. Aloe Vera, Milk and Honey Oat Milk are good places to start.',
      'صابون التجميل الأيورفيدي لدينا مصنوع للاستخدام اليومي اللطيف. إذا كانت بشرتك حساسة جدًا أو لديك حساسية، راجع المكوّنات على العبوة وجرّب على مساحة صغيرة أولًا. الألوفيرا والحليب والعسل بالشوفان والحليب خيارات جيدة للبداية.',
    ),
  },
  {
    q: t('Can I return or exchange a product?', 'هل يمكنني إرجاع منتج أو استبداله؟'),
    a: t(
      'For hygiene reasons opened perfumes and soaps cannot be returned. If your parcel arrives damaged or you receive the wrong item, send us a photo on WhatsApp within 48 hours of delivery and we will replace it.',
      'لأسباب صحية لا يمكن إرجاع العطور والصابون بعد فتحها. إذا وصلك الطرد تالفًا أو استلمت منتجًا خاطئًا، أرسل لنا صورة عبر واتساب خلال 48 ساعة من الاستلام وسنستبدله.',
    ), // TODO(verify)
  },
  {
    q: t('Do you offer gift packing or bulk orders?', 'هل تقدّمون تغليف الهدايا أو الطلبات بالجملة؟'),
    a: t(
      'Yes. Add a gift note in the order notes, or visit Wholesale & Gifting for weddings, events, corporate gifts and retailer pricing.',
      'نعم. أضف رسالة الإهداء في ملاحظات الطلب، أو زر صفحة الجملة والهدايا للأعراس والمناسبات وهدايا الشركات وأسعار التجّار.',
    ),
  },
  {
    q: t('Who makes VIRAZ?', 'من يصنع VIRAZ؟'),
    a: t(
      'VIRAZ is a brand of Saaco Global Company, based in Kerala, India.',
      'VIRAZ علامة تجارية لشركة ساكو جلوبال، ومقرّها كيرالا، الهند.',
    ),
  },
]
