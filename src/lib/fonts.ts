import { Cairo, Cormorant_Garamond, Inter } from 'next/font/google'

export const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'], variable: '--font-display-en', display: 'swap' })
export const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body-en', display: 'swap' })
export const arabic = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-ar', display: 'swap', preload: false })

export const fontVars = [display, body, arabic].map((f) => f.variable).join(' ')
