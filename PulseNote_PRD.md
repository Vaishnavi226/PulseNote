# PulseNote — Product Requirements Document (PRD)

**Product:** PulseNote  
**Tagline:** Read. Think. Challenge.  
**Product Type:** Technology & digital-culture publishing and discussion platform  
**Document Status:** Master build specification  
**Primary Audience:** AI coding agents (Antigravity), designers, frontend/backend developers, QA  
**Version:** 1.0

---

## 1. Executive Summary

PulseNote is a modern editorial publishing platform focused on technology and digital culture. It combines long-form blogging with structured discussion around the ideas inside each article.

The core product principle is:

> **An article is the beginning of a conversation, not the end of it.**

Unlike a conventional blog where the flow is typically `Article -> Comments`, PulseNote introduces a first-class **Challenge** system. Readers can respond to the author's argument with a counterargument, supporting evidence, correction, additional context, or personal experience. Other users can then agree, disagree, or reply to that challenge.

PulseNote should feel like a premium technology publication combined with a thoughtful discussion community. It should not look like a generic Medium clone, social feed, SaaS admin panel, or AI-only product.

---

## 2. Product Vision

Build the place where technology ideas are published, read, questioned, and improved through structured discussion.

### Product promise

- Read useful technology content.
- Understand the key idea quickly.
- Challenge weak assumptions.
- Add evidence and lived experience.
- Follow discussions instead of scrolling through noise.

### Core differentiator

The **Challenge** object is a first-class product entity, not a special kind of comment. Challenges have types, votes, replies, moderation state, and their own ranking.

---

## 3. Problem Statement

Most blogging products optimize for content publication and passive consumption. Comment sections are often chronological, low-signal, and poorly connected to the argument being discussed.

PulseNote addresses this by making discussion structured and visible:

1. A writer publishes an argument.
2. Readers get a Quick Take before committing to the full article.
3. Readers can challenge the article directly.
4. Challenges can be agreed with, disagreed with, or expanded through replies.
5. High-quality disagreements become discoverable through the Challenges feed.

---

## 4. Target Audience

### 4.1 Readers
Technology-curious people who want useful articles without excessive noise.

### 4.2 Developers and technical professionals
Software developers, frontend engineers, backend engineers, DevOps engineers, security professionals, data/AI practitioners, and students.

### 4.3 Technology writers
Writers who want to publish opinions, explain technical topics, and receive meaningful discussion.

### 4.4 Career-focused technology users
People interested in engineering careers, interviews, AI impact, productivity, and the future of work.

### 4.5 Moderators / Admins
Users responsible for safety, content quality, category management, and platform health.

---

## 5. Niche and Content Pillars

Primary niche: **Technology & Digital Culture**

### Categories

1. AI
2. Development
3. Web Development
4. Startups
5. Cybersecurity
6. Design
7. Tech Careers
8. Emerging Technology
9. Digital Culture

### Example article topics

- AI Coding Agents Are Changing What Junior Developers Actually Do
- Is React Still the Right Choice for New Projects in 2026?
- Why Most AI Startups Do Not Need Their Own Model
- The Security Problem Nobody Notices in AI Agents
- Are LeetCode Interviews Still Relevant?
- Why Some SaaS Interfaces Feel Better Than Others

---

## 6. Product Principles

### 6.1 Editorial first
Content readability is more important than decorative UI.

### 6.2 Discussion with structure
Challenges should produce more signal than a generic comment wall.

### 6.3 AI as an assistant
AI helps users understand and formulate ideas but does not replace authorial voice or human discussion.

### 6.4 Quality over volume
Ranking should reward thoughtful engagement rather than raw clicks.

### 6.5 Minimal visual language
Use whitespace, strong typography, restrained color, thin borders, and subtle motion.

### 6.6 Trust and attribution
Clearly label AI-assisted content and preserve authorship metadata.

---

## 7. User Roles and Permissions

| Role | Capabilities |
|---|---|
| Guest | Browse public content, search, read articles, view challenges |
| Member | Everything above + like, bookmark, comment, challenge, reply, vote, follow authors/categories |
| Author | Member permissions + create/edit/publish articles, manage own drafts, view own analytics |
| Moderator | Moderate challenges/comments, hide reported content, review reports |
| Admin | Full platform management, users, categories, moderation, system analytics |

### Permission rules

- Guests cannot create interaction records.
- Only authenticated users can challenge, comment, like, bookmark, or vote.
- Authors can edit/delete their own unpublished content.
- Published content editing should create an audit event.
- Moderators can hide content but should not silently edit user text.
- Admins can perform global administrative actions.

---

## 8. Information Architecture

```text
PulseNote
|
|-- Home
|-- Explore
|-- Trending
|-- Challenges
|-- Article
|-- Category
|-- Search
|-- Author Profile
|-- Bookmarks
|-- Notifications
|-- Write
|-- Writer Dashboard
|-- Admin Dashboard
|-- Settings
|-- Login / Register
```

Primary navigation:

```text
PulseNote | Home | Explore | Trending | Challenges | Search | Write | Profile
```

On mobile, convert the navigation into a compact header and/or bottom navigation with the same information architecture.

---

## 9. Core User Flows

### 9.1 Guest reading flow

`Home -> Article -> Quick Take -> Read -> Challenges -> Related Article`

### 9.2 Member challenge flow

`Article -> Challenge this article -> Select challenge type -> Write challenge -> Preview -> Publish -> Challenge appears -> Users vote/reply`

### 9.3 Author publishing flow

`Write -> Editor -> Metadata -> Quick Take -> Cover -> Save Draft -> Preview -> Publish`

### 9.4 Discovery flow

`Explore -> Search/filter -> Article -> Bookmark -> Follow author/category`

### 9.5 Moderation flow

`Report -> Moderation Queue -> Review -> Hide/Restore/Reject -> Audit Log`

---

## 10. Home Page Requirements

### Hero

Primary message:

> **Ideas worth reading. Opinions worth challenging.**

Supporting copy should explain PulseNote in one sentence.

Primary CTA: `Explore Articles`  
Secondary CTA: `Start Writing`

### Content sections

1. Trending
2. Latest
3. For You
4. Most Challenged
5. Editor's Picks
6. Popular Discussions
7. Featured Categories

### Home ranking behavior

Do not make every section a simple list of newest posts. Each section must have a distinct ranking purpose.

---

## 11. Explore Page Requirements

### Filters

- Search keyword
- Category
- Tag
- Date range
- Reading time
- Sort: Latest / Popular / Most Challenged

### Result card

Each article card shows:

- Cover image
- Category
- Title
- Excerpt
- Author
- Published date
- Reading time
- Views
- Challenge count
- Like count

### URL state

Filters should map to URL query params.

Example:

`/explore?category=ai&sort=challenged&search=agents`

---

## 12. Article Page — Highest Priority Experience

The article page is the main product surface and should receive the most design attention.

### Header metadata

- Category
- Article title
- Subtitle/excerpt
- Author avatar and name
- Published date
- Updated date when applicable
- Reading time
- View count
- Bookmark
- Share

### Quick Take

Every published article should support an optional 3-7 bullet summary.

Possible sources:

- Author-written
- AI-assisted then author approved

The UI must clearly indicate when a summary is AI-assisted.

### Deep Dive

Full article body with:

- headings
- paragraphs
- lists
- quotes
- code blocks
- inline links
- images
- captions
- embeds when enabled

### Article interaction bar

- Like
- Bookmark
- Share
- Challenge this article

### Discussion section

Display:

- total challenges
- total discussions/replies
- challenge sorting
- challenge type filters
- challenge composer

---

## 13. Challenge System — Signature Feature

### Challenge definition

A Challenge is a structured response to an article's argument. It is intentionally separate from a standard comment.

### Challenge types

1. **Disagree** — directly challenges an argument.
2. **Agree** — supports the position and adds reasoning/evidence.
3. **Add Context** — expands the argument with missing context.
4. **Fact Check** — questions factual accuracy and optionally provides a source.
5. **Personal Experience** — adds first-hand experience.

### Challenge creation

Required:

- type
- body
- articleId

Optional:

- quoted passage/reference section
- source URLs

### Challenge lifecycle

`Draft -> Submitted -> Visible -> Hidden -> Deleted`

### Challenge interactions

Users can:

- agree
- disagree
- reply
- report
- share

### Challenge sorting

Supported views:

- Top
- Newest
- Most Discussed
- Most Controversial

### Challenge card

```text
Challenge Type
Author / Member
Challenge text
Sources (optional)
Agree count
Disagree count
Reply count
Timestamp
Actions
```

### Important product rule

Do not treat every comment as a challenge. Normal comments can exist under a challenge/article discussion, but only challenges receive Challenge-specific metadata and ranking.

---

## 14. Discussion Model

Hierarchy:

```text
Article
  |
  +-- Challenge
        |
        +-- Reply
        |     +-- Reply
        |
        +-- Reply
```

Limit reply nesting in UI to avoid unreadable trees. Recommended: maximum 2-3 visible nesting levels, then flatten deeper replies into a thread view.

---

## 15. Pulse Score

PulseNote requires a ranking signal that rewards discussion quality rather than only views.

### Initial formula

```text
Pulse Score =
Views
+ (Likes * 2)
+ (Bookmarks * 3)
+ (Challenges * 4)
+ (Comments * 2)
```

### Future enhancement

Use time decay so old posts do not dominate forever.

Conceptually:

```text
Adjusted Pulse Score = Raw Score * Recency Decay
```

Do not implement a black-box recommendation system in V1. Keep the scoring formula transparent and configurable.

### Most Challenged

Use challenge count and challenge velocity, not simply total challenge count.

---

## 16. AI Features

AI must support reading and writing without becoming the product's identity.

### 16.1 AI TL;DR

Input: published article  
Output: 3-7 bullets

Requirements:

- Generated only when requested or during author workflow.
- Author must approve before the summary becomes public when generated for a published article.
- Store generated result so it is not regenerated on every page view.

### 16.2 Explain Simply

Reader action:

`Explain Simply`

Input: article or selected section  
Output: beginner-friendly explanation

This should be on-demand and should not replace the original article.

### 16.3 Key Takeaways

Generate 3-5 key ideas from the article.

### 16.4 Challenge Assistant

When creating a challenge, optionally provide prompts such as:

- What assumption are you disagreeing with?
- What evidence supports your position?
- What context is missing?
- Is there a counterexample?

The AI can suggest possible angles but must not auto-publish a user's challenge.

### AI safety / trust requirements

- Never present AI-generated claims as verified facts.
- Label AI-generated or AI-assisted output.
- Never expose provider API keys in the frontend.
- Rate-limit expensive AI endpoints.
- Log generation failures, not private user prompts unless explicitly required.
- Allow AI features to be disabled through configuration.

---

## 17. Authentication and Profiles

### Authentication

- Register
- Login
- Logout
- Session persistence
- Forgot password (P1 if email service is available)
- Protected routes
- Role-based authorization

### Profile

Display:

- avatar
- display name
- bio
- role/title
- social links (optional)
- articles
- challenges
- bookmarks (private)
- activity
- stats

### Profile stats example

```text
24 Articles
186 Challenges
1.2K Likes
42K Reads
```

Stats should be calculated from real data once available, not hard-coded.

---

## 18. Writer Experience

### Editor requirements

Use a professional rich-text editor with:

- headings
- bold/italic
- links
- ordered/unordered lists
- quotes
- code blocks
- images
- captions
- inline formatting

### Article metadata

- title
- subtitle/excerpt
- category
- tags
- cover image
- SEO title
- SEO description
- slug
- quick take

### Draft workflow

- Save draft
- Auto-save
- Preview
- Publish
- Unpublish if allowed by role/policy

### Author dashboard

Top metrics:

```text
Total Views
Likes
Bookmarks
Challenges
Average Reading Time
```

Analytics:

- views over time
- engagement over time
- top articles
- challenge activity
- traffic source (if collection is implemented)
- approximate reader geography only when privacy-safe and legally appropriate

---

## 19. Notifications

Notification types:

- someone liked your article
- someone challenged your article
- someone replied to your challenge
- someone agreed/disagreed with your challenge
- your article was featured
- moderation action on your content

### Requirements

- unread count
- mark as read
- mark all as read
- deep-link to relevant content

Email notifications should be treated as P1, not required for V1 unless email infrastructure exists.

---

## 20. Search

### V1 search

Search across:

- article title
- excerpt
- article body
- tags
- author name

### Search UX

- debounced input
- result count
- highlight matched title text where practical
- empty state
- recent searches stored locally, not server-side by default

Do not introduce Elasticsearch/OpenSearch in V1.

---

## 21. Bookmarks

Users can:

- bookmark article
- remove bookmark
- view saved articles
- sort by newest saved

Private by default.

---

## 22. Likes and Voting

### Article likes

Binary like/unlike.

### Challenge votes

Challenge voting uses two signals:

- Agree
- Disagree

A user can have only one active vote state per challenge.

Changing vote must remove the previous state before applying the new one.

---

## 23. Comments

Comments are general discussion and should remain simpler than Challenges.

Features:

- create comment
- edit own comment within a policy window if desired
- delete own comment
- reply
- report
- moderation

Comments should not compete visually with Challenges. Challenges are the main discussion object.

---

## 24. Reports and Moderation

### Report reasons

- spam
- harassment
- misinformation
- hate/abuse
- copyright
- unsafe content
- other

### Moderation states

`Visible -> Reported -> Under Review -> Hidden -> Restored/Deleted`

### Admin/moderator queue

Columns:

- content type
- content preview
- author
- report reason
- reports count
- created date
- status
- actions

Every moderation action should generate an audit log entry.

---

## 25. Categories and Tags

### Categories

Admin-managed, controlled vocabulary.

### Tags

Author-selected from existing tags and/or created subject to moderation rules.

Requirements:

- unique slug
- normalized casing
- no duplicate semantic values where possible
- category page
- tag page

---

## 26. Polls

Polls are optional and should be implemented only after the core article/challenge experience is stable.

If enabled:

- single-choice initially
- one vote per user
- results visible according to poll settings
- poll closes on optional expiry

Polls must not block article publishing if omitted.

---

## 27. Notifications and Activity Feed

Activity can include:

- article published
- challenge created
- challenge voted on
- reply posted
- bookmark
- feature/editor selection

Activity pages should be paginated.

---

## 28. Database Entities

Core entities:

```text
User
Article
Category
Tag
ArticleTag
Challenge
ChallengeReply
Comment
CommentReply
ArticleLike
ArticleBookmark
ChallengeVote
Poll
PollOption
PollVote
Notification
ReadingHistory
ArticleView
ArticleAnalyticsDaily
Report
ModerationAction
AuditLog
```

### User

```text
id
name
email
passwordHash
avatarUrl
bio
role
status
createdAt
updatedAt
```

### Article

```text
id
authorId
title
slug
excerpt
content
quickTake
coverImageUrl
categoryId
status
seoTitle
seoDescription
views
publishedAt
createdAt
updatedAt
```

Status:

`DRAFT | PUBLISHED | ARCHIVED`

### Challenge

```text
id
articleId
authorId
type
body
quotedText
status
agreeCount
disagreeCount
replyCount
createdAt
updatedAt
```

### ChallengeReply

```text
id
challengeId
authorId
body
parentReplyId
status
createdAt
updatedAt
```

### ChallengeVote

```text
id
challengeId
userId
voteType
createdAt
updatedAt
```

Unique constraint:

`challengeId + userId`

### ArticleLike

```text
id
articleId
userId
createdAt
```

Unique constraint:

`articleId + userId`

### ArticleBookmark

```text
id
articleId
userId
createdAt
```

Unique constraint:

`articleId + userId`

### ReadingHistory

```text
id
userId
articleId
progressPercent
lastReadAt
```

For privacy and scale, retention rules should be configurable.

---

## 29. API Requirements

API base:

`/api`

### Auth

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### Articles

```text
GET    /articles
POST   /articles
GET    /articles/:slug
PATCH  /articles/:id
DELETE /articles/:id
POST   /articles/:id/publish
POST   /articles/:id/unpublish
```

### Challenges

```text
GET    /articles/:id/challenges
POST   /articles/:id/challenges
PATCH  /challenges/:id
DELETE /challenges/:id
POST   /challenges/:id/vote
POST   /challenges/:id/replies
```

### Comments

```text
GET    /articles/:id/comments
POST   /articles/:id/comments
PATCH  /comments/:id
DELETE /comments/:id
```

### Bookmarks

```text
POST   /articles/:id/bookmark
DELETE /articles/:id/bookmark
GET    /me/bookmarks
```

### Likes

```text
POST   /articles/:id/like
DELETE /articles/:id/like
```

### Search

```text
GET /search?q=&category=&tag=&sort=&page=&limit=
```

### Profile

```text
GET   /users/:username
PATCH /users/me
```

### Dashboard

```text
GET /me/dashboard/summary
GET /me/dashboard/articles
GET /me/dashboard/analytics
```

### Notifications

```text
GET  /me/notifications
POST /me/notifications/:id/read
POST /me/notifications/read-all
```

### Moderation

```text
GET  /admin/reports
POST /reports
POST /admin/moderation/:id/hide
POST /admin/moderation/:id/restore
POST /admin/moderation/:id/delete
```

All protected endpoints must perform server-side authorization.

---

## 30. API Response Standard

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "fields": {}
  }
}
```

Pagination meta:

```json
{
  "page": 1,
  "limit": 20,
  "total": 120,
  "totalPages": 6
}
```

---

## 31. Frontend Architecture Requirements

Recommended structure:

```text
client/
  src/
    app/
    components/
    features/
      auth/
      articles/
      challenges/
      comments/
      bookmarks/
      notifications/
      profile/
      dashboard/
    pages/
    layouts/
    hooks/
    lib/
    services/
    types/
    theme/
```

### State rules

- Server state: TanStack Query.
- Local UI state: React state/hooks.
- Form state: React Hook Form.
- Do not introduce Redux unless a clear cross-cutting client state problem appears.

### Component rules

Prefer reusable components:

- ArticleCard
- ArticleMeta
- QuickTake
- ChallengeCard
- ChallengeComposer
- ChallengeVote
- CommentThread
- BookmarkButton
- LikeButton
- ShareButton
- AuthorCard
- SearchBar
- FilterBar
- Pagination
- EmptyState
- ErrorState
- Skeleton
- Modal
- Toast

---

## 32. Visual Design Direction

### Brand

**PulseNote**  
Tagline: **Read. Think. Challenge.**

### Visual style

Minimal, editorial, modern technology publication.

Avoid:

- generic blog card grids everywhere
- excessive gradients
- glassmorphism overload
- neon cyberpunk styling
- dense dashboards as the main reader experience

### Palette

```text
Background: #F8F8F6
Primary:    #111111
Secondary:  #666666
Accent:     #6C5CE7
Border:     #E5E5E5
Dark BG:    #0D0D0F
```

### Typography

Use a strong display face for editorial headlines and a highly readable sans-serif for UI/body. Ensure fallbacks are configured.

### Layout

- generous whitespace
- large editorial headlines
- narrow reading measure for article body
- asymmetric hero compositions where useful
- thin dividers
- restrained card usage
- subtle hover and entry motion

### Responsive breakpoints

```text
Mobile:  < 768px
Tablet:  768px - 1023px
Desktop: >= 1024px
Wide:    >= 1440px
```

---

## 33. Page-by-Page UI Requirements

### Home

Hero + editorial preview area + content sections.

### Explore

Search/filter first. Results second.

### Trending

Explain the ranking context: Pulse Score, recent velocity, challenges.

### Challenges

A dedicated discovery feed of high-signal disagreements, additions, fact checks, and perspectives.

### Article

Most polished page. Prioritize reading, Quick Take, article body, and Challenge discussion.

### Write

Focused editor with metadata and publish workflow.

### Profile

Editorial identity + user contribution history.

### Dashboard

Data-heavy but visually consistent.

### Admin

Functional, not decorative.

---

## 34. Accessibility

Must meet WCAG 2.2 AA goals where practical.

Requirements:

- keyboard navigation
- visible focus states
- semantic headings
- labels for inputs
- alt text for meaningful images
- sufficient contrast
- reduced-motion support
- accessible dialogs
- error messaging associated with form fields
- buttons must have understandable accessible names

---

## 35. Performance Requirements

Targets for a production-like build:

- Fast first render on modern mobile networks.
- Lazy-load below-the-fold images.
- Use image transformation/CDN delivery.
- Paginate large lists.
- Cache server state with TanStack Query.
- Avoid loading dashboard libraries on public article pages.
- Avoid unnecessary re-renders on article/challenge interactions.

Do not optimize prematurely with complex infrastructure.

---

## 36. Security Requirements

- Passwords hashed with bcrypt or Argon2.
- JWT/session strategy implemented securely.
- HTTP-only cookies preferred for refresh/session credentials where architecture allows.
- Validate all input server-side.
- Sanitize rendered rich text to prevent XSS.
- Rate-limit authentication, challenge creation, comments, and AI endpoints.
- Protect admin routes server-side.
- Enforce ownership checks for edit/delete.
- Never expose secrets to the frontend.
- Validate uploaded image MIME type and size.
- Use signed uploads or secure upload workflow for Cloudinary.
- Apply CORS intentionally.
- Store moderation/audit events.

---

## 37. SEO Requirements

Public article pages should support:

- clean slug URLs
- dynamic title
- meta description
- canonical URL
- Open Graph metadata
- social preview image
- Article structured data where appropriate
- sitemap
- robots.txt

Only public, published articles should be indexable.

Drafts and private profile data must not be indexable.

---

## 38. Analytics Requirements

Track product events such as:

- article_view
- article_like
- article_bookmark
- challenge_created
- challenge_vote
- challenge_reply
- comment_created
- search_performed
- article_published
- article_shared

Do not collect unnecessary personal data.

---

## 39. Error, Empty and Loading States

Every async screen must have:

### Loading
Skeleton UI appropriate to the content.

### Empty
Useful explanation + next action.

Examples:

- No bookmarks yet -> Explore articles
- No challenges yet -> Be the first to challenge this idea
- No search results -> Clear filters / try another query

### Error
Human-readable error + retry action.

Avoid exposing raw backend stack traces.

---

## 40. Notifications UX

Bell icon with unread badge.

Notification list should group similar events and link directly to the relevant article/challenge.

---

## 41. V1 Scope

### P0 — Must Have

- React responsive web app
- Authentication
- Profiles
- Article CRUD
- Draft/publish workflow
- Categories and tags
- Search/filter
- Article reading experience
- Quick Take
- Challenge system
- Challenge replies
- Agree/disagree voting
- Likes
- Bookmarks
- Comments
- Basic notifications
- Writer dashboard
- Basic Pulse Score
- Moderation/reporting
- Dark mode
- SEO basics
- Cloudinary cover/image upload

### P1 — Build after P0 is stable

- AI TL;DR
- Explain Simply
- Challenge Assistant
- Polls
- Advanced analytics
- Email notifications
- Reader follows
- Editor's Picks workflow

### Out of scope for V1

- payments/subscriptions
- private messaging
- live chat
- real-time collaborative editing
- microservices
- GraphQL
- Elasticsearch/OpenSearch
- Redis caching layer
- Kubernetes
- native mobile apps
- complex recommendation ML
- creator monetization

---

## 42. Phased Implementation Plan

### Phase 1 — Foundation

- repository setup
- client/server structure
- TypeScript
- database
- Prisma
- API conventions
- theme
- routing

### Phase 2 — Authentication and Profiles

- registration/login/logout
- roles
- protected routes
- profile

### Phase 3 — Publishing

- article model
- editor
- drafts
- publishing
- categories/tags
- cover image upload

### Phase 4 — Reading Experience

- homepage
- explore
- article page
- search
- bookmarks
- likes

### Phase 5 — Challenge System

- challenge creation
- challenge types
- challenge listing
- voting
- replies
- sorting/filtering

### Phase 6 — Community

- comments
- notifications
- reports
- moderation

### Phase 7 — Analytics

- writer dashboard
- Pulse Score
- article metrics

### Phase 8 — AI

- TL;DR
- Explain Simply
- Key Takeaways
- Challenge Assistant

### Phase 9 — Polish

- accessibility
- performance
- SEO
- responsive QA
- error/empty/loading states

### Phase 10 — Testing and Deployment

- unit tests
- integration tests
- E2E tests
- production environment
- deployment
- README

---

## 43. Acceptance Criteria

### Article

- User can create and save a draft.
- User can publish an article with required metadata.
- Published article has a stable slug.
- Only authorized users can edit/delete.

### Challenge

- Authenticated user can submit a challenge.
- Challenge requires a type and body.
- Duplicate challenge votes are impossible at database level.
- Challenge can receive agree/disagree votes.
- Challenge replies are supported.
- Challenge can be reported.

### Search

- Search returns paginated results.
- Category/tag filters work together.
- URL preserves search state.

### Dashboard

- Metrics are derived from database data.
- Date-range charts do not require loading every raw event in the browser.

### Admin

- Non-admin users cannot access admin APIs.
- Moderation actions are auditable.

### AI

- AI output is labeled.
- AI endpoints are protected and rate-limited.
- API keys never reach browser code.

---

## 44. Testing Strategy

### Unit tests

Test utilities, validation, Pulse Score calculation, permission logic, and formatting functions.

### API integration tests

Test:

- auth
- article CRUD
- challenge creation
- challenge voting
- bookmarks
- comments
- moderation

### Frontend tests

Test:

- auth forms
- ArticleCard
- QuickTake
- ChallengeComposer
- ChallengeCard
- protected routes
- editor validation

### E2E flows

1. Register -> login -> create draft -> publish.
2. Open article -> bookmark -> like.
3. Open article -> create challenge -> vote -> reply.
4. Report challenge -> admin reviews -> hides content.
5. Search -> filter category -> open article.

---

## 45. Development Rules for Antigravity

The implementation agent must follow these rules.

### Rule 1 — Do not rebuild unrelated work

When adding a feature, preserve existing working modules unless a refactor is necessary.

### Rule 2 — Do not invent infrastructure

Use the approved stack. Do not add Redis, GraphQL, microservices, Kubernetes, Elasticsearch, or other infrastructure without a documented reason.

### Rule 3 — API-first data flow

Do not hard-code production-looking metrics into UI. Use typed API responses and database-backed values.

### Rule 4 — Server-side security

Frontend checks improve UX but never replace backend authorization.

### Rule 5 — Reusable components

Do not create five nearly identical cards or buttons.

### Rule 6 — Loading/empty/error states

Every API-backed experience needs all three.

### Rule 7 — Responsive by default

Do not defer mobile layout until the end.

### Rule 8 — Accessibility

Every new interactive component must be keyboard-accessible and labeled.

### Rule 9 — Document deviations

If the implementation must differ from this PRD, explain why in the development notes.

### Rule 10 — Keep V1 shippable

Prefer a smaller complete feature over a larger partially working feature.

---

## 46. Antigravity Master Instruction

Use this document as the source of truth for PulseNote.

Build PulseNote as a production-quality, responsive full-stack web application. Preserve the editorial identity and treat the Challenge system as the primary differentiating feature.

Before coding:

1. Inspect the repository.
2. Identify existing code and reuse opportunities.
3. Create a task list from the implementation phases.
4. Confirm dependencies and environment variables.
5. Implement one phase at a time.
6. Run the application after each major phase.
7. Run tests before considering a phase complete.
8. Never hide broken functionality behind mock data once the relevant backend exists.
9. Do not silently change product requirements.
10. Keep code modular, typed, secure, and maintainable.

When a requirement is ambiguous, choose the simplest implementation that preserves the stated product intent and document the decision.

The final result should feel like a polished technology publication with a discussion layer, not a generic CRUD blog.

---

## 47. Definition of Done

PulseNote is considered V1 complete when:

- A user can register and manage a profile.
- An author can create, edit, draft, preview, and publish an article.
- A reader can discover, search, read, like, bookmark, and share content.
- A reader can create a structured Challenge and other readers can agree, disagree, and reply.
- Pulse Score produces explainable ranking values.
- Authors can see meaningful analytics.
- Moderators can manage reports and content.
- AI assistance works behind secure backend endpoints where enabled.
- Pages are responsive and accessible.
- SEO metadata is correctly rendered for public articles.
- Automated tests cover critical flows.
- The application builds successfully for production.
- No real secrets are committed to source control.

---

# Final Product Definition

**PulseNote is a technology and digital-culture publishing platform where articles start conversations and readers can challenge, support, fact-check, or add context to the ideas they read.**

**Tagline:** Read. Think. Challenge.

**Core loop:**

```text
Read
  ↓
Think
  ↓
Challenge
  ↓
Discuss
  ↓
Learn
```
