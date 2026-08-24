## Context

`figma.json` is a Figma REST export of one file, `Portifólio de Pedro`, containing a single page with one dev-ready frame: `PÁGINA PRINCIPAL`, 1280×5264, background `#1A1A1A`.

Three properties of that export shape every decision below:

1. **No design system in the file.** `components: 0`, `styles: 0`, and almost no auto-layout — the frame is a flat stack of absolutely-positioned layers. Section boundaries, spacing rhythm, and token names do not exist in the data; they were derived from layer coordinates during exploration and are recorded here as the authoritative structure.
2. **One breakpoint.** There is no mobile or tablet frame. All responsive behaviour is invented.
3. **Internal inconsistencies.** The frame declares a 12-column grid computing to 1120px with 80px margins, but cards, dividers, and the contact card are 1058px wide (111px margins) and service rows are 981px wide (~150px margins). Separately, the header and the hero background rectangle were drawn 1440px wide inside a 1280px clipped frame, so the header's own layer coordinates place `ENG` outside the visible canvas.

The repository is empty apart from `README.md` and `figma.json` — no `package.json`, no lockfile, no prior conventions to honour. This change is a greenfield bootstrap.

The derived section map, in frame-relative Y:

| Y | Region | Notable |
|---|---|---|
| 0 | Header | 60px tall; drawn at 1440px, must be rebuilt |
| 156 | Hero | linear gradient + radial glow + `NOISE` effect |
| 600 | divider + tech strip | strip at 50% opacity |
| 754 | Services | eyebrow, heading, 4 rows, 5 dividers |
| 1621 | Projects | 1 wide card + 2 half cards, replaced by carousel |
| 3010 | About | framed photo + bio + timeline |
| 4051 | Contact | outlined card 1058×499, vertical divider |
| 4884 | grey rectangle | footer placeholder, undesigned |

## Goals / Non-Goals

**Goals:**

- One deployable landing page that reads as a faithful realisation of the Figma frame at 1280px, and as a deliberately designed page at every narrower width.
- A token layer and primitive set such that no section component contains a raw hex value, font size, or radius.
- Content editable by touching one typed file per content kind, with the component tree untouched.
- Entrance animation that is decorative only: content is fully present in server-rendered markup and in the accessibility tree regardless of whether the animation runs.
- Structural readiness for the two known next phases — per-project detail pages and a second locale — without paying their implementation cost now.

**Non-Goals:**

- Per-project detail pages (`/projects/[slug]`). Gated behind the `detailReady` flag.
- A second locale or a visible language switcher. The dictionary shape is built; only `en` is filled.
- Real photography and project imagery. Placeholders only.
- The final footer design. A default is built from existing marks.
- Any backend: no contact form, no CMS, no analytics, no API routes.
- Pixel-exact reproduction of the Figma `NOISE` effect.
- A CI or deployment pipeline.

## Decisions

### Next.js App Router over Vite or Astro

**Chosen because** the known next phase is per-project detail pages, where file-based routing, metadata, and static generation are free rather than assembled. It also matches the stack advertised in the portfolio's own copy.

Alternatives: **Vite + React** — leaner and faster to build, but detail-page routing and per-page metadata become hand-rolled work in the next phase. **Astro** — best possible performance for a page this static, but the carousel and reveal would be React islands anyway, and the framework is less familiar for ongoing maintenance of a personal site.

### Server components by default, with narrow client leaves

All five sections, the footer, and the page itself are server components. Client boundaries are confined to three leaves: `Header` (scroll state and the mobile overlay), `Carousel` (slide state, drag, keys), and `Reveal` (IntersectionObserver).

`Reveal` matters most: it is a wrapper that only toggles a class on its own element, so `children` stay server-rendered. This is what makes the "content present without JavaScript" requirement structurally true rather than something to test for.

Alternative: marking whole sections `"use client"` — simpler, but ships every section's markup as a JS payload and makes the no-JS guarantee incidental instead of guaranteed.

### One 1120px container; the declared grid wins over measured layers

The Figma's three content widths are reconciled onto the **declared 12-column grid (1120px, 80px padding)**, because that is the only width the designer stated as intent rather than produced by dragging layers.

Consequence: service rows render ~12% wider than drawn. This is an improvement, not just a compromise — the justified 16px description text is cramped at 628px and reads better with more measure. Cards and the contact card grow 62px, which is visually immaterial.

Alternative: adopting 1058px, the most frequently occurring width. Rejected because it leaves service rows still misaligned and contradicts the stated grid.

### Header rebuilt against the container, ENG dropped

The header's layer coordinates are unusable (1440px content inside a 1280px clip). It is rebuilt as a flex row inside the shared container: wordmark left, nav right.

`ENG` is not implemented. It is clipped out of the visible frame, and a switcher with one populated locale is a control that does nothing. The dictionary structure it implies is built; the control is not.

### Sticky header with a scroll-triggered backdrop

Not specified in the Figma — the header is simply drawn at the top, transparent over the hero. A 5264px page with four nav anchors needs persistent navigation, so the header is sticky, transparent at offset zero to preserve the designed hero, and gains a blurred tinted background past a threshold so labels survive over section content.

Anchor targets carry `scroll-margin-top` so headings clear the sticky header. Smooth scrolling is applied via CSS and is automatically suppressed under `prefers-reduced-motion`.

### Carousel: bespoke, roughly 150 lines, no library

The requirements are one slide at a time, arrows, dots, drag, swipe, arrow keys, no autoplay, no infinite virtualisation. A transform on a flex track plus pointer-event handlers covers it. Embla or Swiper would add a dependency and a styling-override surface larger than the implementation it replaces.

The two mechanisms that need care:

- **Drag versus click.** A pointer-down on the slide starts a drag; on pointer-up the accumulated distance decides. Past the threshold, the slide changes and the ensuing `click` is suppressed so a drag ending over an action pill does not activate it. Below the threshold, the track animates back.
- **Axis intent.** The first few pixels of movement decide the axis. Vertical wins, the drag is abandoned and page scrolling proceeds untouched, which is what makes the carousel usable on a phone.

Alternative: CSS scroll-snap — near-free drag and swipe, but wiring dots, arrows, and an accurate active index back out of scroll position is fiddlier than owning the index directly.

### Arrows and dots below the slide, not overlaid

The container is 1120px inside a 1280px design width, leaving 80px per side. Arrows placed outside the card would sit against the viewport edge and have nowhere to go on narrow screens. Grouping previous, dots, and next in a centred row below the slide keeps one control cluster at every width and avoids the slide's bottom-right action pills.

### Two projects abreast on desktop, at the half-width card's 500:341 ratio

The carousel shows two projects side by side from `lg` (1024px) up, and one below it — the same breakpoint as the page's other two-column layouts. Each slide is therefore half the container, which is exactly what the Figma's pair of half-width cards are, so the image takes their 500:341 proportion.

This supersedes an earlier decision to keep the featured card's 3.1:1 ratio: at half width that ratio would letterbox the image into a 531×171 strip.

Two mechanics make it work:

- **Translate by `100 / visible` percent.** The track is a block whose box is the container's width, with the slides overflowing it — so one slide is always `100 / visible` percent of the track, whether that is one full-width card or one of a pair. The carousel advances by one project either way.
- **The gutter is padding, not `gap`.** A `gap` would widen the flex line and break that arithmetic. Each slide carries 29px of horizontal padding and the track a matching negative margin, so the outer half-gutters fall outside the `overflow-hidden` box: 58px between the cards, and the pair still flush with the container edges.

`visible` comes from a `matchMedia` read through `useSyncExternalStore`, with a server snapshot of 1 so hydration matches. Slide widths are pure CSS, so the cards are correct from the first paint regardless; the value only drives step distance, which slides are inert, and the dot count. The index is clamped at render rather than corrected in an effect — widening the viewport removes a resting position, and deriving the clamp avoids both an extra render and a visible jump.

### Both action pills always render, disabled when they have no destination

`SEE IT IN ACTION` was originally omitted when a project had no live URL. That left the card looking unlike the design for exactly the projects that have no demo yet — which is all of them at first. It now follows `GO TO PROJECT`: always present, disabled until the data arrives.

Two pills need roughly 345px side by side, which the card does not always have — narrow phones, and the 1024–1279 range where two-up cards are only ~395px. The pill row wraps right-aligned instead of being tuned per breakpoint, so it self-corrects at any width.

### Current-section highlight reuses the header's scroll listener

The header already listens to scroll for its backdrop, so the active-section calculation joins that same handler rather than adding an observer. The rule is deliberately simple: the last section whose top has crossed a line just below the header wins; nothing has crossed it while the hero is in view, which is why no link is marked there.

The line sits **half a viewport down**, so a section takes the highlight when it starts owning most of the screen. Anchoring it just below the header instead meant the highlight arrived about 350px of scrolling after the section had visibly taken over — measured, not estimated. Half the viewport is the crossover point where the incoming section covers more than the outgoing one, which is the same moment a reader would say they had arrived, so the observed lag is zero at every viewport height tested.

Under that sits a **floor**: each section's own `scroll-margin-top`, which is exactly where an anchor click lands it. The line may never rise above that floor. An earlier version used a hand-picked constant 8px above the landing position, so a clicked section sat just below the line and never registered — the previous link stayed underlined until the visitor nudged the page. Keeping the floor derived from the same CSS declaration means the ratio can be retuned freely without reintroducing that bug, and removes the drift risk rather than re-calibrating a number.

One special case earns its code — the final section is short and the footer sits below it, so `#contact` may never cross the line on its own. Reaching the bottom of the page is treated as arriving at the last section.

The underline is a pseudo-element scaled from the left, so it animates without ever reflowing the nav. Note that Tailwind v4 implements `scale-x-*` through the CSS `scale` property rather than `transform`; its `transition-transform` covers `transform, translate, scale, rotate`, so the animation works — but anything inspecting the computed value must read `scale`, not `transform`.

### detailReady boolean, not a URL field

Disabled state is driven by an explicit per-project flag rather than inferred from an absent `detailUrl`. Absence is ambiguous — it cannot distinguish "no detail page exists yet" from "this project deliberately has none". The flag also makes the phase-2 switch a data edit, and the route can be derived from `slug`.

The disabled control renders as a real `button` with the `disabled` attribute, `aria-disabled`, reduced opacity, and `cursor-not-allowed` — deliberately not `pointer`, per the design-system rule that pointer means activatable.

### Reveal: IntersectionObserver, unobserve on fire, CSS-variable stagger

A single observer with a ~15% threshold. On intersection the element gets its visible class and is immediately unobserved — this is what makes "exactly once" a property of the mechanism rather than a flag to maintain.

Stagger is passed as a CSS custom property computing `transition-delay` from the child index, so the cascade is CSS and the JS only flips one class.

The critical inversion: the **hidden** state is applied by a class the client adds on mount, not by the initial server markup. Server-rendered HTML is therefore at the resting position, so no-JS visitors and crawlers see finished content, and there is no flash-of-hidden-content if hydration is slow. Under `prefers-reduced-motion` the hidden class is never applied at all.

Alternative: an animation library such as Framer Motion. Rejected — this is `translateY` and `opacity` with a delay; a runtime is disproportionate on a page whose only other client JS is a carousel.

The arming script mutates `<html>` before React hydrates, which is the entire point of it — but it also means React finds an attribute the server never sent and reports a hydration mismatch. React does not revert the attribute ("this won't be patched up"), so the behaviour was always correct and only the warning was wrong. `<html>` therefore carries `suppressHydrationWarning`, the documented escape hatch for pre-hydration DOM mutation; it reaches one level only, covering that element's own attributes and never its descendants. This is the same pattern theme-flash prevention uses.

Worth recording how this was missed: the mismatch is reported only by the development server, and every verification suite ran against `next start`. Hydration and console health now have their own suite that runs against `next dev`, because a production server cannot observe this class of bug at all.

### Hero noise as inline SVG feTurbulence

The Figma `NOISE` effect (monotone, size 2, density 0.3, black at 50%) has no CSS equivalent. An inline `feTurbulence` filter as a data URI background reproduces the grain with no network request and no binary asset — the fidelity gap is negligible against a `#1A1A1A` background.

Alternative: a tiled PNG. Rejected as an extra request plus a binary blob in the repository for something generable.

### Icons from a library, not the Figma vectors

The WhatsApp, e-mail, and LinkedIn marks are `VECTOR` nodes whose path data is not in the REST export. They are brand and generic marks, so a maintained icon set (tree-shaken, single icons imported) is used rather than tracing them.

### Tag emphasis promoted to a rule

The Figma renders the first tag as a solid white pill and the rest as outlines. Rather than treating that as an artefact, it becomes the rule: `tags[0]` is the emphasised primary technology. This makes tag ordering meaningful in the content file and removes per-project styling decisions.

### Footer built only from existing marks

Given "make something standard for now", inventing visual language would be waste — it will be replaced. The footer recombines only the wordmark, the four nav links, and the gradient divider.

It deliberately stops short of repeating the contact channels: the Contact section sits directly above it with all three in full, so a second copy adds length without adding information. The copyright line went the same way. Replacement later touches one component.

## Risks / Trade-offs

- **The derived section map may not match the designer's mental model.** Coordinates cannot distinguish "one section" from "two adjacent groups". Mitigation: the map is recorded in Context above and was confirmed during exploration; it is the reviewable artefact if a boundary is wrong.
- **Widening service rows to 1120px changes a designed measure.** Justified 16px text over a wider column could read loosely. Mitigation: cap the description column's measure independently of the container if it reads poorly; the container decision is unaffected.
- **Responsive behaviour is entirely invented and unreviewed against a design.** Mitigation: breakpoint behaviour is specified as requirements rather than left to implementation, so it can be reviewed as intent before any code is judged.
- **The 3.1:1 slide is unforgiving.** Screenshots of dense UIs crop badly at that ratio. Mitigation: recorded as an open question; the change is one aspect-ratio value.
- **Drag handling is the most likely source of subtle bugs** — misinterpreted axis, phantom clicks on pills, stuck pointer capture. Mitigation: the failure modes are written as explicit scenarios in `projects-carousel`, including drag-below-threshold, vertical gesture, and drag-ending-over-an-action.
- **Placeholders will dominate the first deploy.** With no photo and no project images, the page is largely grey blocks. Mitigation: placeholders hold exact designed dimensions and radii so layout is final and swapping assets cannot shift it. Whether to deploy publicly before assets arrive is the author's call.
- **The reveal's server-visible / client-hides inversion is easy to break.** A later refactor that moves the hidden state into initial markup would silently break the no-JS and crawler guarantees. Mitigation: encoded as requirements with their own scenarios in `scroll-reveal`.
- **A sticky header over a 5264px page can collide with anchor targets** if `scroll-margin-top` drifts from the header height. Mitigation: both derive from the same token.
- **Font weight sprawl.** Urbanist across 400 to 900 is six weight files. Mitigation: only weights actually present in the design are loaded; self-hosting with subsetting keeps the cost bounded.

## Migration Plan

Not applicable — greenfield. There is no existing site, no users, no data to migrate, and nothing to roll back to. `figma.json` remains in the repository as the design reference and is not read at build time.

## Open Questions

1. ~~**Slide aspect ratio**~~ — **resolved**: 500:341, the Figma's half-width card, now that two slides share the row. Project images should be exported at that proportion.
2. **Carousel boundary behaviour** — wrap from last to first, or disable the arrow at each end? Proceeding with wrap, now over resting positions rather than projects.
3. **Disabled action affordance** — should the two disabled pills carry a "coming soon" tooltip, or stay silently de-emphasised? Proceeding without a tooltip. Now that both pills can be disabled at once, a card with no destinations shows two inert buttons — worth revisiting once real project data exists.
4. **Tech strip in the hero** — currently presentational per the design. Worth linking each name to the projects using it once real project data exists?
5. **Real content** — project entries beyond the single named `Corporate Cash Flow`, and the About photograph. Placeholders until supplied; does not block implementation.
