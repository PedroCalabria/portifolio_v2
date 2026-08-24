import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Urbanist, Work_Sans } from 'next/font/google'
import { getDictionary, activeLocale } from '@/lib/locale'
import { REVEAL_ARM_SCRIPT } from '@/components/ui/Reveal'
import './globals.css'

/**
 * Both faces are variable fonts, so a single self-hosted file per family
 * covers every weight the design uses — Urbanist 400 through 900, Work Sans
 * 400 for the service ordinals. `next/font/google` downloads them at build
 * time and serves them from our own origin, so the browser never contacts
 * Google.
 */
const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-work-sans',
  display: 'swap',
})

const dict = getDictionary()

export const metadata: Metadata = {
  title: dict.meta.title,
  description: dict.meta.description,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Browser-chrome colour. Metadata cannot read a CSS variable, so this is
  // the one place a token value is repeated as a literal; keep it in step with
  // --color-ink in globals.css.
  themeColor: '#1a1a1a',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={activeLocale}
      /* Next 16 no longer neutralises `scroll-behavior: smooth` during route
         transitions unless asked. In-page anchors want the smooth scroll; a
         future navigation to a project page wants an instant jump to top. */
      data-scroll-behavior="smooth"
      className={`${urbanist.variable} ${workSans.variable}`}
      /* The reveal arming script below sets `data-reveal-armed` on this element
         before React hydrates — that is the whole point of it, since the hidden
         state has to exist before the first paint. React therefore finds an
         attribute the server never sent and reports a mismatch. It does not
         revert the attribute, so only the warning is wrong, not the behaviour.
         This suppression reaches one level: attributes and text of <html>
         itself, never its descendants. */
      suppressHydrationWarning
    >
      <body>
        {/* Must run before the first paint so revealed content is never
            painted at rest and then hidden. See components/ui/Reveal.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_ARM_SCRIPT }} />
        {children}
      </body>
    </html>
  )
}
