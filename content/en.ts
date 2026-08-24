/**
 * The `en` dictionary. Its shape is the contract every future locale must
 * satisfy — `Dictionary` in lib/locale.ts is derived from this object, so
 * adding a key here makes it required everywhere.
 */
export const en = {
  meta: {
    title: 'Pedro Calábria — Full Stack Web Developer',
    description:
      'Full stack developer building modern, scalable web applications with React, Next.js and Node.js.',
  },

  wordmark: {
    first: 'PEDRO',
    last: 'CALÁBRIA',
    homeLabel: 'Back to top',
  },

  nav: {
    label: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    links: [
      { id: 'services', label: 'Services' },
      { id: 'projects', label: 'Projects' },
      { id: 'about', label: 'About' },
      { id: 'contact', label: 'Contact Me' },
    ],
  },

  hero: {
    intro: 'Hey there, I am Calábria',
    headlineLead: 'Full Stack',
    headlineAccent: 'Web Developer',
    body: 'I build modern, scalable web applications using React, Next.js, Node.js and more. Turning complex problems into elegant, user-friendly solutions.',
    primaryCta: 'Let’s Chat',
    secondaryCta: 'See My projects',
    techLabel: 'Technologies I work with',
    tech: ['React', '.NET', 'NodeJS', 'SQL', 'GitHub', 'NextJS'],
  },

  services: {
    eyebrow: 'Services',
    headingLines: ['Problems I can', 'solve for you'],
  },

  projects: {
    eyebrow: 'Projects',
    heading: 'Works I’ve done',
    goToProject: 'Go to project',
    seeItInAction: 'See it in action',
    carousel: {
      label: 'Projects',
      previous: 'Previous project',
      next: 'Next project',
      /** {n} is replaced with the 1-based slide number. */
      goToSlide: 'Show project {n}',
      /** {from} and {to} are replaced, for when two projects share the view. */
      goToSlideRange: 'Show projects {from} to {to}',
      /** {n}, {total} and {title} are replaced. */
      status: 'Project {n} of {total}: {title}',
      /** {from}, {to} and {total} are replaced. */
      statusRange: 'Projects {from} to {to} of {total}',
    },
  },

  about: {
    eyebrow: 'About',
    headingLines: ['Solving Real', 'World Problems'],
    role: 'Full Stack Developer',
    nameLead: 'PEDRO',
    nameAccent: 'CALÁBRIA',
    photoAlt: 'Portrait of Pedro Calábria',
    bio: "I'm a passionate full stack developer with experience building web applications from the ground up. I love turning complex problems into elegant, user-friendly solutions. Always looking for new technologies to learn and new challenges to tackle.",
    experienceHeading: 'Experience',
  },

  contact: {
    headingLine1: 'Let’s have',
    headingLine2Lead: 'a ',
    headingLine2Accent: 'chat!',
    body: 'Feel free to reach out through any of the channels below.',
    channelsLabel: 'Contact channels',
  },

  footer: {
    navLabel: 'Footer navigation',
  },
} as const
