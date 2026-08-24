import { Container } from '@/components/ui/Container'
import { Divider } from '@/components/ui/Divider'
import { Glow } from '@/components/ui/Glow'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { services } from '@/content/services'
import { getDictionary } from '@/lib/locale'

const dict = getDictionary()

export function Services() {
  return (
    <section id="services" data-anchor className="relative isolate overflow-x-clip py-20">
      <Glow className="left-1/2 top-1/4 h-[529px] w-[1165px] max-w-none -translate-x-1/2" />

      <Container>
        <SectionHeading
          eyebrow={dict.services.eyebrow}
          lines={dict.services.headingLines}
          startIndex={0}
        />

        <ul className="mt-20">
          {services.map((service, i) => (
            <li key={service.title}>
              <Divider />
              <Reveal index={i + 2} className="flex flex-col gap-4 py-8 lg:flex-row lg:gap-20">
                <div className="flex shrink-0 items-start gap-8 lg:w-[273px] lg:gap-12">
                  {/* Ordinal derived from position, never stored, so reordering
                      the content file renumbers the list. */}
                  <span aria-hidden="true" className="font-ordinal text-ordinal">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-body-lg font-bold">{service.title}</h3>
                </div>
                <p className="text-body font-medium text-paper/90 lg:text-justify">
                  {service.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
        {/* Closes the list, mirroring the dividers between rows. */}
        <Divider />
      </Container>
    </section>
  )
}
