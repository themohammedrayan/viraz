import Image, { type ImageProps } from 'next/image'
import { size } from '@/lib/img'

/** next/image with intrinsic dimensions looked up from the image manifest. */
export function Img({ src, alt, fill, ...p }: Omit<ImageProps, 'src' | 'width' | 'height'> & { src: string }) {
  if (fill) return <Image src={src} alt={alt} fill {...p} />
  return <Image src={src} alt={alt} {...size(src)} {...p} />
}
