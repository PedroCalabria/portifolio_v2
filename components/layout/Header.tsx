'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { getDictionary } from '@/lib/locale'

const dict = getDictionary()

/** How far the page must scroll before the header earns a background. */
const BACKDROP_AT = 80
/**
 * Where down the viewport a section has to reach to count as the one being
 * read, as a fraction of viewport height. 0.5 means "whichever section fills
 * most of the screen", which is what makes the highlight change at the moment
 * the reader would say they have arrived.
 *
 * Raise it to switch sooner, lower it to switch later. Anchor clicks keep
 * working either way — see the floor applied below.
 */
const ACTIVE_LINE_RATIO = 0.5
/** Clearance below the header used only if a section declares no scroll margin. */
const ACTIVE_LINE_FALLBACK = 32
/** Slack for fractional layout, so a landed section is never missed by a hair. */
const ACTIVE_LINE_TOLERANCE = 4
/** How close to the bottom counts as having arrived at the last section. */
const BOTTOM_SLACK = 4

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // One scroll listener drives both the backdrop and the current-section
  // highlight: the header is transparent over the hero and gains a blurred tint
  // once section content passes underneath it, and the nav marks whichever
  // section has crossed the line just below it.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > BACKDROP_AT)

      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0

      // The last section whose top has reached its own landing line wins.
      // Nothing has reached it while the hero is in view, which is why
      // `activeId` starts as null — no nav item should claim the hero.
      //
      // The line sits half a viewport down, so a section takes the highlight as
      // soon as it owns most of the screen rather than only once its top slides
      // under the header — that delay was around 350px of scrolling.
      //
      // The floor is each section's `scroll-margin-top`, the exact position an
      // anchor click lands it on. A clicked section must never end up below the
      // line, or its link would stay unmarked until the visitor nudged the page;
      // keeping the floor means the ratio above can be retuned freely without
      // reintroducing that.
      let current: string | null = null
      for (const link of dict.nav.links) {
        const section = document.getElementById(link.id)
        if (!section) continue
        const landing =
          parseFloat(getComputedStyle(section).scrollMarginTop) ||
          headerHeight + ACTIVE_LINE_FALLBACK
        const line = Math.max(
          landing + ACTIVE_LINE_TOLERANCE,
          window.innerHeight * ACTIVE_LINE_RATIO
        )
        if (section.getBoundingClientRect().top <= line) current = link.id
      }

      // A short final section may never reach the line, since the footer sits
      // below it. Arriving at the bottom of the page means arriving there.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - BOTTOM_SLACK
      if (atBottom) current = dict.nav.links[dict.nav.links.length - 1].id

      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }, [])

  // While the overlay is open: lock the page behind it, keep focus inside, and
  // let Escape dismiss without navigating.
  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab') return

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled)'
      )
      if (!focusables || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    // Move focus into the overlay so keyboard users are not left behind it.
    panelRef.current?.querySelector<HTMLElement>('a[href], button')?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen, closeMenu])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-header transition-colors duration-300 ${
        scrolled ? 'bg-ink/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-full items-center justify-between">
        <a
          href="#top"
          aria-label={dict.wordmark.homeLabel}
          className="group text-body leading-[1.18] tracking-tight"
        >
          <span className="block font-medium">{dict.wordmark.first}</span>
          <span className="block font-black transition-colors group-hover:text-primary">
            {dict.wordmark.last}
          </span>
        </a>

        <nav aria-label={dict.nav.label} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {dict.nav.links.map((link) => {
              const isActive = activeId === link.id
              return (
                <li key={link.id}>
                  {/* The underline is a pseudo-element scaled from the left, so
                      it animates without ever reflowing the nav. */}
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative text-body font-normal transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-primary after:transition-transform after:duration-300 ${
                      isActive
                        ? 'text-paper after:scale-x-100'
                        : 'text-paper/80 hover:text-paper after:scale-x-0'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          aria-label={dict.nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(true)}
          className="md:hidden"
        >
          <Menu aria-hidden="true" className="size-6" />
        </button>
      </Container>

      {menuOpen && (
        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.label}
          className="fixed inset-0 z-50 flex flex-col bg-ink md:hidden"
        >
          <Container className="flex h-header shrink-0 items-center justify-end">
            <button type="button" aria-label={dict.nav.closeMenu} onClick={closeMenu}>
              <X aria-hidden="true" className="size-6" />
            </button>
          </Container>

          <nav aria-label={dict.nav.label} className="flex-1">
            <Container>
              <ul className="flex flex-col gap-8 pt-8">
                {dict.nav.links.map((link) => {
                  const isActive = activeId === link.id
                  return (
                    <li key={link.id}>
                      {/* Colour rather than an underline here: a 2px rule under
                          32px type reads as an afterthought. */}
                      <a
                        href={`#${link.id}`}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={`text-h3 font-semibold transition-colors ${
                          isActive ? 'text-primary' : 'text-paper'
                        }`}
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </Container>
          </nav>
        </div>
      )}
    </header>
  )
}
