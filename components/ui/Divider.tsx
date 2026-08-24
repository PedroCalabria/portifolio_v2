/**
 * The 2px hairline that separates service rows, closes the hero, and splits
 * the contact card: a gradient stroke running transparent to #FFFFFF at 50%
 * and back. Purely decorative, so it is hidden from assistive technology
 * rather than announced as a separator.
 */
export function Divider({
  orientation = 'horizontal',
  className = '',
}: {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  const shape =
    orientation === 'horizontal'
      ? 'h-[2px] w-full bg-[image:var(--divider-h)]'
      : 'w-[2px] self-stretch bg-[image:var(--divider-v)]'

  return <div aria-hidden="true" className={`${shape} shrink-0 ${className}`} />
}
