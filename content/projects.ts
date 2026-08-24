export type Project = {
  /** Stable identifier. Also the route segment for the phase-2 detail page. */
  slug: string
  title: string
  subtitle: string
  /**
   * Ordered. The first entry is rendered as the emphasised pill — treat it as
   * the project's primary technology, not just the first one you thought of.
   */
  tags: string[]
  /** Path under /public. Renders a placeholder while the file is absent. */
  image: string
  /** Omit and the "see it in action" action is not rendered at all. */
  liveUrl?: string
  /**
   * False until this project has a detail page. Gates the "go to project"
   * action, which renders disabled while this is false. Flipping it to true
   * is the only change needed once /projects/[slug] exists.
   */
  detailReady: boolean
}

export const projects: Project[] = [
  {
    slug: 'corporate-cash-flow',
    title: 'Corporate Cash Flow',
    subtitle: 'Solutions',
    tags: ['React', '.NET', 'SQL'],
    image: '/projects/corporate-cash-flow.png',
    detailReady: false,
  },
  // Placeholder entries — replace title, subtitle, tags and image with real
  // projects. They exist so the carousel's multi-slide behaviour is real.
  {
    slug: 'placeholder-project-two',
    title: 'Second Project',
    subtitle: 'Solutions',
    tags: ['React', '.NET', 'SQL'],
    image: '/projects/placeholder-project-two.png',
    detailReady: false,
  },
  {
    slug: 'placeholder-project-three',
    title: 'Third Project',
    subtitle: 'Solutions',
    tags: ['NextJS', 'NodeJS', 'Postgres'],
    image: '/projects/placeholder-project-three.png',
    detailReady: false,
  },
]

/**
 * Slugs address routes, so a duplicate would silently shadow a project. Fail
 * loudly at module load rather than shipping the collision.
 */
const seen = new Set<string>()
for (const project of projects) {
  if (seen.has(project.slug)) {
    throw new Error(`Duplicate project slug: "${project.slug}"`)
  }
  seen.add(project.slug)
}
