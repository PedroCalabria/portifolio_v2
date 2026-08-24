## ADDED Requirements

### Requirement: Page composes seven regions in a fixed order

The landing page SHALL render exactly these regions, top to bottom: Header, Hero, Services, Projects, About, Contact, Footer.

#### Scenario: Page renders

- **WHEN** the landing page is loaded
- **THEN** the seven regions appear in that order
- **AND** the page background is `#1A1A1A`

### Requirement: Header is sticky and gains a background after scroll

The header SHALL remain fixed at the top of the viewport while the page scrolls. It SHALL render with no background over the hero, and once the page has scrolled past a threshold it SHALL gain a blurred, tinted background so nav labels stay legible over section content.

The header SHALL be 60px tall and align its contents to the shared content container.

#### Scenario: At the top of the page

- **WHEN** the page is at scroll offset zero
- **THEN** the header has no background fill and the hero shows through it

#### Scenario: After scrolling

- **WHEN** the page is scrolled past the threshold
- **THEN** the header shows a blurred tinted background
- **AND** it remains visible at the top of the viewport

#### Scenario: Scrolling back up

- **WHEN** the page returns to scroll offset zero
- **THEN** the header background is removed again

### Requirement: Header presents the wordmark and section navigation

The header SHALL render a two-line wordmark — `PEDRO` at Urbanist 500 above `CALÁBRIA` at Urbanist 900 — and four navigation links: `Services`, `Projects`, `About`, `Contact Me`.

The wordmark SHALL return the visitor to the top of the page.

#### Scenario: Nav link set

- **WHEN** the header is rendered at desktop width
- **THEN** exactly four nav links are present, reading `Services`, `Projects`, `About`, and `Contact Me`

#### Scenario: Wordmark activation

- **WHEN** the wordmark is activated
- **THEN** the page scrolls to the top

### Requirement: The navigation marks the section currently in view

The header SHALL indicate which section the visitor is reading. The link for that section SHALL carry a blue underline that animates in and out, and SHALL be announced as the current item to assistive technology.

At most one link SHALL be marked at a time. At the top of the page no link SHALL be marked, since the hero has no nav entry.

A section SHALL take the mark once it occupies the majority of the viewport — not only once its top reaches the header. The indication SHALL therefore change at the point a reader would say they have arrived at the section, rather than lagging several hundred pixels behind it.

The threshold SHALL never sit above the position an anchor click lands a section on, so that clicking a nav link and scrolling to the same section agree. Activating a nav link SHALL leave that link marked, with no further scrolling required.

Because the footer sits below the final section, reaching the bottom of the page SHALL mark the last section rather than leaving an earlier one marked.

The mobile overlay SHALL indicate the current section too, by colouring its link rather than underlining it.

#### Scenario: Reading a section

- **WHEN** a section is scrolled into view beneath the header
- **THEN** its nav link is marked current and its underline is fully extended
- **AND** every other link's underline is collapsed

#### Scenario: The mark keeps up with the scroll

- **WHEN** the visitor scrolls until a section fills most of the viewport
- **THEN** that section's link is already marked
- **AND** the mark does not wait for the section's top to reach the header

#### Scenario: Short and tall viewports

- **WHEN** the same page is scrolled on a short viewport and on a tall one
- **THEN** the mark changes at the equivalent point in each, since the threshold scales with viewport height

#### Scenario: On the hero

- **WHEN** the page is at the top
- **THEN** no nav link is marked current
- **AND** every underline is collapsed

#### Scenario: Arriving by clicking a nav link

- **WHEN** the visitor activates a nav link and the scroll settles
- **THEN** that link is marked current
- **AND** no additional scrolling is needed for it to become marked

#### Scenario: Arriving by clicking with reduced motion

- **WHEN** the visitor has requested reduced motion and activates a nav link
- **THEN** the target section is reached instantly and its link is marked current

#### Scenario: At the bottom of the page

- **WHEN** the visitor scrolls to the very bottom
- **THEN** the last section's link is marked current

#### Scenario: Moving between sections

- **WHEN** the visitor scrolls from one section to the next
- **THEN** exactly one link is marked current at rest
- **AND** the underline transitions rather than snapping

#### Scenario: Reduced motion

- **WHEN** the visitor has requested reduced motion
- **THEN** the current-section indication still changes, without an animated transition

### Requirement: The wordmark responds to hover

The wordmark SHALL signal that it is activatable: on hover, the surname turns the primary blue while the given name stays white. This applies to the wordmark wherever it appears.

#### Scenario: Hovering the wordmark

- **WHEN** the pointer enters the wordmark in the header or the footer
- **THEN** the surname becomes `#244FFF` with an animated colour change
- **AND** the given name remains `#FFFFFF`

### Requirement: Section anchors scroll smoothly and clear the sticky header

Activating a header nav link, a footer nav link, or a hero call-to-action that targets a section SHALL scroll to that section smoothly rather than jumping.

The scroll destination SHALL be offset so the sticky header does not cover the section's heading.

#### Scenario: Navigating to a section

- **WHEN** the `Projects` nav link is activated
- **THEN** the page scrolls smoothly to the Projects section
- **AND** the section eyebrow and heading are fully visible below the header

#### Scenario: Reduced motion preference

- **WHEN** the visitor has requested reduced motion and activates a nav link
- **THEN** the target section is reached without an animated scroll

### Requirement: Mobile navigation uses a hamburger overlay

Below the desktop breakpoint the header SHALL replace the inline nav with a hamburger control that opens a full-screen overlay listing the four section links at enlarged type.

Selecting a link SHALL close the overlay and scroll to the section. The overlay SHALL be dismissible without navigating, SHALL trap keyboard focus while open, and SHALL prevent the page behind it from scrolling.

#### Scenario: Opening the overlay

- **WHEN** the hamburger control is activated on a narrow viewport
- **THEN** a full-screen overlay presents the four section links
- **AND** the page behind the overlay does not scroll

#### Scenario: Selecting a link from the overlay

- **WHEN** a link inside the overlay is activated
- **THEN** the overlay closes
- **AND** the page scrolls to that section

#### Scenario: Dismissing without navigating

- **WHEN** the visitor presses Escape or activates the close control
- **THEN** the overlay closes and the scroll position is unchanged

#### Scenario: Keyboard focus while open

- **WHEN** the overlay is open and the visitor cycles focus with the keyboard
- **THEN** focus stays within the overlay

### Requirement: Default footer recombines existing design language

The Figma provides no footer design, so the system SHALL render a deliberately spare default footer built only from marks already established elsewhere in the page: the wordmark, the four section links, and the gradient divider.

The footer SHALL introduce no colour, typeface, or radius outside the design tokens. It SHALL NOT repeat the contact channels, which the Contact section above it already presents in full.

#### Scenario: Footer renders

- **WHEN** the footer is rendered
- **THEN** it presents the wordmark, the four section links, and the gradient divider
- **AND** every colour and radius used resolves to a design token

#### Scenario: Contact details are not duplicated

- **WHEN** the footer is rendered
- **THEN** it carries no contact channel icons or details of its own

#### Scenario: Footer links behave like header links

- **WHEN** a footer section link is activated
- **THEN** the page scrolls smoothly to that section with the sticky-header offset applied

### Requirement: Layout adapts below the desktop breakpoint

The Figma covers 1280px only. The system SHALL define tablet and mobile behaviour: service rows stack their label above their description, the About photo and content columns stack vertically, and the Contact heading and channel list stack vertically.

At every viewport width the page SHALL NOT scroll horizontally.

#### Scenario: Narrow viewport

- **WHEN** the page is rendered at a mobile viewport width
- **THEN** service rows, the About columns, and the Contact columns are each stacked vertically
- **AND** the page body has no horizontal overflow

#### Scenario: Wide content within a narrow viewport

- **WHEN** a long unbroken string such as an e-mail address is rendered at a mobile width
- **THEN** it wraps or truncates within its container rather than widening the page
