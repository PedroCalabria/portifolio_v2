'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Divider } from '@/components/ui/Divider'
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
/**
 * The width at which the drawer stops existing. Must stay in step with the
 * `md:` variants on the toggle, the backdrop and the panel — it is the same
 * breakpoint expressed for `matchMedia`, which has no access to them.
 */
const DRAWER_UNTIL = '(min-width: 48rem)'

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

  /** Dismissing the drawer without going anywhere: focus returns to the toggle. */
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }, [])

  /**
   * Closing by following a link rather than by dismissing.
   *
   * The scroll lock has to come off here and not in the effect cleanup below.
   * The browser acts on the anchor as soon as this handler returns, while the
   * state update — and so the cleanup — is still queued; a body that is still
   * `overflow: hidden` at that moment swallows the jump, so the URL would gain
   * its hash and the page would never move. Releasing it synchronously is the
   * whole of the fix.
   *
   * Focus is deliberately not pulled back to the toggle: the visitor asked to
   * go somewhere, and hauling focus to a button behind the closing drawer
   * would undo that.
   */
  const followLink = useCallback(() => {
    document.body.style.overflow = ''
    setMenuOpen(false)
  }, [])

  // While the drawer is open: lock the page behind it, keep focus inside, and
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

    // Growing past the breakpoint has to close the drawer, not merely hide it:
    // `md:hidden` would take the panel off the screen while its scroll lock
    // stayed on, leaving the desktop layout frozen with nothing left to unfreeze
    // it — the dismiss controls are all inside the panel that just vanished.
    const desktop = window.matchMedia(DRAWER_UNTIL)
    const onBreakpoint = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    desktop.addEventListener('change', onBreakpoint)

    // Move focus into the drawer so keyboard users are not left behind it.
    panelRef.current?.querySelector<HTMLElement>('a[href], button')?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onBreakpoint)
    }
  }, [menuOpen, closeMenu])

  return (
    // The drawer is a sibling of the header rather than a child, and that
    // placement is load-bearing: `backdrop-blur-md` makes the scrolled header a
    // containing block for fixed descendants, so a nested drawer would be
    // clipped into the 60px header strip the moment the visitor had scrolled.
    <>
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
      </header>

      {/* Backdrop and panel stay mounted so the drawer animates out as well as
          in. Both sit above the header's z-50 on purpose: the dim has to cover
          the wordmark too, or the one strip of page the drawer does not overlap
          would be the one strip left at full brightness. */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-60 bg-void/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.label}
        // `inert` is what takes the closed panel's links out of the tab order
        // and out of the accessibility tree. Off-screen alone would leave them
        // focusable, which is worse than having no drawer at all.
        inert={!menuOpen}
        className={`fixed inset-y-0 right-0 z-70 flex w-[min(20rem,80vw)] flex-col bg-ink transition-transform duration-300 ease-(--reveal-ease) md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* The panel's own edge, drawn with the gradient hairline the rest of
            the page separates things with rather than a drop shadow. */}
        <Divider orientation="vertical" className="absolute inset-y-0 left-0" />

        {/* 24px of padding throughout, which is what Container gives at this
            width — so the drawer lines up with the page it slid over. */}
        <div className="flex h-header shrink-0 items-center justify-between gap-4 px-6">
          <a
            href="#top"
            aria-label={dict.wordmark.homeLabel}
            onClick={followLink}
            className="group text-label leading-tight tracking-tight"
          >
            <span className="font-medium">{dict.wordmark.first}</span>{' '}
            <span className="font-black transition-colors group-hover:text-primary">
              {dict.wordmark.last}
            </span>
          </a>

          <button
            type="button"
            aria-label={dict.nav.closeMenu}
            onClick={closeMenu}
            className="shrink-0"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>

        <div className="px-6">
          <Divider />
        </div>

        {/* Scrollable so a landscape phone, where the rows plus the header
            outgrow the viewport, can still reach the last link. */}
        <nav aria-label={dict.nav.label} className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="flex flex-col gap-2">
            {dict.nav.links.map((link) => {
              const isActive = activeId === link.id
              return (
                <li key={link.id}>
                  {/* A filled row rather than the desktop underline: at this
                      size a 2px rule under the label reads as an afterthought,
                      and the fill gives the tap target a visible edge. Tinted
                      with the accent instead of coloured with it — #244FFF as
                      text on #1A1A1A does not carry its own contrast. */}
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={followLink}
                    className={`flex items-center rounded-card px-4 py-3 text-label transition-colors ${
                      isActive
                        ? 'bg-primary/20 font-bold text-paper'
                        : 'font-normal text-paper/80 hover:bg-paper/10 hover:text-paper'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
