import { Container } from '@/components/ui/Container'
import { Divider } from '@/components/ui/Divider'
import { Glow } from '@/components/ui/Glow'
import { Noise } from '@/components/ui/Noise'
import { Reveal } from '@/components/ui/Reveal'
import { pill } from '@/components/ui/pill'
import { getDictionary } from '@/lib/locale'

const dict = getDictionary()

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-40 pb-24 sm:pt-48">
      {/* Background: the #060606 wash, the bloom behind the headline, and the
          grain. All three are decorative and non-interactive. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-void from-[18%] to-transparent"
      />
      <Glow className="left-1/2 top-0 h-[564px] w-[869px] max-w-none -translate-x-1/2" />
      <Noise />

      <Container>
        <div className="mx-auto flex max-w-[468px] flex-col items-center gap-8 text-center">
          <Reveal index={0} as="p" className="text-body font-bold">
            {dict.hero.intro}
          </Reveal>

          {/* One heading element, two colours — the split is presentational, so
              assistive technology reads a single continuous headline. */}
          <Reveal index={1} as="h1" className="text-h3 font-bold sm:text-h2 lg:text-display">
            {dict.hero.headlineLead}{' '}
            {/* The design breaks the line here rather than wherever the measure
                runs out. Keeping the accent phrase on its own line at every
                width avoids splitting it as "Full Stack Web / Developer". */}
            <span className="block text-primary">{dict.hero.headlineAccent}</span>
          </Reveal>

          <Reveal index={2} as="p" className="text-body-lg font-normal">
            {dict.hero.body}
          </Reveal>

          <Reveal index={3} className="flex items-center gap-4">
            <a href="#contact" className={pill('primary')}>
              {dict.hero.primaryCta}
            </a>
            <a href="#projects" className={pill('ghost')}>
              {dict.hero.secondaryCta}
            </a>
          </Reveal>
        </div>
      </Container>

      <Container className="mt-24">
        <Reveal index={4} className="flex flex-col items-center gap-10">
          <Divider className="max-w-[286px]" />

          {/* Presentational: a glance at the stack, not a set of links. */}
          <h2 className="sr-only">{dict.hero.techLabel}</h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-50">
            {dict.hero.tech.map((tech) => (
              <li key={tech} className="text-body-lg font-semibold">
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
