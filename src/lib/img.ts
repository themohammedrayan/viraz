import dims from '@/content/image-dims.json'

const table: Record<string, number[]> = dims

/** Intrinsic size of a bundled image, so next/image can reserve space (no layout shift). */
export function size(src: string): { width: number; height: number } {
  const d = table[src]
  if (!d) throw new Error(`Unknown image ${src} — run the image pipeline or add it to image-dims.json`)
  return { width: d[0], height: d[1] }
}
