import { getDict } from '@/i18n/dict'
import { site } from '@/content/site'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { PageBanner } from '@/components/PageBanner'
import { Prose } from '@/components/Prose'
import { Section } from '@/components/ui'

// TODO(verify): shipping, returns and terms below are sensible defaults — the business must confirm them.
export async function generateMetadata({ params }: PageProps<'/[locale]/legal'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return pageMeta(locale, '/legal', t.footer.legal, locale === 'ar' ? 'سياسات الشحن والإرجاع وشروط البيع لدى VIRAZ.' : 'VIRAZ shipping, returns and terms of sale.')
}

export default async function LegalPage({ params }: PageProps<'/[locale]/legal'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  const ar = locale === 'ar'
  return (
    <>
      <PageBanner locale={locale} title={t.footer.legal} crumbs={[{ label: t.footer.legal }]} />
      <Section>
        {ar ? (
          <Prose>
            <h2>الشحن</h2>
            <p>نشحن إلى جميع أنحاء الهند عبر شركات شحن موثوقة. تُشحن الطلبات عادةً خلال يوم إلى يومي عمل بعد تأكيد الدفع (أو تأكيد الطلب للدفع عند الاستلام)، وتصل خلال 3–7 أيام عمل. تُؤكَّد رسوم التوصيل عبر واتساب قبل الدفع.</p>
            <h2>الأسعار والدفع</h2>
            <p>جميع الأسعار المعروضة هي السعر الأقصى للبيع بالتجزئة (MRP) بالروبية الهندية وتشمل الضرائب. نقبل الدفع عبر UPI والتحويل البنكي، والدفع عند الاستلام لرموز بريدية مختارة. لا يكتمل الطلب إلا بعد تأكيدنا له عبر واتساب أو البريد الإلكتروني.</p>
            <h2>الإرجاع والاستبدال</h2>
            <p>لأسباب صحية، لا يمكن إرجاع العطور والصابون بعد فتحها. إذا وصلك طرد تالف أو منتج خاطئ، أرسل صورة عبر واتساب خلال 48 ساعة من الاستلام وسنستبدله مجانًا.</p>
            <h2>الاستخدام الآمن</h2>
            <p>للاستخدام الخارجي فقط. تجنّب ملامسة العينين. جرّب المنتج على مساحة صغيرة من الجلد إن كانت بشرتك حساسة. العطور قابلة للاشتعال؛ احفظها بعيدًا عن الحرارة وعن متناول الأطفال.</p>
            <h2>الشركة</h2>
            <p>VIRAZ علامة تجارية لـ{site.legalName}، {site.address.lines.ar}. للتواصل: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> · <span dir="ltr">{site.contact.phone}</span></p>
            {site.licences.length > 0 && <ul>{site.licences.map((l) => <li key={l.name}>{l.name}: {l.number}</li>)}</ul>}
          </Prose>
        ) : (
          <Prose>
            <h2>Shipping</h2>
            <p>We ship across India with trusted courier partners. Orders are usually dispatched within 1–2 working days of payment (or of order confirmation for cash on delivery) and arrive in 3–7 working days. The delivery charge is confirmed on WhatsApp before you pay.</p>
            <h2>Prices & payment</h2>
            <p>All prices shown are MRP in Indian rupees, inclusive of all taxes. We accept UPI and bank transfer, and cash on delivery for selected PIN codes. An order is only complete once we confirm it on WhatsApp or by email.</p>
            <h2>Returns & replacements</h2>
            <p>For hygiene reasons, opened perfumes and soaps cannot be returned. If your parcel arrives damaged or you receive the wrong item, send us a photo on WhatsApp within 48 hours of delivery and we will replace it free of charge.</p>
            <h2>Safe use</h2>
            <p>For external use only. Avoid contact with eyes. Patch-test on a small area if you have sensitive skin. Perfumes are flammable; keep away from heat and out of reach of children.</p>
            <h2>Company</h2>
            <p>VIRAZ is a brand of {site.legalName}, {site.address.lines.en}. Contact: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> · <span dir="ltr">{site.contact.phone}</span></p>
            {site.licences.length > 0 && <ul>{site.licences.map((l) => <li key={l.name}>{l.name}: {l.number}</li>)}</ul>}
          </Prose>
        )}
      </Section>
    </>
  )
}
