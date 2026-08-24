export type ChannelKey = 'whatsapp' | 'email' | 'linkedin'

export type Channel = {
  key: ChannelKey
  /** Channel name, e.g. "WhatsApp". */
  name: string
  /** The line shown beneath the name. Deliberately allowed to differ from the
   *  destination — LinkedIn shows a handle, not a URL. */
  detail: string
  href: string
  /** Opens in a new context, so the link needs rel="noopener". */
  external: boolean
}

/**
 * Name, detail and destination live together: the failure mode worth guarding
 * against is a label drifting away from the URL it claims to describe.
 */
export const channels: Channel[] = [
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    detail: '+55 (81) 9 9542-1115',
    href: 'https://wa.me/5581995421115',
    external: true,
  },
  {
    key: 'email',
    name: 'E-mail',
    detail: 'pedsancal@gmail.com',
    href: 'mailto:pedsancal@gmail.com',
    external: false,
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    detail: 'pedrocalabria',
    href: 'https://www.linkedin.com/in/pedrocalabria/',
    external: true,
  },
]
