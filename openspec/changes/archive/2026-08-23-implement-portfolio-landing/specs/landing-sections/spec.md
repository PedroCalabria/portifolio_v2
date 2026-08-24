## ADDED Requirements

### Requirement: Hero presents a two-tone headline and dual calls to action

The Hero SHALL render, in order: an introduction line at Urbanist 700 16px; a headline at Urbanist 700 68/72 whose leading words render in `#FFFFFF` and whose trailing words render in `#244FFF`; a supporting paragraph at Urbanist 400 20/24; and two calls to action.

The primary call to action SHALL use the primary pill variant and target the Contact section. The secondary call to action SHALL use the ghost pill variant and target the Projects section.

#### Scenario: Headline colour split

- **WHEN** the Hero headline is rendered
- **THEN** the leading segment is `#FFFFFF` and the trailing segment is `#244FFF`
- **AND** the two segments form one continuous heading element for assistive technology

#### Scenario: Primary call to action

- **WHEN** the primary Hero call to action is activated
- **THEN** the page scrolls smoothly to the Contact section

#### Scenario: Secondary call to action

- **WHEN** the secondary Hero call to action is activated
- **THEN** the page scrolls smoothly to the Projects section

### Requirement: Hero renders the designed atmospheric background

The Hero SHALL layer a linear gradient from `#060606` to transparent, a radial glow, and a noise texture behind its content.

The Figma `NOISE` effect has no CSS equivalent; the system SHALL approximate it with an inline generated texture rather than an external image asset.

None of these layers SHALL capture pointer events or appear in the accessibility tree.

#### Scenario: Background layers are decorative

- **WHEN** the Hero renders its gradient, glow, and noise layers
- **THEN** none of them is exposed to assistive technology
- **AND** clicks pass through them to the content beneath

#### Scenario: No external texture request

- **WHEN** the Hero renders
- **THEN** no network request is made for a noise or grain image

### Requirement: Hero closes with a technology strip

Below the calls to action the Hero SHALL render a gradient divider followed by a horizontal strip of technology names at Urbanist 600 20/24, rendered at reduced opacity.

The strip SHALL be presentational and contain no links.

#### Scenario: Technology strip renders

- **WHEN** the Hero is rendered
- **THEN** a gradient divider appears above a row of technology names at reduced opacity
- **AND** none of the names is interactive

### Requirement: Services renders numbered rows separated by dividers

The Services section SHALL render its eyebrow, a two-line centred heading at Urbanist 500 48/58, and one row per service entry.

Each row SHALL present a two-digit ordinal at Work Sans 400 28/33, a title at Urbanist 700 20/24, and a description at Urbanist 500 16/19. A gradient divider SHALL separate consecutive rows and close the list.

#### Scenario: Rows render from content

- **WHEN** the Services section is rendered with four service entries
- **THEN** four rows appear with ordinals `01` through `04`
- **AND** gradient dividers separate and close the list

#### Scenario: Ordinal typeface

- **WHEN** a service ordinal is rendered
- **THEN** it uses Work Sans 400 at 28px
- **AND** the adjacent title uses Urbanist 700 at 20px

### Requirement: About presents a framed photo beside biography and timeline

The About section SHALL render its eyebrow and heading, then a two-column block: a framed photograph on the left, and on the right the role label in upper case, a two-tone name heading at Urbanist 48/58 whose surname renders at weight 800, a biography paragraph, an `EXPERIENCE` heading at Urbanist 700 48/58, and the experience timeline.

The photograph frame SHALL carry a `20px` radius and a gradient border.

#### Scenario: About block renders

- **WHEN** the About section is rendered at desktop width
- **THEN** the framed photograph sits left of the role label, name heading, biography, `EXPERIENCE` heading, and timeline

#### Scenario: Name heading weights

- **WHEN** the About name heading is rendered
- **THEN** the given name renders at Urbanist 500 and the surname at Urbanist 800

### Requirement: Experience timeline marks each entry with a bullet on a connecting line

The timeline SHALL render a vertical gradient line with one `#3E65FF` bullet per experience entry. Each entry SHALL show its company at Urbanist 700 20/24, a combined role and period line at Urbanist 400 16/19, and its technology list at Urbanist 700 16/19.

#### Scenario: Timeline structure

- **WHEN** the timeline renders two entries
- **THEN** two `#3E65FF` bullets appear against a vertical gradient line
- **AND** each bullet is followed by its company, role and period line, and technology list

### Requirement: Contact presents three channels inside an outlined card

The Contact section SHALL render a card with a transparent fill, a 1px `#FFFFFF` border, and a `20px` radius, divided into two columns by a vertical gradient divider.

The left column SHALL carry a two-tone heading at Urbanist 700 68/74 whose trailing word renders in `#244FFF`, followed by a supporting line at Urbanist 400 22/26. The right column SHALL list the three contact channels, each with a 45px `#244FFF` circle containing a white icon, a channel name at Urbanist 700 22/26, and its detail at Urbanist 500 16/19.

Each channel SHALL be activatable as a whole.

#### Scenario: Card structure

- **WHEN** the Contact section is rendered at desktop width
- **THEN** an outlined card shows the heading column left of the channel column, separated by a vertical gradient divider

#### Scenario: Channel activation target

- **WHEN** the visitor activates any part of a channel row — icon, name, or detail
- **THEN** that channel's destination is opened

#### Scenario: External channels open safely

- **WHEN** a channel opens an external destination in a new context
- **THEN** the link declares `noopener`

### Requirement: Section headings form a single document outline

Each of the four sections SHALL expose its heading as a real heading element, and the section SHALL be a landmark region reachable by the corresponding nav anchor.

#### Scenario: Heading outline

- **WHEN** the page's heading structure is inspected
- **THEN** the Hero headline is the sole top-level heading
- **AND** the Services, Projects, About, and Contact headings sit one level below it without skipping levels
