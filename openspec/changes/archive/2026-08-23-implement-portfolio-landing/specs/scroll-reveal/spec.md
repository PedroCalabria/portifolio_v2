## ADDED Requirements

### Requirement: Section content rises into view on first sight

Elements within each section SHALL begin offset below their resting position and fully transparent, then translate upward to their resting position while fading in when they first enter the viewport.

The animation SHALL be driven by viewport intersection rather than by a fixed timer or by scroll position polling.

#### Scenario: Scrolling a section into view

- **WHEN** a section enters the viewport for the first time
- **THEN** its content translates upward into place while fading in

#### Scenario: Section already in view at load

- **WHEN** the page loads with the Hero already within the viewport
- **THEN** the Hero content plays its entrance animation immediately

### Requirement: Each element animates exactly once

Once an element has played its entrance animation, the system SHALL stop observing it and SHALL NOT replay the animation.

Scrolling away and back SHALL leave the element at its resting position.

#### Scenario: Scrolling back to a revealed section

- **WHEN** the visitor scrolls past a section that has already animated and then scrolls back to it
- **THEN** its content is already at its resting position with no further animation

#### Scenario: Observation is released

- **WHEN** an element has completed its entrance animation
- **THEN** it is no longer observed for intersection

### Requirement: Children within a section are staggered

Where a section reveals multiple direct children, each successive child SHALL begin its animation a short, uniform interval after the previous one, producing a cascade rather than a simultaneous appearance.

#### Scenario: Staggered service rows

- **WHEN** the Services section enters the viewport
- **THEN** its eyebrow, heading, and rows begin animating in document order, each offset from the previous by the same interval

### Requirement: Content is present without JavaScript and never left hidden

The pre-animation state SHALL NOT hide content from assistive technology, from search-engine crawlers, or from a visitor whose JavaScript fails to execute.

If intersection observation is unavailable or does not run, content SHALL be visible at its resting position.

#### Scenario: JavaScript does not execute

- **WHEN** the page is rendered without client-side scripting
- **THEN** all section content is visible at its resting position

#### Scenario: Assistive technology reads unrevealed content

- **WHEN** a section has not yet entered the viewport
- **THEN** its content is still present in the accessibility tree and in the server-rendered markup

#### Scenario: Arming does not break hydration

- **WHEN** the page is loaded in development, where hydration mismatches are reported
- **THEN** no hydration mismatch is logged, even though the arming script changed the document before React hydrated
- **AND** the console is free of application errors

### Requirement: Reduced-motion preference removes the movement

When the visitor has requested reduced motion, the system SHALL render content directly at its resting position with no translation and no staggered delay.

#### Scenario: Reduced motion requested

- **WHEN** the visitor's system requests reduced motion and a section enters the viewport
- **THEN** its content appears at its resting position without translating or staggering

### Requirement: The reveal wrapper does not interfere with section behaviour

Applying the reveal to a container SHALL NOT alter its layout, and SHALL NOT conflict with transforms owned by the content inside it — in particular the Projects carousel's own slide translation.

The reveal SHALL NOT create a scroll container or clip content that overflows its bounds by design, such as the section glows.

#### Scenario: Carousel inside a revealed section

- **WHEN** the Projects section has completed its entrance animation and the visitor then drags the carousel
- **THEN** the carousel translates its slides normally
- **AND** the section does not shift or replay its animation

#### Scenario: Glow overflowing a revealed section

- **WHEN** a section whose glow extends beyond its bounds is revealed
- **THEN** the glow is not clipped by the reveal wrapper
