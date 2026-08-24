import { Container } from '@/components/ui/Container'
import { Divider } from '@/components/ui/Divider'
import { Reveal } from '@/components/ui/Reveal'
import { ChannelIcon } from '@/components/ui/ChannelIcon'
import { channels } from '@/content/contact'
import { getDictionary } from '@/lib/locale'

const dict = getDictionary()

export function Contact() {
  return (
    <section id="contact" data-anchor className="py-24">
      <Container>
        <Reveal index={0}>
          <div className="rounded-card border border-paper px-8 py-14 sm:px-14 lg:px-20 lg:py-20">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
              <div className="flex-1">
                <h2 className="text-h3 font-bold sm:text-h2 lg:text-display">
                  {dict.contact.headingLine1}
                  <br />
                  {dict.contact.headingLine2Lead}
                  <span className="text-primary">{dict.contact.headingLine2Accent}</span>
                </h2>
                <p className="mt-6 max-w-[372px] text-lead font-normal text-paper/80">
                  {dict.contact.body}
                </p>
              </div>

              <Divider orientation="vertical" className="hidden lg:block" />

              <div className="lg:w-[300px]">
                <h3 className="sr-only">{dict.contact.channelsLabel}</h3>
                <ul className="flex flex-col gap-10">
                  {channels.map((channel) => (
                    <li key={channel.key}>
                      {/* The whole row is the target — icon, name and detail —
                          rather than just the detail line. */}
                      <a
                        href={channel.href}
                        {...(channel.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : undefined)}
                        className="group flex items-center gap-5"
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-primary transition-opacity group-hover:opacity-85">
                          <ChannelIcon channel={channel.key} className="size-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-lead font-bold">{channel.name}</span>
                          <span className="block break-words text-body font-medium text-paper/80">
                            {channel.detail}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
