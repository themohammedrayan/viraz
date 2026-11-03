#!/usr/bin/env node
/**
 * Image pipeline. Turns the original artwork in assets-src/ (git-ignored) into
 * optimised WebP files in public/images/ and writes src/content/image-dims.json
 * so next/image can reserve space for every picture.
 *
 *   node scripts/images.mjs            # fetch missing originals, convert all
 *
 * Originals come from the old WordPress site (viraz.in/wp-content/uploads) and
 * from the pack artwork supplied by the business (soap boxes). To replace a
 * photo, drop the new original into assets-src/ with the same name and re-run.
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const src = (f) => path.join(root, 'assets-src', f)
const out = (f) => path.join(root, 'public', f)

const WP = 'https://viraz.in/wp-content/uploads/2026/10/'
const REMOTE = ['BANNER2-1.jpg', 'BANNER-mobile.jpg', '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', 'Polished-Gold-Viraz-Luxury-Emblem-1.png']

/** [source, destination under public/, max width] */
const PHOTOS = [
  ['BANNER2-1.jpg', 'images/hero/banner-desktop.webp', 2040],
  ['BANNER-mobile.jpg', 'images/hero/banner-mobile.webp', 940],
  ['1.jpeg', 'images/perfumes/golden-flora.webp', 1024],
  ['2.jpeg', 'images/perfumes/spicy-amber.webp', 1024],
  ['3.jpeg', 'images/perfumes/royal-oud.webp', 1024],
  ['4.jpeg', 'images/perfumes/viraz-oud.webp', 1047],
  ['soap-aloe-vera.jpg', 'images/soaps/aloe-vera.webp', 1280],
  ['soap-papaya.jpg', 'images/soaps/papaya.webp', 1280],
  ['soap-rose.jpg', 'images/soaps/rose.webp', 1280],
  ['soap-aloe-neem.jpg', 'images/soaps/aloe-vera-neem.webp', 1280],
  ['soap-sandal.jpg', 'images/soaps/sandal.webp', 1280],
  ['soap-charcoal.jpg', 'images/soaps/charcoal.webp', 1280],
  ['soap-milk.jpg', 'images/soaps/milk.webp', 1280],
  ['soap-honey-oat-milk.jpg', 'images/soaps/honey-oat-milk.webp', 1280],
  ['soap-trio.jpg', 'images/soaps/collection.webp', 1170],
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

/**
 * The emblem is gold on pure black. Turn black into transparency by treating
 * brightness as alpha and un-premultiplying the colour, so the glow edges stay
 * smooth on any dark background.
 */
async function emblem() {
  const { data, info } = await sharp(src('Polished-Gold-Viraz-Luxury-Emblem-1.png'))
    .removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const rgba = Buffer.alloc(info.width * info.height * 4)
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const m = Math.max(r, g, b)
    const a = m < 18 ? 0 : Math.min(255, Math.round(((m - 18) / (255 - 18)) * 255 * 1.35))
    const k = a ? 255 / Math.max(a, m) : 0
    rgba[j] = Math.min(255, Math.round(r * k))
    rgba[j + 1] = Math.min(255, Math.round(g * k))
    rgba[j + 2] = Math.min(255, Math.round(b * k))
    rgba[j + 3] = a
  }
  const cut = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  const trimmed = await cut.png().toBuffer().then((b) => sharp(b).trim({ threshold: 1 }).toBuffer())
  await sharp(trimmed).resize({ width: 480 }).webp({ quality: 88, alphaQuality: 90 }).toFile(out('images/brand/viraz-emblem.webp'))

  // Icons: emblem on the brand's near-black, square
  const icon = async (size, file) => {
    const inner = Math.round(size * 0.86)
    const mark = await sharp(trimmed).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
    await sharp({ create: { width: size, height: size, channels: 4, background: '#0b0906' } })
      .composite([{ input: mark, gravity: 'center' }]).png().toFile(out(file))
  }
  await icon(64, 'favicon.png')
  await icon(180, 'apple-touch-icon.png')
  await icon(512, 'icon-512.png')
}

async function photos() {
  for (const [from, to, w] of PHOTOS) {
    mkdirSync(path.dirname(out(to)), { recursive: true })
    await sharp(src(from)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out(to))
  }
  // Social share card 1200x630 from the desktop banner
  await sharp(src('BANNER2-1.jpg')).resize(1200, 630, { fit: 'cover', position: 'left' }).jpeg({ quality: 82 }).toFile(out('images/og.jpg'))
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
await emblem()
await photos()
await manifest()
