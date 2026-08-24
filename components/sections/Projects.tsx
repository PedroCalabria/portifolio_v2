import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Carousel } from '@/components/ui/Carousel'
import type { SlideProject } from '@/components/ui/ProjectSlide'
import { projects } from '@/content/projects'
import { assetExists } from '@/lib/assets'
import { getDictionary } from '@/lib/locale'

const dict = getDictionary()

/**
 * Departs from the Figma deliberately: instead of one wide card plus two half
 * cards, every project gets the featured treatment and the carousel moves
 * between them.
 *
 * Image presence is resolved here, on the server, so the client component
 * never touches the filesystem.
 */
export function Projects() {
  const slides: SlideProject[] = projects.map((project) => ({
    ...project,
    imagePresent: assetExists(project.image),
  }))

  return (
    <section id="projects" data-anchor className="py-24">
      <Container>
        <SectionHeading
          eyebrow={dict.projects.eyebrow}
          lines={[dict.projects.heading]}
          startIndex={0}
        />

        <Reveal index={2} className="mt-16">
          <Carousel projects={slides} />
        </Reveal>
      </Container>
    </section>
  )
}
