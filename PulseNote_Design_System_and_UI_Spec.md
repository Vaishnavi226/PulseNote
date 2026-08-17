# PulseNote — Design System & UI/UX Specification

**Document type:** Master design specification for Antigravity / AI coding agent  
**Product:** PulseNote  
**Tagline:** Read. Think. Challenge.  
**Design reference:** Outcrowd — “Website Design for AI Platform” (Dribbble, Shot 26284009)  
**Status:** Implementation-ready  
**Version:** 1.0

---

## 1. Design Intent

PulseNote is a technology and digital-culture publishing platform where reading is only the beginning. The product should feel like a premium editorial publication combined with a modern technology product.

The visual direction should take inspiration from the reference design’s:

- extremely clean composition
- generous white space
- soft pastel color fields
- oversized, confident typography
- rounded interface previews
- subtle borders and shadows
- light visual hierarchy
- restrained motion
- polished product-like sections

The reference is a SaaS/AI landing page rather than a blog, so PulseNote must **translate the visual language rather than copy the page structure**. PulseNote should remain editorial-first, content-first, and discussion-first.

Reference design characteristics observed on the source page include a light neutral background, soft yellow/cyan/blue accent fields, near-black typography, rounded product UI, white-space-heavy layouts, and subtle shadows. The source describes the design as sleek, minimal, modern, with interactive sections, generous white space, subtle shadows, and a dashboard-style hero preview. citeturn466830view0turn466830image0

---

# 2. Core Design Principle

## The site must NOT look AI-generated or template-generated.

Avoid:

- generic SaaS gradients
- excessive glassmorphism
- random floating blobs everywhere
- excessive rounded cards
- identical card grids for every section
- default Tailwind/MUI visual decisions
- overuse of purple
- generic “AI startup” illustrations
- unnecessary icon decoration
- excessive animation
- stock-photo-heavy layouts
- every section having the same card treatment

The design should instead feel **art-directed**.

Every major section needs a visual reason to exist.

---

# 3. Brand Personality

PulseNote should communicate:

**Curious** — encourages readers to question ideas.

**Intelligent** — sophisticated without feeling academic.

**Editorial** — content has priority over UI chrome.

**Modern** — contemporary technology aesthetic.

**Human** — discussion and lived experience matter.

**Confident** — typography and whitespace should create authority.

Tone should be more like a modern technology publication than a social-media feed.

---

# 4. Visual Direction

## 4.1 Overall Composition

Use large canvas areas with strong spacing.

Desktop layout should feel intentionally spacious rather than densely packed.

Preferred content width:

- maximum site content width: `1320px`
- main reading content width: `760–820px`
- wide editorial sections: `1180–1240px`
- desktop horizontal padding: `40–64px`

Do not make the page edge-to-edge by default.

---

# 5. Color System

The reference palette contains neutral, pale yellow, cyan, muted blue, near-black and cool gray tones. PulseNote should adapt that palette into a stronger editorial identity. citeturn466830view0

## 5.1 Core Tokens

```css
--pn-bg: #F7F7F4;
--pn-surface: #FFFFFF;
--pn-surface-soft: #F0F2F2;
--pn-text: #0B0C0D;
--pn-text-secondary: #61666D;
--pn-text-muted: #8A9096;
--pn-border: #E4E5E3;
--pn-border-strong: #D5D7D5;

--pn-accent: #5C78B8;
--pn-accent-dark: #3F5D9D;
--pn-accent-soft: #E5ECF8;

--pn-yellow: #F2DEA1;
--pn-cyan: #AAE2E4;
--pn-blue-soft: #DDE8F0;

--pn-success: #4A876A;
--pn-warning: #B2812D;
--pn-danger: #BA5C5C;

--pn-dark-bg: #0D0E10;
--pn-dark-surface: #15171A;
--pn-dark-border: #282C30;
--pn-dark-text: #F3F3F1;
--pn-dark-muted: #A6A9AD;
```

## 5.2 Accent Usage

Do NOT use the accent color everywhere.

Accent blue should primarily identify:

- active navigation state
- primary CTA
- links
- challenge actions
- selected filters
- charts/data highlights
- focus states

Soft yellow/cyan should be used as **editorial atmospheric accents**, not button colors.

---

# 6. Typography

Typography is one of the strongest elements of the reference direction. The hero should use large, confident type with generous line height and restrained supporting text. citeturn466830image0

## 6.1 Font Recommendation

Primary UI font:

**Inter**

Editorial display font:

**DM Sans** or **Manrope**

Optional editorial serif for selected article/editorial moments:

**Newsreader**

Do not use 4–5 fonts.

Maximum:

- 1 UI sans
- 1 display/editorial font
- optional 1 serif for long-form reading only

## 6.2 Type Scale

```text
Hero Display:    72–88px
Hero Tablet:     56–68px
Hero Mobile:     42–52px

H1:              52–64px
H2:              40–48px
H3:              28–34px
H4:              22–26px

Body Large:      20px
Body:            16–18px
Body Small:      14px
Caption:         12–13px
```

Use tight tracking for large headings.

Do not make body text too small.

Minimum regular body text: `16px`.

---

# 7. Spacing System

Use an 8px base rhythm.

```text
4px
8px
12px
16px
24px
32px
40px
48px
64px
80px
96px
120px
```

Large editorial sections can use 120–160px vertical spacing where appropriate.

Do not compress sections just to fit more content above the fold.

---

# 8. Border Radius

PulseNote should use rounded shapes but not look like a generic dashboard.

```text
Small controls:       10px
Buttons:              12px
Cards:                18px
Feature panels:       24px
Hero preview:         28px
Large visual blocks:  32px
Pills:                999px
```

Do not put every text block inside a card.

---

# 9. Shadows

The reference uses subtle shadows rather than heavy elevation. citeturn466830view0

Use:

```css
--shadow-soft:
0 8px 30px rgba(20, 22, 25, 0.06);

--shadow-card:
0 18px 50px rgba(20, 22, 25, 0.08);

--shadow-floating:
0 28px 80px rgba(20, 22, 25, 0.11);
```

Avoid strong black shadows.

---

# 10. Grid

Desktop:

```text
12-column grid
24px gutters
```

Tablet:

```text
8-column grid
20px gutters
```

Mobile:

```text
4-column conceptual grid
16px side padding
```

Use editorial asymmetry where appropriate.

Not every section needs to use equal-width cards.

---

# 11. Navigation

## Desktop Header

Header should be minimal and almost weightless.

Layout:

```text
[PulseNote]

Home   Explore   Trending   Challenges

                 Search   Write   [Avatar]
```

Behavior:

- sticky only after a small scroll threshold
- transparent/light background at top
- subtle blur + solid surface while scrolling
- no oversized navbar
- no giant CTA buttons

Header height:

`72–80px`

Logo should be typographic.

Suggested wordmark:

**PulseNote**

Use a strong sans wordmark with slightly customized spacing.

---

# 12. Homepage Design

Homepage should feel like a technology publication with a premium product landing-page discipline.

Recommended order:

1. Header
2. Hero
3. Editorial intro / topic navigation
4. Trending
5. Featured challenge
6. Latest stories
7. Categories
8. Community/discussion section
9. Editor’s picks
10. Newsletter / follow section
11. Footer

---

# 13. Homepage Hero

The reference hero uses a large headline and a floating interface preview on a soft color field. PulseNote should reinterpret this as an **interactive editorial preview**, not an app dashboard. citeturn466830image0

## Hero Copy

Eyebrow:

`TECHNOLOGY • IDEAS • DEBATE`

Headline:

**Ideas worth reading. Opinions worth challenging.**

Supporting copy:

`PulseNote is where technology stories become conversations.`

Primary CTA:

`Explore the Pulse`

Secondary CTA:

`Write a Note`

## Hero Background

Use a very subtle multi-zone atmosphere:

- pale yellow glow on the left
- pale cyan field on the right
- very light blue transition

The effect should be soft and broad, not a saturated gradient.

## Hero Preview

Below the headline, place a large rounded editorial interface preview.

It can show:

```text
┌─────────────────────────────────────────────┐
│ AI & DEVELOPMENT                            │
│                                             │
│ Will AI Replace Frontend Developers?        │
│                                             │
│ Vaishnavi · 8 min read                      │
│                                             │
│ QUICK TAKE                                  │
│ • AI is automating repetitive work          │
│ • Junior roles are changing                 │
│ • Architecture still needs judgment         │
│                                             │
│             24 Challenges   87 Discussions │
└─────────────────────────────────────────────┘
```

The preview should look like a product artifact floating on the page.

---

# 14. Hero Micro-Interactions

Subtle only.

Allowed:

- preview moves `4–8px` on hover
- CTA has slight vertical lift
- metadata fades in during reveal
- challenge count animates once

Not allowed:

- spinning UI
- excessive parallax
- giant cursor-following effects
- constant motion

---

# 15. Editorial Topic Strip

Immediately after hero, add a horizontal topic navigation.

Example:

```text
AI       Development       Startups       Design
Security Careers           Future Tech    Digital Culture
```

Scrollable on mobile.

Use subtle underline/active-state behavior instead of large colored tabs.

---

# 16. Trending Section

Heading:

**What’s moving the conversation**

Supporting copy:

`Stories generating ideas, disagreement and discussion.`

Layout:

One large featured story + 3 smaller stories.

Example:

```text
┌──────────────────────────────┬───────────────┐
│                              │ Trending #2   │
│      FEATURED ARTICLE        │ Article title │
│                              │               │
│                              ├───────────────┤
│                              │ Trending #3   │
│                              │ Article title │
│                              ├───────────────┤
│                              │ Trending #4   │
│                              │ Article title │
└──────────────────────────────┴───────────────┘
```

Avoid equal cards.

The asymmetry is intentional and should make the interface feel art-directed.

---

# 17. Featured Challenge

This should be one of PulseNote's visual signature sections.

Section label:

`THE DISCUSSION`

Headline:

**The idea people are pushing back on.**

Display one challenge as an editorial quote with contextual article information.

Example:

> “AI won't eliminate junior developers. It will change what junior developers are expected to know.”

Metadata:

```text
Disagree · 42 agrees · 12 disagrees · 8 replies
```

CTA:

`Join the discussion`

Design should resemble a pull quote / editorial annotation rather than a normal social-media comment card.

---

# 18. Latest Stories

Use a vertical editorial list, not a 3x3 card grid.

Each story row:

```text
Category
Title
Excerpt
Author · Date · Reading time
Pulse Score
Challenge count
```

Optional thumbnail on desktop.

Mobile should become a clean stacked layout.

---

# 19. Category Section

Use category names as large editorial typography.

Example:

```text
Artificial Intelligence
Software Development
Cybersecurity
Startups
Design
Career
Digital Culture
```

On hover:

- text shifts slightly
- a soft accent line appears
- a small arrow appears

Avoid boxed category tiles.

---

# 20. Most Challenged Section

This is unique to PulseNote and should be visually distinct.

Heading:

**Most challenged this week**

Use a ranked editorial list:

```text
01  Will AI Replace Frontend Developers?
    24 challenges · 87 discussions

02  Is React Still the Right Choice in 2026?
    18 challenges · 61 discussions

03  The Security Problem Nobody Notices...
    15 challenges · 48 discussions
```

Large ranking numbers should create visual hierarchy.

---

# 21. Newsletter Section

Use a calm, spacious section with a subtle pastel background.

Headline:

**A smarter feed for curious people.**

Copy:

`Get the ideas people are reading, discussing and challenging this week.`

Email input + CTA.

Do not use an aggressive conversion-heavy SaaS treatment.

---

# 22. Explore Page

Explore should prioritize discovery.

Top:

```text
Explore

Search stories, topics and ideas...
```

Below:

- category filters
- tag filters
- sorting
- search results

Sort options:

```text
Latest
Trending
Most Challenged
Most Discussed
Most Saved
```

Filters should be visually light.

---

# 23. Search UI

Search should feel like a product feature, not just a form.

Desktop:

Large centered search field.

Mobile:

Full-width search field beneath header.

Show:

- article results
- matching category
- matching author
- challenge count
- highlighted matching text when useful

Debounce search input.

---

# 24. Article Page — Most Important Screen

The article page should be visually calm and reading-focused.

## Header area

```text
AI & DEVELOPMENT

Will AI Replace Frontend Developers?

A practical look at what AI changes,
what it does not, and what developers
should actually learn next.

By Vaishnavi · Aug 17, 2026 · 8 min read

[ Bookmark ] [ Share ]
```

Use a narrow reading column centered on desktop.

---

# 25. Article Reading Experience

Do not wrap the whole article inside a big card.

Instead:

- free canvas
- typography carries hierarchy
- subtle side metadata
- occasional pull quotes
- inline highlighted concepts

Content width:

`760–820px`

Paragraph width should never become excessively wide.

---

# 26. Quick Take Component

This is one of the most important product-specific blocks.

Display immediately before the full article body.

Design:

Soft tinted background with a rounded border.

Example:

```text
QUICK TAKE

• AI is automating repetitive frontend tasks
• Entry-level workflows are changing
• Product thinking remains difficult to automate
• Architecture and debugging still matter
• Junior developers need broader skills
```

AI-generated badge should be subtle.

Example:

`AI-assisted summary`

Do not make AI branding dominate the article.

---

# 27. Article Challenge CTA

After the article, present a large editorial CTA.

```text
──────────────────────────────────

THINK DIFFERENTLY?

Challenge the argument.

[ Challenge this article ]

──────────────────────────────────
```

Background can use a very subtle cyan/blue wash.

This CTA is central to PulseNote's identity.

---

# 28. Discussion Section

Heading:

**The Discussion**

Stats row:

```text
24 Challenges     87 Discussions     1.2K Reactions
```

Filters:

```text
Top
Newest
Most Controversial
```

---

# 29. Challenge Card

Challenge cards must not look like generic comments.

Structure:

```text
┌────────────────────────────────────────┐
│ DISAGREE                               │
│                                        │
│ “AI will change junior roles, but      │
│ companies still need people who can    │
│ understand product constraints...”     │
│                                        │
│ @alex · 2h                             │
│                                        │
│ Agree  42     Disagree  12             │
│ 8 replies                              │
└────────────────────────────────────────┘
```

Challenge type should have a tiny colored indicator.

Avoid using multiple bright colors.

---

# 30. Challenge Type Styling

```text
AGREE
soft green indicator

DISAGREE
soft blue indicator

ADD CONTEXT
soft yellow indicator

FACT CHECK
soft red indicator

PERSONAL EXPERIENCE
soft violet/neutral indicator
```

Use soft backgrounds only.

---

# 31. Challenge Thread

Replies appear with indentation.

Desktop:

```text
Challenge
│
├── Reply
│   └── Reply
│
└── Reply
```

Mobile:

Use a vertical connector line.

Do not over-indent deeply nested conversations.

Maximum visual nesting depth: 3.

---

# 32. Challenge Composer

When user clicks “Challenge this article”, open a focused composer.

Fields:

- challenge type
- title/short position optional
- body
- optional evidence/link

AI suggestions appear as an optional side panel on desktop.

Mobile:

AI suggestions appear below the composer, collapsible.

---

# 33. AI Challenge Assistant

Do not auto-write the user's challenge and publish it.

Instead:

```text
Explore possible angles

• What assumption could be challenged?
• What evidence might support the opposite view?
• What edge case is missing?

[Use idea]
```

The user remains the author.

This supports the product philosophy rather than replacing participation.

---

# 34. Profile Page

Profile header:

```text
Avatar

Vaishnavi Tripathi
Frontend Developer
Mumbai

24 Articles   186 Challenges   1.2K Likes   42K Reads
```

Navigation:

```text
Articles
Challenges
Bookmarks
Activity
```

The profile should feel editorial, not like a social-media profile.

---

# 35. Writer Dashboard

Dashboard is more product-like than the public site.

However, preserve the same design language.

Top metrics:

```text
Views
Likes
Bookmarks
Challenges
Avg. Reading Time
```

Analytics sections:

- views over time
- article performance
- engagement rate
- most challenged articles
- top traffic sources

Charts must remain clean and sparse.

Avoid excessive card nesting.

---

# 36. Dashboard Layout

Desktop:

```text
┌─────────────┬────────────────────────────────────────┐
│ Sidebar     │ Overview                               │
│             │                                        │
│ Overview    │ Metrics                                │
│ Articles    │ ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│ Challenges  │                                        │
│ Analytics   │ Main chart                             │
│ Profile     │                                        │
│ Settings    │ Recent articles                        │
└─────────────┴────────────────────────────────────────┘
```

Use a narrow sidebar with subtle borders.

Do not use a heavy dark admin theme unless the user activates dark mode.

---

# 37. Admin Panel

Admin can use the same system but with more dense information.

Sections:

- users
- articles
- challenges
- comments
- reports
- categories
- tags
- analytics

Moderation rows should be table-based.

Public UI = editorial.

Admin UI = operational.

---

# 38. Login / Signup

Keep auth screens simple.

Large whitespace.

Centered form.

Soft background field.

Example:

```text
Welcome to PulseNote

Read ideas. Challenge them. Add your perspective.

[ Email ]
[ Password ]

[ Continue ]

or

Continue with Google
```

Do not overdesign authentication.

---

# 39. Create Article Page

The writing experience should feel closer to an editorial workspace than a generic CMS.

Structure:

```text
← Back

Draft / Published

[Article title..............................]

[Excerpt...................................]

[Cover image]

Editor

Tags
Category

[ Save draft ]    [ Publish ]
```

The editor should have minimal distraction.

---

# 40. Editor Toolbar

Keep toolbar compact.

Support:

- paragraph
- heading
- bold
- italic
- link
- bullet list
- numbered list
- quote
- code block
- image
- divider

Avoid a toolbar packed with obscure options.

---

# 41. Dark Mode

Dark mode should feel intentional, not inverted.

Background:

`#0D0E10`

Surface:

`#15171A`

Border:

`#282C30`

Text:

`#F3F3F1`

Muted:

`#A6A9AD`

Accent:

use a slightly brighter version of Pulse blue.

Do not use pure `#000000` for every background.

---

# 42. Responsive Design

## Desktop — 1440px+

- full editorial layouts
- asymmetric grids
- floating preview panels
- sidebar metadata where appropriate

## Laptop — 1024–1439px

- reduce hero size
- preserve whitespace
- simplify complex compositions

## Tablet — 768–1023px

- collapse multi-column layouts
- reduce horizontal padding
- keep typography strong

## Mobile — <768px

- stacked layouts
- 16px side padding
- sticky mobile header
- horizontal category scroll
- challenge cards full width
- no side-by-side analytics charts
- floating hero preview becomes stacked

Never simply shrink desktop.

Recompose the layout.

---

# 43. Mobile Navigation

Mobile header:

```text
[☰] PulseNote              [Avatar]
```

Menu opens as a full-height light panel.

Primary items:

- Home
- Explore
- Trending
- Challenges
- Write

Search should be prominently available.

---

# 44. Motion System

Motion should make the site feel alive but editorial.

## Timing

```text
Fast:       160ms
Normal:     240ms
Slow:       420ms
Reveal:     600–800ms
```

## Easing

Prefer:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

## Allowed animations

- fade/slide reveal
- image scale from 0.98 → 1
- card lift 2–4px
- nav underline movement
- subtle challenge count animation
- accordion height transitions

Respect `prefers-reduced-motion`.

---

# 45. Hover Behavior

Cards should not aggressively transform.

Suggested hover:

```text
translateY(-2px)
shadow slightly increases
border becomes slightly darker
```

For article titles:

- text color may shift toward accent
- underline may animate

No huge scaling.

---

# 46. Image Direction

Use images only when they add editorial value.

Preferred:

- technology photography
- abstract technology compositions
- screenshots
- diagrams
- editorial illustrations

Avoid:

- generic business stock photography
- random AI robot art
- repeated gradient blobs
- visually noisy backgrounds

Image ratio should be consistent per component.

---

# 47. Icons

Use one icon library consistently.

Recommended:

**Lucide React**

Icons should be:

- thin
- simple
- monochrome by default
- 18–20px in normal controls

Do not use icons as decorative confetti.

---

# 48. Buttons

Primary button:

```text
background: #0B0C0D
text: #FFFFFF
radius: 12px
height: 46–52px
padding: 0 18–22px
```

Primary hover:

- slightly lighter surface
- 1–2px lift

Secondary:

white/transparent background
1px border
near-black text

Accent CTA can use Pulse blue when appropriate.

Do not make every CTA black + blue + gradient.

---

# 49. Cards

Three card categories only:

### Editorial card
Minimal border, low shadow.

### Feature panel
Rounded, elevated, larger padding.

### Product artifact
Used for hero/dashboard previews, stronger shadow and radius.

Do not create a new card style for every page.

---

# 50. Empty States

Empty states should feel editorial.

Example:

**Nothing here yet.**

`Save an idea and it will appear here.`

CTA:

`Explore stories`

Avoid cartoon illustrations.

---

# 51. Loading States

Use skeletons with very low contrast.

Avoid spinners for large sections when skeletons can be used.

Article page skeleton should preserve content geometry.

---

# 52. Error States

Use concise copy.

Example:

**We couldn't load this story.**

`Check your connection and try again.`

CTA:

`Retry`

Do not expose backend errors.

---

# 53. Accessibility

Must support:

- keyboard navigation
- visible focus states
- semantic headings
- accessible labels
- sufficient contrast
- alt text
- reduced motion
- accessible dialogs
- accessible form errors

Do not use color alone to communicate challenge type or validation state.

---

# 54. Component Architecture

Recommended frontend structure:

```text
src/
├── app/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── article/
│   ├── challenge/
│   ├── discussion/
│   ├── discovery/
│   ├── dashboard/
│   ├── analytics/
│   └── common/
├── features/
│   ├── auth/
│   ├── articles/
│   ├── challenges/
│   ├── comments/
│   ├── bookmarks/
│   ├── profile/
│   ├── analytics/
│   └── ai/
├── pages/
├── hooks/
├── services/
├── lib/
├── theme/
└── types/
```

Create reusable primitives before page-specific visual hacks.

---

# 55. Design Tokens Implementation

Create centralized design tokens.

Recommended structure:

```text
src/theme/
├── colors.ts
├── typography.ts
├── spacing.ts
├── shadows.ts
├── radii.ts
├── breakpoints.ts
└── index.ts
```

MUI theme should consume these tokens.

Do not hardcode different shades across components.

---

# 56. Design-to-Code Rules for Antigravity

These are hard constraints.

1. Do not use default MUI styling without customization.
2. Do not create generic dashboard cards everywhere.
3. Do not generate gradients randomly.
4. Do not use excessive rounded rectangles.
5. Do not center-align every section.
6. Do not make every section visually identical.
7. Do not use lorem ipsum.
8. Use realistic technology content.
9. Use real-looking article lengths, metadata and challenge counts.
10. Preserve strong editorial hierarchy.
11. Keep whitespace generous.
12. Prefer fewer, stronger UI elements.
13. Reuse design tokens.
14. Do not create page-specific colors unless justified.
15. Do not add extra features merely because they look impressive.

---

# 57. Avoiding “Vibe Coded” Appearance

The following checks are mandatory before calling any page complete:

### Visual hierarchy check

Can a user immediately tell:

- where to look first?
- what the page is about?
- what the primary action is?
- what content matters most?

### Consistency check

Do typography, spacing, border radius and controls feel like the same product?

### Density check

Is the page too crowded?

### Template check

Could this page belong to any random SaaS template?

If yes, redesign it.

### Content check

Does the interface use believable content instead of filler?

### Interaction check

Do hover/focus/loading/error states feel intentionally designed?

---

# 58. Page-by-Page Visual Acceptance Criteria

## Home

- premium first impression
- hero headline dominates
- product preview feels bespoke
- at least one asymmetric section
- clear editorial hierarchy
- no repetitive 3-column card grid

## Explore

- search is prominent
- filters feel lightweight
- article list feels editorial
- category navigation is easy to scan

## Article

- reading comfort is the priority
- Quick Take feels distinct
- challenge CTA is impossible to miss but not aggressive
- discussion feels like a separate layer of the article

## Challenge

- clearly different from comments
- challenge type is obvious
- voting is understandable
- thread hierarchy is clear

## Dashboard

- operational but visually consistent
- charts are minimal
- metrics are not oversized for decoration

---

# 59. Recommended Homepage Visual Sequence

```text
HEADER
  ↓
HERO
  Large headline
  Soft pastel atmosphere
  Floating editorial preview
  ↓
TOPIC STRIP
  ↓
TRENDING
  Large feature + supporting stories
  ↓
FEATURED CHALLENGE
  Editorial pull-quote treatment
  ↓
LATEST STORIES
  Dense editorial list
  ↓
CATEGORIES
  Large typography links
  ↓
MOST CHALLENGED
  Ranked list
  ↓
NEWSLETTER
  Soft pastel section
  ↓
FOOTER
```

---

# 60. Design Reference Translation

The reference design should influence PulseNote in the following ways:

| Reference characteristic | PulseNote implementation |
|---|---|
| Soft pastel background fields | Hero and selected editorial sections |
| Large hero typography | Main PulseNote positioning statement |
| Floating dashboard preview | Floating article/Quick Take preview |
| Generous whitespace | Article and homepage spacing |
| Rounded UI panels | Feature panels and challenge modules |
| Subtle shadows | Hero artifact and elevated components |
| Light neutral canvas | Main background |
| Structured product sections | Editorial sections with strong composition |
| Clean typography | Headlines, article titles, metadata |
| Interactive section feel | Hover, filtering, challenge interactions |

The source page itself describes its visual strategy as sleek, minimal and modern, using generous white space, subtle shadows, interactive sections, and a hero dashboard preview. citeturn466830view0

---

# 61. What NOT to Copy

Do not reproduce:

- exact text
- exact page structure
- exact illustrations
- exact dashboard content
- exact cards
- exact composition
- exact logo/branding
- exact visual assets

PulseNote needs its own editorial identity.

---

# 62. Implementation Priority

Build in this order:

### Priority 1 — Foundation

- theme
- typography
- spacing
- buttons
- header
- containers
- article primitives

### Priority 2 — Homepage

- hero
- preview artifact
- trending
- featured challenge
- latest stories

### Priority 3 — Article

- article layout
- Quick Take
- metadata
- challenge CTA
- discussion

### Priority 4 — Discovery

- Explore
- categories
- search
- trending

### Priority 5 — Writer Experience

- editor
- dashboard
- analytics

### Priority 6 — Community

- challenge composer
- voting
- replies
- bookmarks

### Priority 7 — Polish

- responsiveness
- motion
- accessibility
- loading states
- empty states
- error states
- visual QA

---

# 63. Final Antigravity Master Instruction

> Build PulseNote as a premium technology editorial platform, not as a generic blog template or generic SaaS dashboard.
>
> Use the provided PulseNote PRD as the functional source of truth and this document as the visual source of truth.
>
> The visual inspiration comes from the Outcrowd Dribbble reference: minimal layouts, generous whitespace, soft pastel atmospheric color fields, large confident typography, rounded product artifacts, subtle shadows and polished section composition. Translate those qualities into PulseNote’s editorial and discussion context rather than copying the reference.
>
> The primary public experience must feel like a premium technology publication. The article page is the core reading experience. The Challenge system is the product differentiator and must visually feel meaningfully different from ordinary comments.
>
> Do not use generic dashboard templates, random gradients, excessive glassmorphism, oversized card grids, excessive animation, or default component-library styling.
>
> Build a cohesive design system first and reuse its tokens across all pages.
>
> Every page must include intentional responsive behavior for desktop, tablet and mobile.
>
> Use realistic technology content and believable metadata. Do not use lorem ipsum.
>
> Before considering the UI complete, audit each page for visual hierarchy, whitespace, consistency, interaction states, accessibility and whether it looks intentionally designed rather than generated from a component template.

---

# 64. Definition of Design Done

PulseNote design is considered complete only when:

- the website has a recognizable visual identity
- the reference influence is visible without being derivative
- the homepage feels editorial and premium
- the article page prioritizes reading
- the Challenge experience is clearly differentiated
- typography creates strong hierarchy
- whitespace is intentional
- the UI does not rely on repetitive cards
- mobile layouts are properly recomposed
- dark mode looks designed rather than inverted
- loading/empty/error states match the design system
- all components use centralized design tokens
- no screen looks like a default AI-generated dashboard

**End of Design Specification**
