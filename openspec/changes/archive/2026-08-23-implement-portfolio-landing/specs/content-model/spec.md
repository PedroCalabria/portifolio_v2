## ADDED Requirements

### Requirement: Content lives in typed repository files

The system SHALL source all dynamic content — projects, experience entries, and service entries — from typed files committed to the repository, with no runtime fetch and no external content service.

Adding, reordering, or removing an entry SHALL require editing only its content file, never a component.

#### Scenario: A project is added

- **WHEN** a new project entry is appended to the projects content file
- **THEN** the carousel renders one additional slide in file order
- **AND** no component file is modified

#### Scenario: A service is reordered

- **WHEN** two service entries swap position in the content file
- **THEN** the rendered rows swap position
- **AND** the displayed ordinals remain sequential from `01`

### Requirement: Project entries carry a detail-readiness flag

A project entry SHALL declare a slug, title, subtitle, an ordered tag list, an image path, an optional live URL, and a `detailReady` boolean.

`detailReady` SHALL default to `false`, marking the project detail page as not yet built.

#### Scenario: Project without a detail page

- **WHEN** a project has `detailReady` set to `false`
- **THEN** its `GO TO PROJECT` control renders in the disabled state
- **AND** activating it does not navigate

#### Scenario: Project without a live URL

- **WHEN** a project entry omits its live URL
- **THEN** the `SEE IT IN ACTION` control is still rendered, in the disabled state
- **AND** activating it does not navigate

#### Scenario: Slug uniqueness

- **WHEN** the projects content file is loaded
- **THEN** every slug is unique across entries

### Requirement: Experience entries drive the About timeline

An experience entry SHALL declare a company, a role, a period label, and a technology list. The About timeline SHALL render one node per entry in file order.

#### Scenario: Timeline renders from content

- **WHEN** the About section is rendered with two experience entries
- **THEN** two timeline nodes appear, each with a bullet, company, role and period line, and its technology list

### Requirement: Copy is organised as a per-locale dictionary with one active locale

The system SHALL store user-facing copy in a locale-keyed dictionary and resolve it through a single accessor. Only the `en` locale SHALL be populated, and no language switcher SHALL be rendered.

The document language attribute SHALL reflect the active locale.

#### Scenario: Copy is read through the accessor

- **WHEN** a section renders a heading or body string
- **THEN** the string is read from the locale dictionary
- **AND** no user-facing English string is inlined in the component

#### Scenario: No language control is exposed

- **WHEN** the header is rendered on any viewport
- **THEN** no language switcher or locale label is present

#### Scenario: Adding a locale later

- **WHEN** a second locale file is added to the dictionary
- **THEN** the existing accessor resolves it without changes to any section component

### Requirement: Missing assets render as placeholders

Where real imagery is not yet available — the About photograph and every project image — the system SHALL render a placeholder that occupies the designed dimensions and radius, filled `#D9D9D9`.

Replacing a placeholder SHALL require only supplying the asset file at the declared path.

#### Scenario: About photo is unavailable

- **WHEN** the About section renders and no photograph asset is present
- **THEN** a `#D9D9D9` placeholder fills the framed photo area at its designed aspect ratio and `20px` radius
- **AND** the surrounding layout does not shift or collapse

#### Scenario: Project image is unavailable

- **WHEN** a carousel slide renders and its image asset is absent
- **THEN** a `#D9D9D9` placeholder fills the slide image area
- **AND** the overlaid action pills remain positioned and legible

### Requirement: Contact channels use confirmed destinations

The Contact section SHALL render exactly three channels with these destinations: WhatsApp at `+55 (81) 9 9542-1115`, e-mail at `pedsancal@gmail.com`, and LinkedIn labelled `pedrocalabria` linking to `https://www.linkedin.com/in/pedrocalabria/`.

A channel's visible label MAY differ from its destination URL.

#### Scenario: LinkedIn label and destination differ

- **WHEN** the LinkedIn channel is rendered
- **THEN** the visible label reads `pedrocalabria`
- **AND** activating it opens `https://www.linkedin.com/in/pedrocalabria/`

#### Scenario: E-mail channel activation

- **WHEN** the e-mail channel is activated
- **THEN** a mail composition target for `pedsancal@gmail.com` is opened
