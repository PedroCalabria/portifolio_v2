export type Experience = {
  company: string
  role: string
  period: string
  stack: string[]
}

export const experience: Experience[] = [
  {
    company: 'Pitang',
    role: 'IT Consultant',
    period: 'AUG 2024 - PRESENT',
    stack: ['React', '.NET', 'Selenium', 'GitHub', 'Kafka', 'SQL'],
  },
  {
    company: 'CoTechAI',
    role: 'Freelancer',
    period: 'JAN 2025 - PRESENT',
    // The Figma reads "Postgress"; corrected here.
    stack: ['NextJS', 'NodeJS', 'Docker', 'GitHub', 'Postgres'],
  },
]
