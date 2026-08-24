## 1. Project bootstrap

- [x] 1.1 Initialise a Next.js App Router project with TypeScript in the repository root, keeping the existing `README.md` and `figma.json` untouched
- [x] 1.2 Add Tailwind and wire it into the global stylesheet; confirm `npm run dev` serves a page and `npm run build` succeeds
- [x] 1.3 Add ESLint and Prettier configuration plus `lint` and `format` scripts
- [x] 1.4 Add a `.gitignore` covering `node_modules`, `.next`, and build output
- [x] 1.5 Create the directory skeleton: `components/layout`, `components/sections`, `components/ui`, `content`, `lib`, `public`

## 2. Design tokens and fonts

- [x] 2.1 Self-host Urbanist at weights 400, 500, 600, 700, 800, 900 and Work Sans at 400; expose them as CSS variables in the root layout
- [x] 2.2 Define the colour tokens: background `#1A1A1A`, foreground `#FFFFFF`, primary `#244FFF`, eyebrow `#7792FF`, bullet `#3E65FF`, placeholder `#D9D9D9`, hero gradient stop `#060606`
- [x] 2.3 Define the type scale tokens: 68/72, 48/58, 32/38, 22/26, 20/24, 18/22, 16/19 in Urbanist, plus the Work Sans 28/33 ordinal style
- [x] 2.4 Define the radius tokens (`100px` pill, `20px` card), the header-height token, and the eyebrow tracking value `0.6em`
- [x] 2.5 Set the page background and base text colour; verify no fallback font renders and both 800 and 900 weights are distinct from synthesised bold
- [x] 2.6 Add a global rule giving every interactive element a pointer cursor and a focus-visible ring legible against `#1A1A1A`

## 3. Layout primitives

- [x] 3.1 Build the `Container` primitive: 1120px max width, 80px horizontal padding, shrinking without horizontal page overflow below that width
- [x] 3.2 Build `Pill` with solid, outline, primary, ghost, and disabled variants; the disabled variant uses `cursor-not-allowed`, never `pointer`
- [x] 3.3 Build `Eyebrow` at Urbanist 500 18px, `0.6em` tracking, colour `#7792FF`
- [x] 3.4 Build `Divider` as a 2px line with a transparent to `#FFFFFF` 50% to transparent gradient stroke, in horizontal and vertical orientations
- [x] 3.5 Build `Glow` as a radial `#FFFFFF` 10% to transparent ellipse, `pointer-events: none` and hidden from the accessibility tree
- [x] 3.6 Build the hero noise texture as an inline `feTurbulence` data URI (monotone, black at 50%), confirming no network request is made

## 4. Content model

- [x] 4.1 Define the `Project` type (`slug`, `title`, `subtitle`, `tags`, `image`, optional `liveUrl`, `detailReady`) and seed `content/projects.ts` with `Corporate Cash Flow` plus placeholder entries, all `detailReady: false`
- [x] 4.2 Define the `Experience` type (`company`, `role`, `period`, `stack`) and seed `content/experience.ts` with the Pitang and CoTechAI entries from the design
- [x] 4.3 Define the `Service` type and seed `content/services.ts` with the four service entries; ordinals are derived from index, not stored
- [x] 4.4 Build the locale dictionary shape and populate `content/en.ts` with all header, hero, section, contact, and footer copy from the design
- [x] 4.5 Build `lib/locale.ts` with a `getDictionary()` accessor returning `en`, and set the document `lang` attribute from the active locale
- [x] 4.6 Add a placeholder image component or asset rendering a `#D9D9D9` fill at a given aspect ratio and radius, for the About photo and project images
- [x] 4.7 Assert slug uniqueness across project entries (a typed check or a dev-time guard)

## 5. Scroll reveal

- [x] 5.1 Build the `Reveal` client wrapper using a single IntersectionObserver at a ~15% threshold, unobserving each element once it has fired
- [x] 5.2 Implement the inversion: server markup renders at the resting position, and the hidden class is applied by the client on mount
- [x] 5.3 Implement the stagger by passing the child index as a CSS custom property that computes `transition-delay`
- [x] 5.4 Skip applying the hidden class entirely when `prefers-reduced-motion: reduce` is set
- [x] 5.5 Verify the wrapper adds no layout box of its own, creates no scroll container, and does not clip overflowing glows
- [x] 5.6 Verify with JavaScript disabled that all section content is visible at its resting position

## 6. Site shell

- [x] 6.1 Build `Header` with the two-line wordmark (`PEDRO` at 500 above `CALÁBRIA` at 900) and the four nav links, aligned in the shared container at 60px tall
- [x] 6.2 Add the sticky behaviour: transparent at scroll offset zero, blurred tinted background past the threshold, reverting on scroll back to top
- [x] 6.3 Make the wordmark return to the top of the page
- [x] 6.4 Wire the nav links to section anchors with CSS smooth scrolling and `scroll-margin-top` derived from the header-height token
- [x] 6.5 Build the mobile hamburger overlay: full-screen, enlarged links, focus trap, scroll lock on the body, dismiss via Escape and a close control
- [x] 6.6 Close the overlay and scroll to the section when one of its links is activated
- [x] 6.7 Build `Footer` from existing marks only — wordmark, four nav links, three contact icon circles, gradient divider, copyright line — at roughly 240px
- [x] 6.8 Compose `app/page.tsx` with the seven regions in order: Header, Hero, Services, Projects, About, Contact, Footer

## 7. Hero

- [x] 7.1 Render the introduction line, the two-tone 68/72 headline (leading segment `#FFFFFF`, trailing segment `#244FFF`) as one heading element, and the supporting paragraph
- [x] 7.2 Render the primary and ghost calls to action, targeting the Contact and Projects anchors respectively
- [x] 7.3 Layer the background: `#060606` linear gradient, radial glow, and noise texture, all non-interactive and hidden from assistive technology
- [x] 7.4 Render the closing gradient divider and the technology strip at Urbanist 600 20/24 with reduced opacity and no links
- [x] 7.5 Apply `Reveal` to the hero's direct children and confirm it plays immediately on load

## 8. Services

- [x] 8.1 Render the eyebrow and the two-line centred 48/58 heading
- [x] 8.2 Render one row per service entry: Work Sans ordinal, Urbanist 700 20/24 title, Urbanist 500 16/19 description
- [x] 8.3 Place gradient dividers between consecutive rows and closing the list
- [x] 8.4 Stack each row's label above its description below the desktop breakpoint
- [x] 8.5 Apply `Reveal` with stagger across the eyebrow, heading, and rows in document order

## 9. Projects carousel

- [x] 9.1 Build the slide: aspect-ratio image box at 3.1:1 with a `20px` radius, title at 32/38, subtitle at 22/26, and the tag list below
- [x] 9.2 Overlay the action pills at the image's bottom-right, inset from both edges, legible over both real images and the placeholder
- [x] 9.3 Render tags with the first as a solid white pill with a `#1A1A1A` label and the rest as outline pills; keep them non-interactive with no pointer cursor
- [x] 9.4 Render `GO TO PROJECT` as a real disabled button when `detailReady` is `false` — `aria-disabled`, reduced opacity, `cursor-not-allowed`, no navigation on click or Enter
- [x] 9.5 Render `SEE IT IN ACTION` only when a `liveUrl` is present, opening externally with `noopener`
- [x] 9.6 Build the carousel track holding one slide per project, with only the active slide reachable by keyboard and exposed to assistive technology
- [x] 9.7 Build the control row below the slide: previous button, one dot per project with the active dot distinguished, next button — all real buttons
- [x] 9.8 Implement wrap-around at both boundaries
- [x] 9.9 Implement pointer drag and touch swipe with a distance threshold, settling back below it and changing slide above it
- [x] 9.10 Implement axis intent from the first few pixels of movement: a vertical gesture abandons the drag and leaves page scrolling untouched
- [x] 9.11 Suppress the click following a completed drag so a drag ending over an action pill does not activate it
- [x] 9.12 Implement Left and Right arrow key navigation active only while focus is inside the carousel
- [x] 9.13 Announce the active slide position to assistive technology on every change, and confirm the carousel never advances on its own
- [x] 9.14 Hide the arrow and dot controls when only one project exists
- [x] 9.15 Apply `Reveal` to the section and verify it does not conflict with the carousel's own slide transform

## 10. About

- [x] 10.1 Render the eyebrow and the two-line centred 48/58 heading
- [x] 10.2 Render the framed photo area with a `20px` radius and gradient border, filled with the `#D9D9D9` placeholder at the designed aspect ratio
- [x] 10.3 Render the upper-case role label, the two-tone name heading (given name at 500, surname at 800), and the biography paragraph
- [x] 10.4 Render the `EXPERIENCE` heading at Urbanist 700 48/58
- [x] 10.5 Build the timeline: vertical gradient line with one `#3E65FF` bullet per entry, each followed by company, combined role and period line, and technology list
- [x] 10.6 Stack the photo above the content column below the desktop breakpoint
- [x] 10.7 Apply `Reveal` with stagger to the About block

## 11. Contact

- [x] 11.1 Render the outlined card: transparent fill, 1px `#FFFFFF` border, `20px` radius, two columns split by a vertical gradient divider
- [x] 11.2 Render the left column: two-tone 68/74 heading with the trailing word in `#244FFF`, plus the supporting line at 22/26
- [x] 11.3 Render the three channels, each with a 45px `#244FFF` circle and white icon, name at 22/26, detail at 16/19
- [x] 11.4 Make each channel row activatable as a whole, wiring WhatsApp to `+55 (81) 9 9542-1115`, e-mail to `pedsancal@gmail.com`, and LinkedIn to `https://www.linkedin.com/in/pedrocalabria/` while displaying the label `pedrocalabria`
- [x] 11.5 Open external channels with `noopener`
- [x] 11.6 Stack the heading column above the channel column below the desktop breakpoint
- [x] 11.7 Apply `Reveal` with stagger to the card's contents

## 12. Verification

- [x] 12.1 Compare the rendered page against the Figma frame at a 1280px viewport, section by section, and record any deliberate deviations
- [x] 12.2 Confirm the Services rows, carousel, About block, and Contact card share identical left and right edges at 1280px and wider
- [x] 12.3 Check every viewport width from 320px upward for horizontal page overflow, including long strings such as the e-mail address
- [x] 12.4 Tab through the whole page: confirm a visible focus ring everywhere, that the disabled `GO TO PROJECT` never navigates, and that the mobile overlay traps focus
- [x] 12.5 Exercise the carousel with pointer drag, touch swipe, arrow keys, dots, and arrow buttons, including the boundary wrap and a vertical swipe
- [x] 12.6 Verify every reveal fires exactly once by scrolling away and back through all sections
- [x] 12.7 Verify the page under `prefers-reduced-motion: reduce`: no translation, no stagger, no animated anchor scrolling
- [x] 12.8 Verify the page with JavaScript disabled: all content visible, headings intact, links functional
- [x] 12.9 Confirm no user-facing string is inlined in a component and no raw hex value, font size, or radius bypasses the tokens
- [x] 12.10 Confirm the heading outline has a single top-level heading with no skipped levels, and that `npm run build` and `npm run lint` both pass clean

## 13. Interaction refinements

- [x] 13.1 Mark the section currently in view in the header nav: blue underline animating from the left, `aria-current`, and full-white label
- [x] 13.2 Compute the active section inside the header's existing scroll listener, with no link marked while the hero is in view
- [x] 13.3 Treat reaching the bottom of the page as arriving at the last section, since the footer sits below it
- [x] 13.4 Colour the active link in the mobile overlay rather than underlining it
- [x] 13.5 Show two projects abreast from `lg` up, one below it, advancing by a single project either way
- [x] 13.6 Derive the track translation from the visible count, and read that count via `useSyncExternalStore` with a server snapshot of 1
- [x] 13.7 Clamp the carousel index at render so widening the viewport cannot leave it past the last position
- [x] 13.8 Build the 58px gutter from slide padding plus a negative track margin, keeping the pair flush with the container edges
- [x] 13.9 Switch the slide image to the Figma half-width card's 500:341 proportion and update its `sizes`
- [x] 13.10 Render one dot per resting position instead of one per project, with range-aware labels and announcements
- [x] 13.11 Always render `SEE IT IN ACTION`, disabled when the project has no live URL
- [x] 13.12 Let the action pills wrap right-aligned so neither is ever clipped by a narrow card
- [x] 13.13 Turn the wordmark's surname primary blue on hover, in both the header and the footer
- [x] 13.14 Verify: 55 new checks (nav highlight, two-up split, gutter, ratio, hover), both regression suites, pill containment at 12 widths, and zero overflow from 320 to 1920
- [x] 13.15 Derive the active-section threshold from each section's `scroll-margin-top` so clicking a nav link marks that link immediately, instead of leaving the previous one underlined until the page is nudged
- [x] 13.16 Move the active-section line to half the viewport so the underline changes when a section takes over the screen, instead of ~350px later, keeping the anchor-landing floor so clicks still mark immediately
- [x] 13.17 Mark `<html>` `suppressHydrationWarning` so the pre-paint reveal-arming mutation stops being reported as a hydration mismatch, and add a dev-server suite for hydration and console health — the production-only suites could not see this class of bug
