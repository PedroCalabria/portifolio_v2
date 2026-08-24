import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The eyebrow-plus-heading pair that opens Services, Projects and About:
 * a tracked-out label above a centred 48/58 heading.
 *
 * The heading arrives as an array of lines because the design breaks each one
 * at a chosen word rather than wherever the measure runs out. On narrow
 * viewports those breaks are dropped and the text is allowed to wrap naturally.
 */
export function SectionHeading({
  eyebrow,
  lines,
  startIndex = 0,
}: {
  eyebrow: string
  lines: readonly string[]
  /** Reveal stagger offset, so the pair joins the section's cascade. */
  startIndex?: number
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Reveal index={startIndex}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>

      <Reveal index={startIndex + 1} as="h2" className="text-h3 font-medium sm:text-h2">
        {lines.map((line, i) => (
          <span key={line} className="lg:block">
            {line}
            {i < lines.length - 1 ? ' ' : null}
          </span>
        ))}
      </Reveal>
    </div>
  )
}
