import Link from 'next/link'
import { buttonClass } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center bg-noir-950 px-4 py-20 text-center text-white">
      <div>
        <p className="font-display text-9xl font-semibold text-gilded">404</p>
        <h1 className="mt-4 font-display text-3xl">Page not found · الصفحة غير موجودة</h1>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/en" className={buttonClass('gold')}>Home</Link>
          <Link href="/ar" className={buttonClass('light')}>الرئيسية</Link>
        </div>
      </div>
    </section>
  )
}
