import { en } from '@/content/en'

/**
 * The dictionary shape is derived from `en`, so a second locale cannot be
 * added with a missing or misspelled key — it simply will not type-check.
 */
export type Dictionary = typeof en

const dictionaries = { en } satisfies Record<string, Dictionary>

export type Locale = keyof typeof dictionaries

/**
 * Only `en` is populated and no switcher is rendered, per the design brief.
 * The indirection is the point: adding `pt` means adding a dictionary file and
 * changing this constant, with no section component touched.
 */
export const activeLocale: Locale = 'en'

export function getDictionary(locale: Locale = activeLocale): Dictionary {
  return dictionaries[locale]
}

/** Fills `{name}` placeholders in a dictionary string. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}
