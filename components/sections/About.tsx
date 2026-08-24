import { Container } from '@/components/ui/Container'
import { Divider } from '@/components/ui/Divider'
import { Glow } from '@/components/ui/Glow'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { AssetOrPlaceholder } from '@/components/ui/Placeholder'
import { experience } from '@/content/experience'
import { assetExists } from '@/lib/assets'
import { getDictionary } from '@/lib/locale'

const dict = getDictionary()

const PORTRAIT = '/about/portrait.jpg'

export function About() {
  const portraitPresent = assetExists(PORTRAIT)

  return (
    <section id="about" data-anchor className="relative isolate overflow-x-clip py-24">
      <Glow className="left-1/2 top-1/3 h-[711px] w-[1165px] max-w-none -translate-x-1/2" />

      <Container>
        <SectionHeading
          eyebrow={dict.about.eyebrow}
          lines={dict.about.headingLines}
          startIndex={0}
        />

        <div className="mt-20 flex flex-col gap-12 lg:flex-row lg:gap-24">
          <Reveal index={2} className="shrink-0">
            {/* Gradient border: an inner box holds the image, the wrapper's own
                background provides the light-to-dark edge the Figma draws. */}
            <div className="relative mx-auto w-full max-w-[341px] rounded-card bg-linear-to-b from-paper via-transparent to-paper p-px lg:mx-0 lg:w-[341px]">
              <div className="relative aspect-[341/422] overflow-hidden rounded-card bg-placeholder">
                <AssetOrPlaceholder
                  src={PORTRAIT}
                  alt={dict.about.photoAlt}
                  present={portraitPresent}
                  sizes="(min-width: 1024px) 341px, 100vw"
                />
              </div>
            </div>
          </Reveal>

          <div className="flex-1">
            <Reveal index={3}>
              <p className="text-body-lg font-normal uppercase">{dict.about.role}</p>
              <h3 className="mt-2 text-h3 font-medium sm:text-h2">
                {dict.about.nameLead}{' '}
                <span className="font-extrabold">{dict.about.nameAccent}</span>
              </h3>
              <Divider className="mt-6" />
              <p className="mt-8 text-body-lg font-normal text-paper/90 lg:text-justify">
                {dict.about.bio}
              </p>
            </Reveal>

            <Reveal index={4} className="mt-12">
              <h3 className="text-h3 font-bold uppercase sm:text-h2">
                {dict.about.experienceHeading}
              </h3>

              {/* The vertical gradient line runs behind the bullets; each entry
                  owns its own bullet so adding one cannot desynchronise them. */}
              <ol className="relative mt-8 flex flex-col gap-10 ps-8">
                <Divider
                  orientation="vertical"
                  className="absolute inset-y-2 left-[3px] !self-auto"
                />
                {experience.map((entry) => (
                  <li key={entry.company} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -start-8 top-1.5 size-2.5 rounded-pill bg-bullet"
                    />
                    <h4 className="text-body-lg font-bold">{entry.company}</h4>
                    <p className="mt-1 text-body font-normal text-paper/80">
                      {entry.role} | {entry.period}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {entry.stack.map((tech) => (
                        <li key={tech} className="text-body font-bold">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
