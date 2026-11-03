#!/usr/bin/env node
/**
 * Image pipeline. Turns the original artwork in assets-src/ (git-ignored) into
 * optimised WebP files in public/images/ and writes src/content/image-dims.json
 * so next/image can reserve space for every picture.
 *
 *   node scripts/images.mjs            # fetch missing originals, convert all
 *
 * Originals come from the old WordPress site (viraz.in/wp-content/uploads) and
 * from artwork supplied by the business (logo, soap boxes, posters). To replace
 * a photo, drop the new original into assets-src/ with the same name and re-run.
 *
 * Some sources are generated first by the Python helpers:
 *   python3 scripts/logo.py        logo-gold / mark-gold / logo-ink (from logo-glow.png)
 *   python3 scripts/perfumes.py    perfume-<id>.png bottles + collection band (from range-poster-full.png)
 *   python3 scripts/collection.py  collection-desktop / -mobile hero composites
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const src = (f) => path.join(root, 'assets-src', f)
const out = (f) => path.join(root, 'public', f)

const WP = 'https://viraz.in/wp-content/uploads/2026/10/'
const REMOTE = ['BANNER2-1.jpg', 'BANNER-mobile.jpg', '4.jpeg']

export const PERFUMES = ['oud', 'amber', 'blue', 'royal', 'floral', 'rose', 'musk', 'oudh', 'silver', 'zen']

/** [source, destination under public/, max width] */
const PHOTOS = [
  ['BANNER2-1.jpg', 'images/hero/banner-desktop.webp', 2040],
  ['BANNER-mobile.jpg', 'images/hero/banner-mobile.webp', 940],
  ['4.jpeg', 'images/perfumes/viraz-oud.webp', 1047],
  ['perfume-collection.png', 'images/perfumes/collection.webp', 1199],
  ['range-poster-full.png', 'images/brand/range-poster.webp', 1199],
  ['brand-poster.png', 'images/brand/perfumes-and-soaps.webp', 1199],
  ['soap-aloe-vera.jpg', 'images/soaps/aloe-vera.webp', 1280],
  ['soap-papaya.jpg', 'images/soaps/papaya.webp', 1280],
  ['soap-rose.jpg', 'images/soaps/rose.webp', 1280],
  ['soap-aloe-neem.jpg', 'images/soaps/aloe-vera-neem.webp', 1280],
  ['soap-sandal.jpg', 'images/soaps/sandal.webp', 1280],
  ['soap-charcoal.jpg', 'images/soaps/charcoal.webp', 1280],
  ['soap-milk.jpg', 'images/soaps/milk.webp', 1280],
  ['soap-honey-oat-milk.jpg', 'images/soaps/honey-oat-milk.webp', 1280],
  ['soap-range-poster.jpg', 'images/soaps/range.webp', 1170],
  // Built by scripts/collection.py from the perfume banner + soap range poster
  ['collection-desktop.jpg', 'images/hero/collection-desktop.webp', 2400],
  ['collection-mobile.jpg', 'images/hero/collection-mobile.webp', 1080],
]

async function fetchMissing() {
  mkdirSync(path.join(root, 'assets-src'), { recursive: true })
  for (const f of REMOTE) {
    if (existsSync(src(f))) continue
    const res = await fetch(WP + f)
    if (!res.ok) throw new Error(`${f}: HTTP ${res.status}`)
    await writeFile(src(f), Buffer.from(await res.arrayBuffer()))
    console.log('fetched', f)
  }
}

/** Logos (transparent) and app icons: gold mark centred on the brand noir. */
async function logos() {
  const webp = (from, to, width) => sharp(src(from)).resize({ width }).webp({ quality: 90, alphaQuality: 95 }).toFile(out(to))
  await webp('logo-gold.png', 'images/brand/viraz-logo.webp', 640)
  await webp('mark-gold.png', 'images/brand/viraz-mark.webp', 320)
  await webp('logo-ink.png', 'images/brand/viraz-logo-ink.webp', 640)
  const icon = async (size, file) => {
    const inner = Math.round(size * 0.8)
    const mark = await sharp(src('mark-gold.png')).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
    await sharp({ create: { width: size, height: size, channels: 4, background: '#0b0906' } })
      .composite([{ input: mark, gravity: 'center' }]).png({ compressionLevel: 9, palette: size > 64 }).toFile(out(file))
  }
  await icon(64, 'favicon.png')
  await icon(180, 'apple-touch-icon.png')
  await icon(512, 'icon-512.png')
}

/** Perfume bottles keep their feathered alpha. */
async function perfumes() {
  mkdirSync(out('images/perfumes'), { recursive: true })
  for (const id of PERFUMES) {
    await sharp(src(`perfume-${id}.png`)).webp({ quality: 86, alphaQuality: 90 }).toFile(out(`images/perfumes/${id}.webp`))
  }
}

async function photos() {
  for (const [from, to, w] of PHOTOS) {
    mkdirSync(path.dirname(out(to)), { recursive: true })
    await sharp(src(from)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out(to))
  }
  // Social share card 1200x630 from the desktop banner
  await sharp(src('collection-desktop.jpg')).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toFile(out('images/og.jpg'))
}

/** Rebuild the dimension manifest from whatever is in public/images. */
async function manifest() {
  const dims = {}
  const walk = (d) => readdirSync(d).forEach((f) => {
    const p = path.join(d, f)
    if (statSync(p).isDirectory()) return walk(p)
    if (/\.(webp|png|jpe?g)$/i.test(f)) dims['/' + path.relative(out(''), p).split(path.sep).join('/')] = p
  })
  walk(out('images'))
  const table = {}
  for (const [k, p] of Object.entries(dims).sort()) {
    const m = await sharp(p).metadata()
    table[k] = [m.width, m.height]
  }
  writeFileSync(path.join(root, 'src/content/image-dims.json'), JSON.stringify(table, null, 2) + '\n')
  console.log(`image-dims.json: ${Object.keys(table).length} images`)
}

mkdirSync(out('images/brand'), { recursive: true })
mkdirSync(path.join(root, 'src/content'), { recursive: true })
await fetchMissing()
await logos()
await perfumes()
await photos()
await manifest()
