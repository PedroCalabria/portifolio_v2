/**
 * The small tracked-out label above each section heading: Urbanist 500, 18px,
 * 0.6em tracking, #7792FF.
 *
 * The dictionary stores these in sentence case and the uppercase is applied
 * here, so assistive technology reads a word rather than an acronym.
 *
 * Letter-spacing also applies after the final glyph, which would push centred
 * text off-centre by half a letter-space; the negative inline-end margin
 * cancels it.
 */
export function Eyebrow({ children, className = '' }: { children: string; className?: string }) {
  return (
    <p
      className={`text-label font-medium uppercase tracking-eyebrow -me-[0.6em] text-eyebrow ${className}`}
    >
      {children}
    </p>
  )
}
