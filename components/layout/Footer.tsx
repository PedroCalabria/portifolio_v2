import { Container } from '@/components/ui/Container'
import { Divider } from '@/components/ui/Divider'
import { getDictionary } from '@/lib/locale'

const dict = getDictionary()

/**
 * The Figma leaves the footer as a grey rectangle, so this is a deliberate
 * default rather than a translation of a design.
 *
 * The rule it follows: introduce nothing new. Every mark here already exists
 * elsewhere on the page — the wordmark from the header, the same four section
 * links, the gradient divider. When the real footer is designed, this one
 * component is replaced and nothing else moves.
 */
export function Footer() {
  return (
    <footer>
      <Container>
        <Divider />

        <div className="flex gap-10 py-12 flex-row items-start justify-between">
          <a
            href="#top"
            aria-label={dict.wordmark.homeLabel}
            className="group text-body leading-[1.18]"
          >
            <span className="block font-medium">{dict.wordmark.first}</span>
            <span className="block font-black transition-colors group-hover:text-primary">
              {dict.wordmark.last}
            </span>
          </a>

          <nav aria-label={dict.footer.navLabel}>
            <ul className="flex flex-col gap-3">
              {dict.nav.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-body text-paper/70 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
