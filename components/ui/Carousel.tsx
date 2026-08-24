'use client'

import { useCallback, useRef, useState, useSyncExternalStore } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProjectSlide, type SlideProject } from '@/components/ui/ProjectSlide'
import { getDictionary, interpolate } from '@/lib/locale'

const dict = getDictionary()

/** Horizontal travel, in px, before a drag counts as a slide change. */
const COMMIT_DISTANCE = 60
/** Movement, in px, after which the gesture's axis is decided and locked. */
const AXIS_LOCK_DISTANCE = 10
/** Two projects abreast from `lg` up — the same breakpoint as the page's other
 *  two-column layouts. Must stay in step with `lg:basis-1/2` on the slide. */
const TWO_UP_QUERY = '(min-width: 64rem)'

type Gesture = {
  pointerId: number
  startX: number
  startY: number
  /** null until the axis is decided. */
  axis: 'horizontal' | 'vertical' | null
}

/** Module-level so the store identity is stable across renders. */
const subscribeToTwoUp = (onChange: () => void) => {
  const mq = window.matchMedia(TWO_UP_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
const getTwoUpSnapshot = () => (window.matchMedia(TWO_UP_QUERY).matches ? 2 : 1)

export function Carousel({ projects }: { projects: SlideProject[] }) {
  const [rawIndex, setIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)

  const gesture = useRef<Gesture | null>(null)
  /** Set when a drag commits, so the click it generates can be swallowed. */
  const suppressClick = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)

  /**
   * How many slides are on screen. Slide widths are pure CSS, so the cards lay
   * out correctly from the first paint either way — this only drives how far a
   * step travels, which slides count as visible, and how many dots there are.
   *
   * The server snapshot is 1 so hydration matches; React then re-reads the real
   * value without a mismatch.
   */
  const visible = useSyncExternalStore(subscribeToTwoUp, getTwoUpSnapshot, () => 1)

  const total = projects.length
  /** Resting positions: the last one shows the final `visible` slides. */
  const positions = Math.max(1, total - visible + 1)
  const showControls = positions > 1

  // Clamped at render rather than corrected in an effect: widening the viewport
  // removes a resting position, so an index that was valid one-up can fall off
  // the end two-up. Deriving it avoids an extra render and a visible jump.
  const index = Math.min(rawIndex, positions - 1)

  const wrap = useCallback((n: number) => ((n % positions) + positions) % positions, [positions])

  /**
   * Relative movement, wrapping in both directions: the dots already say where
   * you are, so a dead-ended arrow would be the only thing telling you where
   * you can't go.
   *
   * This has to derive the next index from the previous state rather than from
   * `index` in scope. Two arrow clicks inside one React batch both read the
   * same stale `index`, so the second would be a no-op — and clicking an arrow
   * twice in quick succession is completely ordinary.
   */
  const step = useCallback((delta: number) => setIndex((i) => wrap(i + delta)), [wrap])

  /** Absolute movement, for the dots. */
  const goTo = useCallback((n: number) => setIndex(wrap(n)), [wrap])

  const onPointerDown = (event: React.PointerEvent) => {
    if (!showControls) return
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      axis: null,
    }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const g = gesture.current
    if (!g || g.pointerId !== event.pointerId) return

    const dx = event.clientX - g.startX
    const dy = event.clientY - g.startY

    // First few pixels decide the axis. A vertical intent releases the gesture
    // entirely so the page scrolls as it normally would — without this the
    // carousel eats vertical swipes and the section becomes a trap on a phone.
    if (g.axis === null) {
      if (Math.abs(dx) < AXIS_LOCK_DISTANCE && Math.abs(dy) < AXIS_LOCK_DISTANCE) return
      if (Math.abs(dy) > Math.abs(dx)) {
        gesture.current = null
        setDragOffset(0)
        return
      }
      g.axis = 'horizontal'
      // Take the pointer so we keep receiving moves even outside the element.
      trackRef.current?.setPointerCapture(event.pointerId)
    }

    setDragOffset(dx)
  }

  const endGesture = (event: React.PointerEvent) => {
    const g = gesture.current
    if (!g || g.pointerId !== event.pointerId) return

    const dx = event.clientX - g.startX
    gesture.current = null
    setDragOffset(0)

    if (g.axis !== 'horizontal') return

    if (Math.abs(dx) >= COMMIT_DISTANCE) {
      // A committed drag must not also read as a click, or releasing over an
      // action pill would activate it.
      suppressClick.current = true
      step(dx < 0 ? 1 : -1)
    }
  }

  const onClickCapture = (event: React.MouseEvent) => {
    if (!suppressClick.current) return
    suppressClick.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!showControls) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  /**
   * The track is a block whose box is the container's width, with the slides
   * overflowing it — so one slide is `100 / visible` percent of the track,
   * whether that is one full-width card or one of a pair.
   */
  const offsetPercent = -index * (100 / visible)

  /** 1-based range of projects currently on screen, for the announcements. */
  const from = index + 1
  const to = Math.min(index + visible, total)
  const rangeLabel = (start: number) => ({
    from: start + 1,
    to: Math.min(start + visible, total),
    total,
  })

  return (
    // Arrow keys are scoped to this group, so they only take over while focus
    // is actually inside the carousel.
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={dict.projects.carousel.label}
      onKeyDown={onKeyDown}
    >
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
          onClickCapture={onClickCapture}
          // The negative margin cancels the outer half-gutters contributed by
          // the slides' padding, so the first and last visible cards align with
          // the content container rather than sitting 29px inside it.
          className={`flex lg:-mx-[29px] ${dragOffset === 0 ? 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]' : ''}`}
          style={{
            transform: `translate3d(calc(${offsetPercent}% + ${dragOffset}px), 0, 0)`,
            // Let the browser own vertical panning; we only claim horizontal.
            touchAction: 'pan-y',
          }}
        >
          {projects.map((project, i) => (
            <ProjectSlide
              key={project.slug}
              project={project}
              active={i >= index && i < index + visible}
            />
          ))}
        </div>
      </div>

      {showControls && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label={dict.projects.carousel.previous}
            onClick={() => step(-1)}
            className="flex size-10 items-center justify-center rounded-pill border border-paper/30 transition-colors hover:border-paper hover:bg-paper/10"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>

          {/* One dot per resting position, not per project: two-up over three
              projects has three cards but only two places to stop. */}
          <ul className="flex items-center gap-3">
            {Array.from({ length: positions }, (_, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-label={
                    visible > 1
                      ? interpolate(dict.projects.carousel.goToSlideRange, rangeLabel(i))
                      : interpolate(dict.projects.carousel.goToSlide, { n: i + 1 })
                  }
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => goTo(i)}
                  className={`block size-2.5 rounded-pill transition-colors ${
                    i === index ? 'bg-primary' : 'bg-paper/30 hover:bg-paper/60'
                  }`}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={dict.projects.carousel.next}
            onClick={() => step(1)}
            className="flex size-10 items-center justify-center rounded-pill border border-paper/30 transition-colors hover:border-paper hover:bg-paper/10"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      )}

      {/* Announces the slide change without moving focus. */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {visible > 1
          ? interpolate(dict.projects.carousel.statusRange, { from, to, total })
          : interpolate(dict.projects.carousel.status, {
              n: from,
              total,
              title: projects[index]?.title ?? '',
            })}
      </p>
    </div>
  )
}
