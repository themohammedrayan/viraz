# VIRAZ — website

Bilingual (English / Arabic) brand and shop website for **VIRAZ — The Essence of Elegance**: luxury perfumes, cosmetics and premium Ayurvedic beauty soaps by Saaco Global Company, Kerala, India.

- **Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS 4 · lucide icons, the same setup as `saaco-global`
- **Design:** warm noir, polished gold and ivory from the emblem, with herbal green for the soap range (`src/app/globals.css`). Fonts are Cormorant Garamond for display, Inter for body text and Cairo for Arabic
- **Hosting:** Vercel. `vercel.json` handles the `/` → `/en` or `/ar` redirect (Accept-Language) plus the security, HSTS and cache headers
- **No backend.** Orders and enquiries are put together in the browser, and the customer sends them through WhatsApp or email

## Features

| Feature | Where |
|---|---|
| English + Arabic (full RTL), hreflang, language switcher | `src/i18n/`, `app/[locale]/` |
| Catalogue: 10 eau de parfums, 8 Ayurvedic soaps, cosmetics "coming soon" | `src/content/products.ts` |
| Shop with search and category filter, category pages, a page per product (18 × EN/AR) | `app/[locale]/shop/` |
| **Shopping bag**: size + quantity, saved on the device, priced from the catalogue | `src/lib/bag-reducer.ts`, `src/lib/bag-store.tsx`, `src/components/BagView.tsx` |
| **WhatsApp checkout**: delivery details, payment preference, order reference `VZ-YYMMDD-XXXX`, email fallback | `src/lib/order.ts` |
| Wholesale, gifting and corporate enquiry form | `app/[locale]/wholesale`, `src/components/WholesaleForm.tsx` |
| Our story, contact, FAQ (FAQPage data), shipping/returns/terms, privacy | `app/[locale]/…` |
| SEO: per-page metadata, OG/Twitter cards, sitemap with alternates, robots, Organization/Product/Breadcrumb JSON-LD | `src/lib/seo.ts`, `app/sitemap.ts` |
| Vercel Web Analytics + Speed Insights (no cookies) | `app/[locale]/layout.tsx` |

## Editing content

- **Products, sizes, prices, notes, benefits:** `src/content/products.ts`. Each product has an English and an Arabic value for every text
- **Phone, WhatsApp, email, address, social links, licences:** `src/content/site.ts`
- **FAQ:** `src/content/faq.ts`. **UI text:** `src/i18n/dict.ts`. **Shipping, returns and terms:** `app/[locale]/legal/page.tsx`
- **Images:** put the original in `assets-src/` (git-ignored), add a line to `PHOTOS` in `scripts/images.mjs`, then run `npm run images`. This writes WebP files to `public/images/` and updates `src/content/image-dims.json`. Three helpers prepare generated sources first:
  - `python3 scripts/logo.py` builds the crisp gold and ink logos and the icons from the alpha channel of the supplied glow logo (`assets-src/logo-glow.png`)
  - `python3 scripts/perfumes.py` cuts the ten perfume bottles and the collection band from the range poster (`assets-src/range-poster-full.png`)
  - `python3 scripts/collection.py` builds the home hero composite (perfumes + soaps)

## ⚠️ Confirm before launch: `TODO(verify)`

These are placeholders or sensible defaults. **The business must confirm them before launch:**

1. **Prices and sizes.** Perfumes show 50 ml / 100 ml and soaps show 125 g / pack of 3 with placeholder MRPs (`products.ts`, the `edp()` and `bar()` helpers). Replace them with the real price list
2. **Perfumes.** The ten perfumes (Oud, Amber, Blue, Royal, Floral, Rose, Musk, Oudh, Silver, Zen) come from the range poster. Their **notes, descriptions and taglines are inferred from each name and bottle colour**, so confirm them with the perfumer. Also confirm that Oud and Oudh are two different products. The "New" badges on soaps are placeholders
3. **Bottle photos.** Each perfume image is cut from the poster at about 120×240 px and shown on a styled gold card. Send a high-resolution photo of each bottle (plain background) to replace them
4. **Email** `care@viraz.in`: create this mailbox or change it in `site.ts`
5. **Claims and regulation.** The soaps are sold as "Ayurvedic". In India that needs an AYUSH licence for Ayurvedic products; otherwise the wording should be "herbal". Confirm which applies, and add the licence numbers (cosmetics / AYUSH) to `site.licences` so they appear on the product and legal pages. Benefit lines are copied from the pack artwork. "Helps reduce acne & blemishes" (Aloe Vera & Neem) is a claim regulators look at closely
6. **Policies:** delivery times, cash on delivery, the 48-hour damage-replacement window, and GCC shipping (`faq.ts`, `legal/page.tsx`)
7. **Legal entity name** (`site.legalName`) and the address shown (currently Saaco Global's Calicut head office)
8. **Social links:** Instagram and Facebook stay hidden until URLs are added. The old site showed social icons that linked nowhere
9. **Arabic copy:** have a native speaker review it
10. **Ingredient lists (INCI):** add them per product (`ingredients`) when they're available
11. **Free-shipping threshold:** set `site.freeShippingOver` if there is one

Changes from the old WordPress site: the made-up counters ("512+ sales", "750+ product investment") and the contradictory "25 Years" / "10+ Years" claims were removed and not carried over.

## Going live on viraz.in

1. Import the repo into Vercel. The framework preset (Next.js) and `vercel.json` are picked up automatically
2. Set the env var `NEXT_PUBLIC_SITE_URL=https://viraz.in`
3. Add `viraz.in` and `www.viraz.in` as domains in Vercel, then point DNS at Vercel (A record `76.76.21.21` for the apex and CNAME `cname.vercel-dns.com` for `www`, or whatever the Vercel dashboard shows)
4. Enable Web Analytics and Speed Insights in the Vercel project
5. Retire the WordPress install once DNS has switched. It currently exposes the `admin` username through `/wp-json/wp/v2/users`

## Commands

```bash
npm install
npm run dev        # http://localhost:3000/en
npm test           # unit tests (bag reducer, order formatting, validation)
npm run typecheck
npm run images     # rebuild public/images from assets-src/
npm run build      # static export to out/
```
