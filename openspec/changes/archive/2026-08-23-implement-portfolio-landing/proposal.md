## Why

The repository is empty (no `package.json`, no application code) while a complete desktop design already exists in `figma.json` — the `PÁGINA PRINCIPAL` frame, 1280×5264, marked `READY_FOR_DEV`. Pedro Calábria has no live portfolio, so there is no single link to hand to a prospective client or employer.

The Figma file cannot be translated mechanically: it is a flat stack of absolutely-positioned layers with **zero components, zero named styles, and no auto-layout**, and there is **no mobile design**. Section structure, the responsive strategy, and the design-token vocabulary all have to be established as part of this change rather than read out of the file.

## What Changes

- Bootstrap the project: Next.js (App Router) + TypeScript + Tailwind, self-hosted Google Fonts (Urbanist 400–900, Work Sans 400).
- Extract the Figma design into a token layer (colors, type scale, radii, gradients, glows) and a small set of visual primitives — pill, eyebrow, gradient divider, radial glow, content container.
- Build the single landing page from seven regions: Header, Hero, Services, Projects, About, Contact, Footer.
- **Reconcile three conflicting content widths in the Figma** (declared 12-column grid = 1120px; cards/dividers/contact card = 1058px; service rows = 981px) onto **one 1120px container with 80px page padding**. Service rows therefore render ~12% wider than designed.
- **Replace the Figma projects layout** (one wide card + two half cards) with a **single-project-per-slide carousel** — arrows, position dots, pointer drag/touch swipe, and arrow-key navigation.
- Render the `GO TO PROJECT` button in a **disabled** state, gated by a `detailReady` flag per project. Per-project detail pages are explicitly out of scope (next phase).
- Add a **reveal-on-first-scroll** animation: each section's direct children rise from below and fade in exactly once, staggered, disabled under `prefers-reduced-motion`.
- Design a **default footer** — the Figma has only a grey 380px placeholder rectangle. It recombines existing design language (wordmark, nav links, contact icons, gradient divider); no new visual vocabulary.
- Store dynamic content (projects, experience, services, UI copy) as typed files inside the repository — no CMS, no external fetch.
- Structure copy as a per-locale dictionary with **only `en` populated and no visible language switcher**. The Figma's clipped `ENG` label is not implemented as a control.
- Establish mobile and tablet behaviour that the Figma does not cover: hamburger overlay nav, stacked service rows, stacked About and Contact columns.
- Use placeholder assets for the About photo and every project image; supply real URLs only for the confirmed contact channels (WhatsApp, `pedsancal@gmail.com`, `https://www.linkedin.com/in/pedrocalabria/`).

## Capabilities

### New Capabilities

- `design-system`: Design tokens extracted from Figma (palette, Urbanist/Work Sans type scale, radii, gradient dividers, radial glows, hero noise), the shared 1120px content container, responsive breakpoints, and the visual primitives reused across sections. Includes the global rule that every interactive element shows a pointer cursor and a visible focus ring.
- `content-model`: Typed, in-repository content sources for projects, experience entries, and service entries, plus the per-locale copy dictionary with a single active locale. Defines the `detailReady` flag that gates project detail links and the placeholder contract for missing assets.
- `site-shell`: Page composition and chrome — sticky header that gains a blurred background after scroll, desktop nav, mobile hamburger overlay, smooth-scrolling section anchors offset for the sticky header, and the default footer.
- `landing-sections`: The four content sections rendered directly from the design — Hero (two-tone headline, dual CTA, tech strip), Services (numbered rows separated by gradient dividers), About (framed photo, bio, experience timeline), and Contact (outlined card with three channels).
- `projects-carousel`: One-project-per-slide carousel — slide composition (image with overlaid action pills, title, subtitle, emphasised-first tag list), arrow and dot controls, pointer drag and touch swipe, arrow-key navigation, and the disabled `GO TO PROJECT` state.
- `scroll-reveal`: First-time-only entrance animation driven by IntersectionObserver — upward translation plus fade, staggered across a container's children, unobserved after firing, and reduced to an instant appearance under `prefers-reduced-motion`.

### Modified Capabilities

None — `openspec/specs/` is empty; this is the first change in the repository.

## Impact

**New code** — the entire application: `app/` (root layout, page, global stylesheet), `components/layout/`, `components/sections/`, `components/ui/`, `content/`, `lib/`, and `public/` placeholder assets.

**New dependencies** — `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, and an icon source for the WhatsApp / e-mail / LinkedIn marks (the Figma `VECTOR` nodes carry no exportable paths). No runtime data layer, no analytics, no form backend.

**Tooling** — TypeScript, ESLint, and Prettier configuration; `package.json` scripts. No CI or deployment pipeline in this change.

**Deferred to a later phase** — per-project detail pages at `/projects/[slug]`, a second locale plus the visible language switcher, real photography and project imagery, and the final footer design.

**Fidelity trade-offs accepted** — the Figma `NOISE` effect on the hero has no CSS equivalent and is approximated with an inline SVG `feTurbulence` overlay; the header and hero background were drawn at 1440px inside a 1280px clipped frame, so their layer coordinates are unreliable and the header is rebuilt against the 1120px container.

**Unaffected** — `figma.json` stays in the repository as the design reference and is not consumed at build time.
