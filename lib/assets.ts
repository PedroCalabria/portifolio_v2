import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Whether a path under /public actually resolves to a file.
 *
 * Every section that renders imagery is a server component, so this runs at
 * build time. It lets a project entry name the image it will eventually have
 * without that missing file breaking the build — the grey placeholder takes
 * its place until the asset lands.
 */
export function assetExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\/+/, '')
  if (!relative) return false
  return existsSync(join(process.cwd(), 'public', relative))
}
