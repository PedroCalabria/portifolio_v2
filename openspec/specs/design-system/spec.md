# Design System

## Purpose

Holds the visual vocabulary extracted from the Figma frame `PÁGINA PRINCIPAL`: the palette, the
Urbanist and Work Sans type scale, radii, gradient dividers, radial glows, and the hero's noise
texture. It also owns the single 1120px content container that every section aligns to, and the
global rules that make interactive elements feel interactive.

The point of this capability is that no section component should ever contain a raw colour, font
size, or radius — if a value is needed, it is a token here first.

## Requirements

### Requirement: Design tokens mirror the Figma source

The system SHALL expose the `PÁGINA PRINCIPAL` design values as named tokens consumed by every component, so no component hard-codes a raw colour, font size, or radius.

The palette SHALL be exactly: page background `#1A1A1A`; primary `#244FFF`; section eyebrow `#7792FF`; timeline bullet `#3E65FF`; asset placeholder `#D9D9D9`; foreground `#FFFFFF`; hero gradient stop `#060606`.

The type scale SHALL be: 68/72, 48/58, 32/38, 22/26, 20/24, 18/22, 16/19 — all Urbanist, except the service ordinals which use Work Sans 400 at 28/33.

Radii SHALL be limited to `100px` (pills) and `20px` (cards, framed photo).

#### Scenario: A component needs the primary colour

- **WHEN** a component renders the primary call-to-action or a contact icon circle
- **THEN** it references the primary token
- **AND** the resolved value is `#244FFF`

#### Scenario: A component needs a radius

- **WHEN** any pill or card is rendered
- **THEN** its radius resolves to either the `100px` pill token or the `20px` card token
- **AND** no other radius value appears in the stylesheet

### Requirement: Fonts are self-hosted with declared weights

The system SHALL load Urbanist at weights 400, 500, 600, 700, 800, and 900, and Work Sans at weight 400, self-hosted rather than fetched from a third-party stylesheet at runtime.

Work Sans SHALL be applied only to the two-digit service ordinals.

#### Scenario: The page loads without a network font request

- **WHEN** the page is loaded
- **THEN** no request is made to an external font host
- **AND** headings render in Urbanist rather than a fallback face

#### Scenario: Every designed weight is available

- **WHEN** the wordmark renders `CALÁBRIA` at weight 900 and the About heading renders `CALÁBRIA` at weight 800
- **THEN** both weights render as distinct strokes rather than a synthesised bold

### Requirement: A single content container governs horizontal alignment

The system SHALL define one content container of `1120px` maximum width with `80px` horizontal page padding, and every section SHALL align its content to that container.

This container replaces the three conflicting widths present in the Figma (1120px declared grid, 1058px cards and dividers, 981px service rows).

#### Scenario: Section edges line up

- **WHEN** the Services rows, the Projects carousel, the About block, and the Contact card are rendered at a viewport of 1280px or wider
- **THEN** their left edges share one x-coordinate
- **AND** their right edges share one x-coordinate

#### Scenario: Viewport narrower than the container

- **WHEN** the viewport is narrower than `1120px` plus padding
- **THEN** the container shrinks with the viewport and retains its horizontal padding
- **AND** no horizontal scrollbar appears on the page body

### Requirement: Shared visual primitives

The system SHALL provide reusable primitives for the repeated marks in the design: a pill, a section eyebrow, a gradient divider, and a radial glow.

The pill SHALL support a solid variant (filled, dark label), an outline variant (1px border, transparent fill), a primary variant (`#244FFF` fill), and a ghost variant (`#FFFFFF` at 10% opacity).

The section eyebrow SHALL render at Urbanist 500, 18px, letter-spacing `0.6em`, in `#7792FF`.

The gradient divider SHALL render a 2px line whose stroke runs transparent → `#FFFFFF` at 50% → transparent.

The radial glow SHALL render an ellipse filled `#FFFFFF` at 10% opacity fading to transparent, positioned behind section content without capturing pointer events.

#### Scenario: Eyebrow tracking

- **WHEN** the `SERVICES`, `PROJECTS`, or `ABOUT` eyebrow is rendered
- **THEN** its letter-spacing is `0.6em`
- **AND** its colour is `#7792FF`

#### Scenario: Glow does not block interaction

- **WHEN** a glow overlaps a link or button
- **THEN** clicking at that position activates the link or button
- **AND** the glow receives no pointer event

### Requirement: Interactive elements signal interactivity

Every element that responds to activation SHALL display a pointer cursor on hover and SHALL expose a visible focus indicator when focused via keyboard.

Elements rendered in a disabled state SHALL NOT display a pointer cursor.

#### Scenario: Hovering a navigation link

- **WHEN** the pointer enters a header nav link, a hero call-to-action, a contact channel, a carousel control, or a footer link
- **THEN** the cursor becomes a pointer

#### Scenario: Tabbing through the page

- **WHEN** the user moves focus with the keyboard onto any interactive element
- **THEN** a focus indicator is visible against the `#1A1A1A` background

#### Scenario: Hovering a disabled control

- **WHEN** the pointer enters a control rendered in the disabled state
- **THEN** the cursor does not become a pointer
