import type { ReactNode } from 'react'

/**
 * The single horizontal authority for the whole page: 1120px of content with
 * 80px gutters, matching the layout grid declared on the Figma frame. Every
 * section aligns to this, which is what reconciles the 1120 / 1058 / 981
 * widths the drawn layers actually use.
 *
 * Gutters shrink before the content does, so narrow viewports keep breathing
 * room without the container ever forcing horizontal overflow.
 */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[calc(var(--container-content)+2*var(--spacing-gutter))] px-6 sm:px-10 lg:px-gutter ${className}`}
    >
      {children}
    </div>
  )
}
