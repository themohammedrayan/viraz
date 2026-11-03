import { Plus } from 'lucide-react'
import { tr, type L, type Locale } from '@/i18n/config'
import { faqs } from '@/content/faq'

/** Native <details> accordion: works without JavaScript and is keyboard accessible. */
export function FaqList({ locale, items = faqs }: { locale: Locale; items?: { q: L; a: L }[] }) {
  return (
    <div className="divide-y divide-line rounded-3xl border border-line bg-white shadow-card">
      {items.map((f, i) => (
        <details key={i} className="group px-6 sm:px-8" name="faq">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-xl font-semibold text-noir-900 [&::-webkit-details-marker]:hidden">
            {tr(f.q, locale)}
            <Plus className="size-5 shrink-0 text-gold-600 transition-transform group-open:rotate-45" aria-hidden />
          </summary>
          <p className="pb-6 leading-relaxed text-muted">{tr(f.a, locale)}</p>
        </details>
      ))}
    </div>
  )
}
