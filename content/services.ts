export type Service = {
  title: string
  description: string
}

/**
 * Order is meaningful: the displayed ordinal (01, 02, ...) is derived from
 * array position, never stored, so reordering here renumbers the list.
 */
export const services: Service[] = [
  {
    title: 'Full-Stack Web Development',
    description:
      'End-to-end development of scalable web applications. I build modern, responsive front-end interfaces coupled with secure, high-performing databases and back-end logic.',
  },
  {
    title: 'Custom E-commerce Solutions',
    description:
      'Tailor-made online stores built to scale your business. Features include secure payment gateway integrations (Stripe, PayPal), custom checkout flows, inventory management, and intuitive admin dashboards.',
  },
  {
    title: 'High-Converting Landing Pages',
    description:
      'Fast, mobile-optimized landing pages designed to capture leads and boost sales. Built with clean code and structured for seamless integration with Google Ads, Meta Ads, and email marketing tools.',
  },
  {
    title: 'API Development & Third-Party Integrations',
    description:
      'Building secure RESTful APIs and connecting your existing platform with external services like CRMs, ERPs, AI models, automated WhatsApp messaging, and custom automation workflows.',
  },
]
