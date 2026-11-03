import { getDict } from '@/i18n/dict'
import { site } from '@/content/site'
import { getLocale } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { PageBanner } from '@/components/PageBanner'
import { Prose } from '@/components/Prose'
import { Section } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/[locale]/privacy'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return pageMeta(locale, '/privacy', t.footer.privacy, locale === 'ar' ? 'كيف تتعامل VIRAZ مع بياناتك.' : 'How VIRAZ handles your information.')
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
  const locale = await getLocale(params)
  const t = getDict(locale)
  return (
    <>
      <PageBanner locale={locale} title={t.footer.privacy} crumbs={[{ label: t.footer.privacy }]} />
      <Section>
        {locale === 'ar' ? (
          <Prose>
            <h2>ما الذي نجمعه</h2>
            <p>لا يحتوي هذا الموقع على حسابات مستخدمين ولا يخزّن بيانات الطلب على خوادمنا. عند إرسال طلب أو استفسار، يُجهَّز النص في متصفحك وتُرسله أنت بنفسك عبر واتساب أو بريدك الإلكتروني. نستخدم هذه المعلومات فقط لتنفيذ طلبك والتواصل معك.</p>
            <h2>الحقيبة</h2>
            <p>تُحفظ محتويات حقيبتك (معرّفات المنتجات والكميات فقط) في التخزين المحلي لمتصفحك على جهازك، ويمكنك مسحها في أي وقت.</p>
            <h2>الإحصاءات</h2>
            <p>نستخدم Vercel Web Analytics وSpeed Insights لقياس الزيارات والأداء بشكل مجمّع ودون ملفات تعريف الارتباط (الكوكيز).</p>
            <h2>تواصل معنا</h2>
            <p>لأي طلب يتعلق ببياناتك: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
          </Prose>
        ) : (
          <Prose>
            <h2>What we collect</h2>
            <p>This website has no user accounts and does not store order details on our servers. When you send an order or enquiry, the message is prepared in your browser and you send it yourself through WhatsApp or your email app. We use that information only to fulfil your order and to reply to you.</p>
            <h2>Your bag</h2>
            <p>Your bag (product ids and quantities only) is saved in your browser’s local storage on your own device. You can clear it at any time.</p>
            <h2>Analytics</h2>
            <p>We use Vercel Web Analytics and Speed Insights to measure visits and page performance in aggregate, without cookies.</p>
            <h2>Contact</h2>
            <p>For any request about your data: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
          </Prose>
        )}
      </Section>
    </>
  )
}
