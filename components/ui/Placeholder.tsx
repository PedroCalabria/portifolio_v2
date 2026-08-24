import Image from 'next/image'

/**
 * Stands in for imagery that has not been supplied yet — the About portrait
 * and every project image.
 *
 * The point is that layout is final now: the placeholder occupies exactly the
 * box the real asset will, so dropping the file in later cannot shift anything
 * around it. Nothing here is announced to assistive technology, because an
 * absent image carries no information.
 *
 * `src` files are optional on purpose. Next's Image component throws on a
 * missing file at build time, so an asset is only rendered once `hasAsset` is
 * flipped by the caller — see `assetExists` below.
 */
export function Placeholder({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-full w-full bg-placeholder ${className}`}
      data-placeholder="true"
    />
  )
}

/**
 * Renders the real asset when one is present, and the grey placeholder box
 * otherwise. `fill` requires the parent to be positioned and sized, which every
 * call site does via an aspect-ratio box.
 */
export function AssetOrPlaceholder({
  src,
  alt,
  present,
  className = '',
  sizes,
  priority = false,
}: {
  src: string
  alt: string
  /** Whether the file actually exists under /public. */
  present: boolean
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (!present) return <Placeholder className={className} />

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  )
}
