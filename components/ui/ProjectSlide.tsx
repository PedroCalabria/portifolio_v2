import { AssetOrPlaceholder } from '@/components/ui/Placeholder'
import { pill } from '@/components/ui/pill'
import type { Project } from '@/content/projects'
import { getDictionary } from '@/lib/locale'

const dict = getDictionary()

export type SlideProject = Project & {
  /** Resolved on the server: whether the image file actually exists yet. */
  imagePresent: boolean
}

/**
 * One project card: the image with the action pills overlaid bottom-right, then
 * title, subtitle and tags below.
 *
 * Two slides sit side by side from `lg` up, so the image takes the proportion
 * of the Figma's half-width cards (500×341) rather than the full-bleed
 * featured card's 3.1:1 — at half the width that ratio would letterbox the
 * image into a strip.
 *
 * The gutter between cards comes from padding on the slide, not `gap`: `gap`
 * would widen the flex line and break the carousel's translate maths, padding
 * does not. The track cancels the outer half-gutters with a negative margin of
 * the same size, so the cards still line up with the content container's edges
 * — the two values have to move together or the alignment drifts.
 *
 * One-up needs a gutter as much as two-up does, even though nothing sits beside
 * the card at rest. Without one the outgoing and incoming cards travel flush
 * against each other, and two 20px radii meeting mid-transition read as one
 * pinched shape rather than two cards. 32px is enough separation at phone
 * widths without opening a chasm; the 58px of the Figma's two-up layout takes
 * over at `lg`.
 *
 * `inert` is what keeps off-screen slides out of the tab order and out of the
 * accessibility tree — a carousel that lets you tab into invisible content is
 * worse than no carousel.
 */
export function ProjectSlide({ project, active }: { project: SlideProject; active: boolean }) {
  return (
    <div
      className="w-full shrink-0 basis-full px-4 lg:basis-1/2 lg:px-7.25"
      // `inert` is the part that matters: it takes the slide's links and
      // buttons out of the tab order. aria-hidden alone would leave them
      // focusable, which is worse than having no carousel at all.
      inert={!active}
      aria-hidden={active ? undefined : 'true'}
    >
      <div className="relative aspect-[500/341] overflow-hidden rounded-card bg-placeholder">
        <AssetOrPlaceholder
          src={project.image}
          alt={project.title}
          present={project.imagePresent}
          sizes="(min-width: 1024px) 531px, 100vw"
        />

        {/* Two pills side by side need ~345px, which the card does not always
            have — narrow phones, and the 1024–1279 range where two-up cards are
            only ~395px wide. Wrapping right-aligned handles every width without
            guessing at breakpoints; the box grows upward from its bottom anchor. */}
        <div className="absolute bottom-4 right-4 flex flex-wrap items-center justify-end gap-2 sm:bottom-8 sm:right-8 sm:gap-[22px]">
          {/* Rendered for every project, but inert until a detail page exists.
              Flipping `detailReady` in the content file is the only change
              needed to wake it up. */}
          {project.detailReady ? (
            <a
              href={`/projects/${project.slug}`}
              className={pill('dark', { className: 'uppercase' })}
            >
              {dict.projects.goToProject}
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className={pill('dark', { disabled: true, className: 'uppercase' })}
            >
              {dict.projects.goToProject}
            </button>
          )}

          {/* Same treatment: always present so the card matches the design,
              disabled until a live demo URL exists. */}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={pill('outline', { className: 'uppercase' })}
            >
              {dict.projects.seeItInAction}
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className={pill('outline', { disabled: true, className: 'uppercase' })}
            >
              {dict.projects.seeItInAction}
            </button>
          )}
        </div>
      </div>

      <h3 className="mt-6 text-h3 font-semibold">{project.title}</h3>
      <p className="mt-1 text-lead font-normal text-paper/80">{project.subtitle}</p>

      <ul className="mt-4 flex flex-wrap items-center gap-2">
        {project.tags.map((tag, i) => (
          <li
            key={tag}
            // The first tag is the project's primary technology, so tag order
            // in the content file is meaningful.
            className={pill(i === 0 ? 'light' : 'outline', {
              interactive: false,
              className: 'uppercase',
            })}
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}
