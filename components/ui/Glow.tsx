/**
 * The soft white bloom sitting behind the hero, services and about sections —
 * a radial #FFFFFF at 10% fading to transparent.
 *
 * Absolutely positioned and `pointer-events-none`, so it never intercepts a
 * click meant for the content it sits behind. Sized by the caller, since the
 * three glows in the design have quite different footprints.
 */
export function Glow({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 bg-[image:var(--glow)] ${className}`}
    />
  )
}
