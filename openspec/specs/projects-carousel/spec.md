# Projects Carousel

## Purpose

The Projects section, which departs from the Figma on purpose: instead of one wide card plus two
half-width cards, projects are shown in a carousel — two abreast on desktop, one below it.

Covers slide composition, the emphasised first tag, the two action pills and their disabled
states, and the interaction surface: arrows, position dots, pointer drag, touch swipe, and
arrow-key navigation.

## Requirements

### Requirement: Projects are presented as a carousel, two abreast on desktop

Departing from the Figma layout of one wide card plus two half-width cards, the Projects section SHALL render a carousel. From the desktop breakpoint (1024px) it SHALL show **two projects side by side**, separated by a 58px gutter, with the outer edges of the pair aligned to the content container. Below that breakpoint it SHALL show one project at a time, spanning the container.

The carousel SHALL advance by one project at a time regardless of how many are on screen.

The section SHALL render its eyebrow and heading above the carousel.

#### Scenario: Initial render on desktop

- **WHEN** the Projects section is rendered at 1024px or wider
- **THEN** the first two projects in content order are visible
- **AND** no other project's content is reachable by keyboard or exposed to assistive technology

#### Scenario: Initial render below desktop

- **WHEN** the Projects section is rendered below 1024px
- **THEN** only the first project is visible
- **AND** the remaining projects are unreachable by keyboard

#### Scenario: Cards align to the container

- **WHEN** two projects are shown side by side
- **THEN** both cards are the same width
- **AND** the left edge of the first and the right edge of the second align with the content container

#### Scenario: Advancing moves by a single project

- **WHEN** the next control is activated while two projects are visible
- **THEN** the view moves on by one project, not by two

#### Scenario: Too few projects to fill the view

- **WHEN** the content file contains no more projects than are visible at once
- **THEN** the projects render
- **AND** no arrow or dot controls are shown

### Requirement: Slide composition follows the half-width card design

Each slide SHALL render an image area with a `20px` radius, in the proportion of the Figma's half-width project cards (500:341), with the action pills overlaid at its bottom-right inset from both edges.

Below the image the slide SHALL render the project title at Urbanist 600 32/38, the subtitle at Urbanist 400 22/26, and the tag list.

#### Scenario: Action pills overlay

- **WHEN** a slide is rendered
- **THEN** its action pills sit at the bottom-right of the image area, inset from the bottom and right edges
- **AND** they remain legible over both a real image and the `#D9D9D9` placeholder

#### Scenario: Pills stay within the card at every width

- **WHEN** the card is too narrow for both action pills to sit on one line
- **THEN** they wrap, remaining right-aligned and fully inside the card
- **AND** neither pill is clipped by the card's edge

#### Scenario: Text below the image

- **WHEN** a slide is rendered
- **THEN** the title, subtitle, and tag list appear below the image area, left-aligned to the content container

### Requirement: The first tag is emphasised

The tag list SHALL render the first tag as a solid pill — filled `#FFFFFF` with a `#1A1A1A` label — and every remaining tag as an outline pill with a white border and white label, matching the Figma treatment.

Tags SHALL be presentational and SHALL NOT be interactive.

#### Scenario: Mixed tag styling

- **WHEN** a project declares three tags
- **THEN** the first renders as a solid white pill with a dark label
- **AND** the second and third render as outline pills with white labels

#### Scenario: Tags are not links

- **WHEN** the pointer enters a tag
- **THEN** the cursor does not become a pointer

### Requirement: The project detail action is disabled until its page exists

The `GO TO PROJECT` action SHALL render for every project but SHALL be disabled whenever the project's `detailReady` flag is `false`.

A disabled action SHALL be visually de-emphasised, SHALL announce its disabled state to assistive technology, SHALL NOT show a pointer cursor, and SHALL NOT navigate or trigger any side effect when activated by pointer or keyboard.

Setting `detailReady` to `true` SHALL enable the action and link it to that project's detail route, with no component change required.

#### Scenario: Disabled by default

- **WHEN** a project's `detailReady` is `false`
- **THEN** its `GO TO PROJECT` action renders de-emphasised and marked disabled
- **AND** activating it by click or Enter does not navigate

#### Scenario: Enabled by the flag

- **WHEN** a project's `detailReady` is set to `true`
- **THEN** its `GO TO PROJECT` action becomes interactive with a pointer cursor
- **AND** activating it navigates to that project's detail route

#### Scenario: Live demo action is unaffected

- **WHEN** a project has `detailReady` set to `false` and a live URL present
- **THEN** `GO TO PROJECT` is disabled while `SEE IT IN ACTION` remains fully interactive

### Requirement: Both action pills are always present

Every card SHALL render both actions, so the card matches the design whatever data it holds. `SEE IT IN ACTION` SHALL be disabled whenever the project has no live URL, on the same terms as a disabled `GO TO PROJECT`: de-emphasised, announced as disabled, no pointer cursor, and inert on activation.

Supplying a live URL SHALL enable it with no component change.

#### Scenario: Card with neither destination

- **WHEN** a project has `detailReady` false and no live URL
- **THEN** both `GO TO PROJECT` and `SEE IT IN ACTION` render in the disabled state
- **AND** neither navigates when activated

#### Scenario: Live URL supplied

- **WHEN** a live URL is added to a project entry
- **THEN** its `SEE IT IN ACTION` becomes interactive with a pointer cursor
- **AND** it opens the URL in a new context with `noopener`

### Requirement: Arrow and dot controls advance the carousel

The carousel SHALL render a previous control, a next control, and one dot per **resting position** — the number of projects less the number visible, plus one — grouped below the slide.

The dot for the current position SHALL be visually distinguished. Activating a dot SHALL move directly to that position. All controls SHALL be real buttons, reachable and operable by keyboard.

#### Scenario: Dot count follows the visible count

- **WHEN** three projects are shown two at a time
- **THEN** two dots are rendered
- **AND** showing the same three projects one at a time renders three dots

#### Scenario: Advancing with the next control

- **WHEN** the next control is activated on the first slide
- **THEN** the second slide becomes active
- **AND** the second dot becomes the distinguished dot

#### Scenario: Jumping via a dot

- **WHEN** the third dot is activated
- **THEN** the third slide becomes active

#### Scenario: Controls at the boundaries

- **WHEN** the last slide is active
- **THEN** the next control either wraps to the first slide or is disabled, consistently with the previous control's behaviour on the first slide

#### Scenario: Operating controls by keyboard

- **WHEN** the visitor moves focus to a carousel control and presses Enter or Space
- **THEN** the carousel responds as it does to a pointer activation

### Requirement: The carousel responds to dragging and swiping

The carousel SHALL advance or retreat when the visitor drags horizontally with a pointer or swipes on a touch surface.

A drag SHALL change slide only once it passes a distance threshold; below the threshold the current slide SHALL settle back. A predominantly vertical gesture SHALL NOT change slide and SHALL leave page scrolling unimpeded. A drag SHALL NOT be interpreted as a click on the slide's actions.

#### Scenario: Drag past the threshold

- **WHEN** the visitor drags the active slide horizontally beyond the threshold and releases
- **THEN** the adjacent slide in the drag direction becomes active

#### Scenario: Drag below the threshold

- **WHEN** the visitor drags a short distance and releases
- **THEN** the current slide settles back into place and remains active

#### Scenario: Vertical gesture

- **WHEN** the visitor swipes vertically starting on a slide
- **THEN** the page scrolls
- **AND** the active slide does not change

#### Scenario: Drag ending over an action

- **WHEN** a drag begins on the slide image and ends over an action pill
- **THEN** the pill is not activated

### Requirement: Arrow keys navigate the focused carousel

When focus is within the carousel, the Left and Right arrow keys SHALL move to the previous and next slide respectively.

Arrow keys SHALL NOT hijack navigation when focus is outside the carousel.

#### Scenario: Arrow key within the carousel

- **WHEN** focus is inside the carousel and the Right arrow key is pressed
- **THEN** the next slide becomes active

#### Scenario: Arrow key outside the carousel

- **WHEN** focus is elsewhere on the page and an arrow key is pressed
- **THEN** the active slide does not change
- **AND** default scrolling behaviour occurs

### Requirement: Slide changes are announced and never automatic

The carousel SHALL announce the active slide's position to assistive technology when it changes, and SHALL NOT advance on its own.

#### Scenario: Announcement on change

- **WHEN** the active slide changes by any means
- **THEN** the new position is announced to assistive technology

#### Scenario: No autoplay

- **WHEN** the carousel is left untouched with the Projects section in view
- **THEN** the active slide does not change
