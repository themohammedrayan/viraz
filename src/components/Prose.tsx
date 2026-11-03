import type { ReactNode } from 'react'

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-3xl border border-line bg-white p-6 leading-relaxed text-ink-2 shadow-card sm:p-12 [&_a]:font-semibold [&_a]:text-gold-700 [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-noir-900 [&_h2:first-child]:mt-0 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:ps-5">
      {children}
    </div>
  )
}
