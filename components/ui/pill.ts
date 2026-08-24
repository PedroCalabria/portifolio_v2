/**
 * Every pill in the design is 33px tall with a fully rounded radius and a
 * 16px label; only the fill, border and weight change. Rather than a
 * polymorphic component, this returns the class string so each call site can
 * render the element its semantics demand — `button`, `a` or `span`.
 *
 * Variants map one-to-one onto the Figma treatments:
 *   primary  #244FFF fill        hero primary CTA
 *   ghost    #FFFFFF at 10%      hero secondary CTA
 *   dark     #1A1A1A fill        "go to project"
 *   light    #FFFFFF fill        emphasised first tag
 *   outline  1px #FFFFFF border  remaining tags, "see it in action"
 */
export type PillVariant = 'primary' | 'ghost' | 'dark' | 'light' | 'outline'

const base =
  'inline-flex items-center justify-center rounded-pill px-3 py-[7px] text-body whitespace-nowrap transition-colors duration-200'

/** Fill, border and weight — the parts that always apply. */
const skin: Record<PillVariant, string> = {
  primary: 'bg-primary text-paper font-bold',
  ghost: 'bg-paper/10 text-paper font-normal',
  dark: 'bg-ink text-paper font-semibold',
  light: 'bg-paper text-ink font-semibold',
  outline: 'border border-paper text-paper font-semibold',
}

/** Hover response — dropped entirely when disabled, since a colour change on
 *  hover reads as "this does something". */
const hover: Record<PillVariant, string> = {
  primary: 'hover:bg-primary/85',
  ghost: 'hover:bg-paper/20',
  dark: 'hover:bg-ink/80',
  light: 'hover:bg-paper/85',
  outline: 'hover:bg-paper/10',
}

export function pill(
  variant: PillVariant,
  options: { disabled?: boolean; interactive?: boolean; className?: string } = {}
): string {
  const { disabled = false, interactive = true, className = '' } = options

  return [
    base,
    skin[variant],
    // Disabled pills keep pointer events so the `cursor: not-allowed` rule in
    // globals.css can show; a real `<button disabled>` refuses clicks anyway.
    interactive && !disabled ? hover[variant] : '',
    disabled ? 'opacity-40' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
