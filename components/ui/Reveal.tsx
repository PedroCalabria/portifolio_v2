'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

/**
 * Entrance animation: content rises from below and fades in the first time it
 * enters the viewport, exactly once.
 *
 * How the "visible without JavaScript, but still animated" guarantee works:
 *
 *   1. The server renders `data-reveal="pending"`. On its own that attribute
 *      has no styles, so the markup is at its resting position — a crawler or
 *      a visitor without JavaScript sees finished content.
 *   2. A tiny synchronous script in the document (see REVEAL_ARM_SCRIPT) sets
 *      `data-reveal-armed` on <html> before the first paint, unless the visitor
 *      prefers reduced motion. Only then does `pending` mean hidden — so
 *      content is never painted visible and then yanked away.
 *   3. This component observes the element and switches it to `"shown"` once it
 *      intersects, then stops observing it. "Exactly once" is a property of the
 *      mechanism, not a flag anyone has to maintain.
 *
 * `index` staggers siblings by feeding `--reveal-index` to the CSS; the delay
 * is computed in CSS and this component only flips one attribute.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  index = 0,
  className = '',
  threshold = 0.15,
}: {
  children: ReactNode
  /** Rendered element. Use a semantic tag where one applies, so the wrapper
   *  does not add a meaningless div to the tree. */
  as?: ElementType
  index?: number
  className?: string
  threshold?: number
}) {
  const ref = useRef<HTMLElement>(null)

  // "pending" on both the server and the first client render, so hydration
  // matches. It only means "hidden" once the document is armed.
  const [state, setState] = useState<'pending' | 'shown'>('pending')

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Not armed (reduced motion), or no observer available. Nothing to do:
    // without the armed attribute "pending" carries no hidden styles, so the
    // element is already sitting at its resting position.
    const armed = document.documentElement.hasAttribute('data-reveal-armed')
    if (!armed || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setState('shown')
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    // Elements already on screen at load intersect on the observer's first
    // callback, so above-the-fold content animates in immediately.
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <Tag
      ref={ref}
      data-reveal={state}
      style={{ '--reveal-index': index } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  )
}

/**
 * Runs synchronously before the first paint, so `pending` elements are hidden
 * from the very first frame rather than flashing into view and back out.
 * Deliberately not a module: it must execute before anything hydrates.
 */
export const REVEAL_ARM_SCRIPT = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-reveal-armed','')}}catch(e){}`
