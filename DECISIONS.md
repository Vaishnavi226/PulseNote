# PulseNote — Engineering Decision Log (DECISIONS.md)

This document records all architectural, data modeling, authentication, state management, security, and performance decisions made during the development of PulseNote.

---

## DECISION-001 — Simple Monorepo Folder Structure

Date: 2026-08-17  
Phase: Phase 0 — Architecture & Planning  
Status: Accepted  

### Context
PulseNote requires a clean workspace structure that houses both the React Vite client and Express backend API without microservice complexity. The workspace must support shared TypeScript definitions, clear separation of concerns, and independent deployment to Vercel (frontend) and Render/Railway (backend).

### Decision
Adopt a simple two-directory monorepo (`client/` and `server/`) at the project root level.

### Alternatives considered
- **Option A:** Integrated Next.js full-stack framework.
- **Option B:** Multi-package TurboRepo / Nx workspace.
- **Option C:** Simple Monorepo with isolated `client/` and `server/` subdirectories.

### Why this approach
- Demonstrates clear client-server separation for full-stack engineering interview discussions.
- Avoids complex build orchestration tools (like Turborepo) that add tooling friction.
- Keeps Express API and React Vite applications isolated with dedicated `package.json` dependencies.

### Why not the alternatives
- Next.js was ruled out by the approved Tech Stack specification (Vite + React 19 + Express.js).
- TurboRepo adds unnecessary configuration overhead for a standard two-tier app.

### Libraries/dependencies affected
- None (standard Node.js / Vite folder structure).

### Files/modules affected
- `/client/*`
- `/server/*`
- `/.gitignore`
- `/.env.example`

### Consequences
- Frontend and backend can be run, tested, and deployed independently.
- Code and types are modularized per tier.

### Reversal difficulty
Low

---

## DECISION-002 — TanStack Query for Frontend Server State Management

Date: 2026-08-17  
Phase: Phase 0 — Architecture & Planning  
Status: Accepted  

### Context
PulseNote features dynamic content fetching (Articles, Challenges, Comments, Bookmarks, Pulse Scores, Dashboard Analytics) with frequent user mutations (voting, liking, bookmarking, replying). Managing caching, background refetching, and loading/error states manually via React state or Redux leads to unnecessary boilerplate.

### Decision
Use TanStack Query (React Query) v5 for server state management, paired with Axios for HTTP requests.

### Alternatives considered
- **Option A:** Redux Toolkit / RTK Query.
- **Option B:** Custom `useEffect` hooks with manual React state.
- **Option C:** TanStack Query + Axios centralized client.

### Why this approach
- TanStack Query handles caching, background refetching, optimistic updates, and loading/error states out of the box.
- Avoids global client state bloat (Redux is unnecessary since server state constitutes >90% of app data).
- Keeps local component state scoped to UI toggles (e.g. modal open, form inputs).

### Why not the alternatives
- Redux Toolkit introduces excessive boilerplate and global state overhead for server data.
- Custom `useEffect` state fetchers suffer from race conditions, duplicate fetches, and difficult cache invalidation.

### Libraries/dependencies affected
- `@tanstack/react-query`
- `axios`

### Files/modules affected
- `client/src/api/axiosClient.ts`
- `client/src/main.tsx`
- All feature hooks in `client/src/hooks/` and `client/src/features/`

### Consequences
- Server data logic is encapsulated in custom query/mutation hooks.
- Components cleanly separate UI rendering from data fetching.

### Reversal difficulty
Medium

---

## DECISION-003 — Layered Architecture for Backend (Routes → Validators → Controllers → Services → Prisma)

Date: 2026-08-17  
Phase: Phase 0 — Architecture & Planning  
Status: Accepted  

### Context
Backend business logic (Pulse Score calculation, challenge vote state management, authorization checks, article draft/publish lifecycle) must be testable, clean, and separated from Express HTTP request/response handlers.

### Decision
Implement a strict 5-tier backend architecture:
`Request → Route → Zod Validator Middleware → Controller → Service → Prisma ORM → PostgreSQL`

### Alternatives considered
- **Option A:** Fat Controllers (Business logic inside controller files).
- **Option B:** Active Record pattern inside route handlers.
- **Option C:** Layered Service Architecture with thin controllers and Zod validation.

### Why this approach
- Keeps controllers thin (HTTP parameter extraction and response formatting only).
- Places 100% of business rules (Pulse Score, authorization checks, transaction logic) in testable Service modules.
- Allows Vitest and Supertest to test services and APIs independently.

### Why not the alternatives
- Fat controllers make unit testing business logic in isolation extremely difficult and violate single-responsibility principles.
- Active Record / route-level queries leak database concerns into the HTTP routing layer.

### Libraries/dependencies affected
- `zod`
- `express`
- `@prisma/client`

### Files/modules affected
- `server/src/routes/*`
- `server/src/validators/*`
- `server/src/controllers/*`
- `server/src/services/*`
- `server/src/prisma/*`

### Consequences
- Consistent backend file structure across all domain modules.
- Business logic is completely decoupled from Express HTTP contracts.

### Reversal difficulty
Medium

---

## DECISION-004 — PostgreSQL Database Schema with Stored `pulseScore` & Unique Constraints

Date: 2026-08-17  
Phase: Phase 0 — Architecture & Planning  
Status: Accepted  

### Context
PulseNote requires relational data integrity for Users, Articles, Categories, Tags, Challenges, Challenge Votes, Comments, Likes, Bookmarks, and Analytics. Unique constraints are mandatory to prevent duplicate likes, bookmarks, and votes at the database level. Furthermore, recalculating Pulse Score (`Views + Likes*2 + Bookmarks*3 + Challenges*4 + Comments*2`) via aggregate joins on every query would impair database performance.

### Decision
Use PostgreSQL with Prisma ORM. Add a `pulseScore Int @default(0)` column to the `Article` model, recalculated and updated asynchronously inside service mutations (like, bookmark, challenge, comment). Enforce strict relational unique constraints (`@@unique([challengeId, userId])`, `@@unique([articleId, userId])`).

### Alternatives considered
- **Option A:** MongoDB with Mongoose.
- **Option B:** On-the-fly SQL aggregate queries for Pulse Score on every request.
- **Option C:** PostgreSQL with Prisma ORM + Stored `pulseScore` column + DB-level unique constraints.

### Why this approach
- Relational integrity is essential for voting (1 vote per user per challenge), likes, bookmarks, and parent-child challenge reply hierarchies.
- Storing `pulseScore` on the `Article` record enables fast database-level indexing and sorting (`ORDER BY pulseScore DESC`) without expensive runtime aggregate joins.
- Prisma generates strict TypeScript types directly from `schema.prisma`.

### Why not the alternatives
- MongoDB lacks native schema-enforced relational integrity for challenge voting constraints.
- On-the-fly SQL aggregate joins for every page view degrade under load.

### Libraries/dependencies affected
- `@prisma/client`
- `prisma` (dev dependency)

### Files/modules affected
- `server/prisma/schema.prisma`
- `server/src/services/articleService.ts`
- `server/src/services/challengeService.ts`

### Consequences
- Migrations are schema-driven via `npx prisma migrate`.
- `pulseScore` sorting is instant and lightweight.

### Reversal difficulty
High

---

## DECISION-005 — JWT Bearer Token Authentication via LocalStorage Header Interceptors

Date: 2026-08-17  
Phase: Phase 0 — Architecture & Planning  
Status: Accepted  

### Context
PulseNote requires stateless authentication for Members, Authors, Moderators, and Admins across CORS origins (Vite client on port 5173 / Vercel domain and Express server on port 5000 / Render domain).

### Decision
Implement JWT-based authentication with `bcryptjs` password hashing. Pass tokens in HTTP `Authorization: Bearer <token>` headers stored in client `localStorage`. Authentication middleware (`authenticateToken` & `requireRole`) verifies tokens server-side.

### Alternatives considered
- **Option A:** Session cookies with Redis store.
- **Option B:** Third-party auth provider (Auth0 / Clerk).
- **Option C:** Custom JWT payload passed via Authorization header with server-side middleware verification.

### Why this approach
- Direct JWT implementation demonstrates core security engineering principles for resume presentation.
- Bearer tokens avoid cross-site cookie configuration complications across separate frontend and backend deployment origins.
- Server-side middleware guarantees strict role-based access control (`USER`, `AUTHOR`, `ADMIN`) independently of frontend UI state.

### Why not the alternatives
- Redis session store adds infrastructure complexity according to the approved Tech Stack.
- Third-party auth providers obscure core authentication logic.

### Libraries/dependencies affected
- `jsonwebtoken`
- `bcryptjs`
- `@types/jsonwebtoken`, `@types/bcryptjs`

### Files/modules affected
- `server/src/middleware/authMiddleware.ts`
- `server/src/controllers/authController.ts`
- `server/src/services/authService.ts`
- `client/src/features/auth/*`

### Consequences
- Token must be injected into Axios requests via interceptors.
- Server must validate token expiration and role permissions on every protected endpoint.

### Reversal difficulty
Medium

---

## DECISION-006 — MUI Custom Theme System with PulseNote Design Tokens

Date: 2026-08-17  
Phase: Phase 0 — Architecture & Planning  
Status: Accepted  

### Context
PulseNote's visual identity is an editorial-first, modern technology publishing platform inspired by sleek, minimal design with soft pastel accents (`#F7F7F4` canvas, `#5C78B8` accent, `#F2DEA1` yellow, `#AAE2E4` cyan). Default Material UI component styling must be overridden so the app does not look like a generic MUI dashboard.

### Decision
Create a centralized Design Token structure (`client/src/theme/tokens.ts`) and create a customized MUI Theme (`client/src/theme/theme.ts`) that overrides component typography, buttons, cards, inputs, dialogs, chips, and color palettes for both Light and Dark modes.

### Alternatives considered
- **Option A:** Standard un-themed Material UI.
- **Option B:** Tailwind CSS.
- **Option C:** Customized MUI Theme backed by explicit design tokens (`tokens.ts`).

### Why this approach
- Fully respects the approved Tech Stack (MUI + Custom Theme).
- Separates raw token values (colors, spacing, typography, radii, shadows) from MUI component overrides.
- Ensures strict visual adherence to `PulseNote_Design_System_and_UI_Spec.md` (no generic MUI look).

### Why not the alternatives
- Un-themed MUI produces a generic administrative UI violating PRD Rule 6.5 and Design System spec.
- Tailwind CSS was explicitly excluded in the approved Tech Stack.

### Libraries/dependencies affected
- `@mui/material`, `@emotion/react`, `@emotion/styled`
- `@mui/icons-material`, `lucide-react`

### Files/modules affected
- `client/src/theme/tokens.ts`
- `client/src/theme/theme.ts`
- `client/src/theme/ThemeProvider.tsx`
- `client/src/main.tsx`

### Consequences
- MUI components automatically adopt PulseNote tokens (typography, border-radius, shadows, colors).
- Both Light (`#F7F7F4`) and Dark (`#0D0E10`) modes operate seamlessly.

### Reversal difficulty
Medium

---

## DECISION-007 — In-App Database Notifications vs External Email Services

Date: 2026-08-17  
Phase: Phase 0 — Architecture & Planning  
Status: Accepted  

### Context
PRD lists notifications for article likes, challenges, replies, and votes. It notes email notifications as P1 optional.

### Decision
Implement in-app notifications stored in the PostgreSQL database (`Notification` model) with unread badge counters, mark-as-read API endpoints, and direct deep-linking. Omit external SMTP / SendGrid email infrastructure for V1.

### Alternatives considered
- **Option A:** External email delivery (SendGrid / AWS SES).
- **Option B:** In-app database notifications (`Notification` entity) + REST APIs.

### Why this approach
- In-app database notifications fully satisfy PRD P0 requirements and demonstrate real-time data modeling without requiring third-party API keys or email domain verifications.
- Keeps backend focused on core publishing and discussion mechanics.

### Why not the alternatives
- External email setup adds third-party dependency complexity without contributing to core full-stack architectural evaluation.

### Libraries/dependencies affected
- None.

### Files/modules affected
- `server/prisma/schema.prisma`
- `server/src/services/notificationService.ts`
- `client/src/features/notifications/*`

### Consequences
- Notifications are fetched via TanStack Query (`GET /api/me/notifications`).

### Reversal difficulty
Low

---

## DECISION-008 — AI API Key Isolation via Server-Side Express Proxy

Date: 2026-08-17  
Phase: Phase 0 — Architecture & Planning  
Status: Accepted  

### Context
PulseNote includes AI features (AI TL;DR, Explain Simply, Key Takeaways, Challenge Assistant). AI API keys must never be exposed to the browser client.

### Decision
All AI interactions route through backend Express endpoint (`POST /api/ai/generate`). The backend encapsulates API key authentication, rate-limiting, prompt construction, and response sanitization.

### Alternatives considered
- **Option A:** Calling AI API directly from client browser code.
- **Option B:** Server-side Express AI service proxy with rate limiting and prompt sanitization.

### Why this approach
- Protects API keys from exposure in client bundle.
- Allows server to rate-limit AI usage per user/IP.
- Enables server to cache generated Quick Takes in the database.

### Why not the alternatives
- Calling AI endpoints directly from frontend exposes private API credentials and leads to security vulnerabilities.

### Libraries/dependencies affected
- `@google/genai` (or OpenAI SDK server-side)

### Files/modules affected
- `server/src/routes/aiRoutes.ts`
- `server/src/controllers/aiController.ts`
- `server/src/services/aiService.ts`

### Consequences
- AI endpoints are secure and controllable.

### Reversal difficulty
Low

---

## DECISION-009 — Phase 2 Relational Database Schema & Prisma Model Naming Standards

Date: 2026-08-19  
Phase: Phase 2 — Database + Prisma  
Status: Accepted  

### Context
PulseNote requires an explicit, type-safe relational schema linking Users, Articles, Categories, Tags, Challenges, Challenge Replies, Challenge Votes, Comments, Article Likes, Bookmarks, Notifications, Reading History, and Daily Analytics. Model names must avoid ambiguity with JavaScript reserved words.

### Decision
Define explicit Prisma models with UUID surrogate primary keys (`@id @default(uuid())`) and explicit table name mapping (`@@map("table_name")`). Standardize entity names as `ArticleBookmark` (instead of bare `Bookmark`) and `ArticleAnalyticsDaily` (instead of ambiguous `ArticleAnalytics`).

### Alternatives considered
- **Option A:** Auto-incrementing integer primary keys.
- **Option B:** Implicit table naming without `@@map`.
- **Option C:** Standardized UUID keys + explicit `@@map("table_name")` naming.

### Why this approach
- UUIDs prevent key enumeration vulnerabilities across public API routes.
- `@@map` aligns database table names with standard lower_snake_case conventions (`users`, `articles`, `challenge_votes`).
- `ArticleBookmark` clearly disambiguates article bookmarks from future user-saved items.

### Why not the alternatives
- Integer primary keys expose database sequence numbers in client URLs (`/articles/42`).
- Un-mapped table names default to PascalCase in PostgreSQL requiring double-quoted queries.

### Libraries/dependencies affected
- `@prisma/client`
- `prisma`

### Files/modules affected
- `server/prisma/schema.prisma`
- `server/src/config/prisma.ts`

### Consequences
- Typed queries generated automatically by Prisma CLI.
- Database tables map cleanly to lower_snake_case.

### Reversal difficulty
Medium

---

## DECISION-010 — Omission of Premature Entities (Polls, CommentVotes, Raw Pageviews)

Date: 2026-08-19  
Phase: Phase 2 — Database + Prisma  
Status: Accepted  

### Context
Including unneeded or post-V1 features (Polls, voting on general comments, raw click-stream logs) early in database development bloats the schema and complicates migrations.

### Decision
Omit `Poll`, `PollOption`, `PollVote`, `CommentVote`, and raw `ArticleView` click-stream tables from the Phase 2 database schema. Limit voting strictly to the **Challenge** system (`AGREE` / `DISAGREE`) and track page views via the `Article.views` counter and `ArticleAnalyticsDaily` summaries.

### Alternatives considered
- **Option A:** Include all candidate entities (Polls, CommentVotes, raw click-stream logs) in initial V1 schema.
- **Option B:** Lean core relational schema focusing strictly on Articles, Challenges, Comments, Likes, and Bookmarks.

### Why this approach
- Preserves the product focus on structured **Challenges** as the primary discussion engine.
- Prevents database storage bloat caused by logging raw row entries for every page hit.
- Keeps migration cycles clean and maintainable.

### Why not the alternatives
- General comment voting dilutes the signature differentiator of Challenge voting.
- Raw page view tables create high write contention under traffic surges without offering immediate V1 value.

### Libraries/dependencies affected
- `@prisma/client`

### Files/modules affected
- `server/prisma/schema.prisma`

### Consequences
- Database schema remains lightweight and maintainable.

### Reversal difficulty
Low

---

## DECISION-011 — Self-Referential Tree Hierarchy for Challenge Replies and Comments

Date: 2026-08-19  
Phase: Phase 2 — Database + Prisma  
Status: Accepted  

### Context
Both Challenge Replies and general Comments require threaded responses. Creating separate `ChallengeReply` vs `ChallengeReplyChild` tables creates redundant schemas.

### Decision
Use a self-referential parent key (`parentReplyId` on `ChallengeReply` and `parentCommentId` on `Comment`) with `onDelete: Cascade` to model nested discussion trees within a single table per domain.

### Alternatives considered
- **Option A:** Separate child tables for nested reply levels.
- **Option B:** Self-referential nullable parent foreign key (`parentReplyId`).

### Why this approach
- Allows flexible multi-level thread representation in a single table.
- Simplifies Prisma relations (`parentReply` / `childReplies`, `parentComment` / `childComments`).
- Ensures deleting a parent post cleanly cascade-deletes its nested thread.

### Why not the alternatives
- Separate child tables limit nesting depth arbitrarily and require duplicate CRUD services.

### Libraries/dependencies affected
- `@prisma/client`

### Files/modules affected
- `server/prisma/schema.prisma`

### Consequences
- Nested replies queried efficiently using single-table queries and relation includes.

### Reversal difficulty
Low

---

## DECISION-012 — Foreign Key Cascade & Protective Category Constraints

Date: 2026-08-19  
Phase: Phase 2 — Database + Prisma  
Status: Accepted  

### Context
Cascade deletion rules must automatically clean up user-generated content (likes, bookmarks, challenges, replies) when a parent entity is deleted, while safeguarding critical taxonomy (Categories).

### Decision
Apply `onDelete: Cascade` on all dependent user/article relationships (`ArticleTag`, `Challenge`, `Comment`, `ArticleLike`, `ArticleBookmark`, `Notification`, `ReadingHistory`). Restrict deletion on `Category` so an admin cannot accidentally delete active articles.

### Alternatives considered
- **Option A:** Soft-deletes across all entities with `deletedAt` timestamps.
- **Option B:** Hard delete with selective `onDelete: Cascade` for child interactions and `Restrict` for categories.

### Why this approach
- Guarantees database referential integrity without leaving orphaned vote/like rows.
- Protects core content when categories are managed.
- Simplifies initial V1 query logic.

### Why not the alternatives
- Blanket soft-deletes add query overhead (`WHERE deletedAt IS NULL`) to every single fetch query in the application.

### Libraries/dependencies affected
- `@prisma/client`

### Files/modules affected
- `server/prisma/schema.prisma`

### Consequences
- User/article deletion cleanly sweeps related interaction data.
- Category deletion requires explicit article re-assignment.

### Reversal difficulty
Medium

---

## DECISION-013 — Phase 2C Schema Finalization: New Enums and User Moderation Status

Date: 2026-08-19  
Phase: Phase 2C — Schema Implementation  
Status: Accepted  

### Context
The initial Phase 2 schema used bare `String` fields for `Notification.type` and `Report.status`, and had no mechanism for user-level moderation (ban/suspend). The Pre-Schema Audit identified these as type-safety gaps.

### Decision
Add three new Prisma enums and one new User field:
- `UserStatus` enum (`ACTIVE, SUSPENDED, BANNED`) on `User.status` field
- `NotificationType` enum (`LIKE, CHALLENGE, CHALLENGE_VOTE, REPLY, MENTION, MODERATION, FEATURED`) replacing `Notification.type` String
- `ReportStatus` enum (`PENDING, UNDER_REVIEW, RESOLVED, DISMISSED`) replacing `Report.status` String

### Alternatives considered
- **Option A:** Keep bare String fields and validate only in application/service layer.
- **Option B:** Use PostgreSQL CHECK constraints instead of Prisma enums.
- **Option C:** Use Prisma-native enums enforcing valid values at both database and ORM level.

### Why this approach
- Prisma enums enforce valid values at the database level — even raw SQL connections cannot insert invalid values.
- TypeScript types are auto-generated from enums, eliminating string typos in service code.
- `User.status` enables future moderation without a schema migration.

### Why not the alternatives
- Application-layer validation can be bypassed by direct database connections or future admin tools.
- CHECK constraints are not natively represented in Prisma's type system.

### Consequences
- Initial migration creates all 8 enums alongside 16 tables.
- Seed script does not need modification (seeds do not use the new enums).

### Reversal difficulty
Low (initial migration, no data to lose)

---

## DECISION-014 — Explicit onDelete: Restrict on Category Protection

Date: 2026-08-19  
Phase: Phase 2C — Schema Implementation  
Status: Accepted  

### Context
DECISION-012 established that Category deletion should be protected so admins cannot accidentally delete active articles. The Phase 1 schema had no explicit `onDelete` on the Article→Category relation, relying on PostgreSQL's default behavior for non-nullable foreign keys.

### Decision
Add explicit `onDelete: Restrict` to the Article→Category Prisma relation. This generates `ON DELETE RESTRICT` in PostgreSQL, which blocks any attempt to delete a category that still has articles referencing it.

### Why this approach
- Makes the protection intent explicit in the schema rather than relying on implicit ORM defaults.
- Documents the business rule (admin must reassign articles before deleting a category) directly in the data model.

### Reversal difficulty
Low

---

## DECISION-015 — Report→Comment Relation and CommentReports Back-Relation

Date: 2026-08-19  
Phase: Phase 2C — Schema Implementation  
Status: Accepted  

### Context
The Phase 1 schema had a `commentId` field on the Report model but no Prisma `@relation` connecting it to the Comment model. This meant:
- No referential integrity enforcement at the database level for comment-targeted reports.
- No Prisma-generated type safety for querying reports that target comments.
- Deleting a comment could leave dangling `commentId` values in reports.

### Decision
Add a `Comment? @relation("CommentReports")` on the Report model and a `reports Report[] @relation("CommentReports")` back-relation on the Comment model. This creates a proper foreign key with `onDelete: Cascade`.

### Why this approach
- Enables reports to target both Challenges and Comments with full referential integrity.
- When a comment is deleted, all reports targeting it are cascade-deleted (consistent with other moderation data cleanup).

### Reversal difficulty
Low (initial migration, no data)

---

## DECISION-016 — Composite and Strategic Indexing for Query Performance

Date: 2026-08-19  
Phase: Phase 2C — Schema Implementation  
Status: Accepted  

### Context
The Phase 1 schema had minimal indexing — only 5 non-unique indexes. The Pre-Schema Audit identified 13 missing indexes that would cause full table scans on common query patterns: author profile listings, category filtering, date sorting, moderation queues, and unread notification counts.

### Decision
Add 13 new indexes across 7 models:

| Model | New Indexes |
|---|---|
| Article | `authorId`, `categoryId`, `publishedAt` |
| Challenge | `authorId`, `status` |
| ChallengeReply | `authorId` |
| Comment | `authorId` |
| Notification | `[userId, isRead]` (composite) |
| Report | `status`, `reporterId` |
| AuditLog | `actorId`, `createdAt` |

### Why this approach
- Author profile pages query articles/challenges/comments by `authorId` — without an index, every profile view triggers a sequential scan.
- Category filtering on Explore page queries `Article.categoryId` — the most common filter operation.
- Date sorting (`ORDER BY publishedAt`) requires an index for efficient range scans.
- The composite `[userId, isRead]` index on Notification optimizes the unread count query (`WHERE userId = ? AND isRead = false`) by narrowing both conditions simultaneously.
- Moderation queue queries filter by `Report.status` — an admin-only but performance-critical query.

### Why not the alternatives
- Relying on foreign key alone (no explicit index) — PostgreSQL does not automatically index foreign keys.
- Deferring indexes to later — early indexing prevents slow queries from becoming habits.

### Reversal difficulty
Low (indexes can be dropped without data loss)

---

## DECISION-017 — Removal of Redundant @@unique on ArticleTag

Date: 2026-08-19  
Phase: Phase 2C — Schema Implementation  
Status: Accepted  

### Context
The ArticleTag model had both `@@id([articleId, tagId])` and `@@unique([articleId, tagId])`. The `@@id` composite primary key already enforces uniqueness on the combination, making the `@@unique` constraint a redundant duplicate.

### Decision
Remove `@@unique([articleId, tagId])` from ArticleTag. The `@@id([articleId, tagId])` composite primary key provides identical uniqueness enforcement.

### Why this approach
- Eliminates a redundant database index that would consume storage and slow writes without providing additional constraint value.
- Cleaner schema definition.

### Reversal difficulty
Low

---

## DECISION-018 — Generic Zod Validation Middleware for Express Request Validation

Date: 2026-08-20
Phase: Phase 3B — Backend Authentication
Status: Accepted

### Context
Phase 3 introduces registration and login endpoints requiring strict input validation (email format, password length, username format). DECISION-003 established Zod as the validation layer in the `Route → Validator → Controller → Service` pipeline, but no Zod validation middleware existed yet.

### Decision
Create a generic `validate` middleware factory (`server/src/middleware/validate.ts`) that accepts a Zod schema and validates `req.body`, `req.query`, or `req.params` against it. Validation errors are returned using the existing `AppError` class with a `VALIDATION_ERROR` code.

### Alternatives considered
- **Option A:** Validate inside each controller method (inline validation).
- **Option B:** Create per-route validation functions without Zod.
- **Option C:** Generic Zod validation middleware factory.

### Why this approach
- Reusable across all future endpoints (auth, articles, challenges, comments).
- Zod schemas are self-documenting and co-located with validators in `server/src/validators/`.
- Follows DECISION-003 pipeline without modifying the existing error handler.

### Why not the alternatives
- Inline controller validation violates the thin-controller principle.
- Custom validation functions duplicate what Zod already provides.

### Libraries/dependencies affected
- `zod` (already installed)

### Files/modules affected
- `server/src/middleware/validate.ts` (new)
- `server/src/validators/authValidators.ts` (new)

### Consequences
- All future endpoints use `validate(schema)` in the route definition before the controller.
- Validation errors are consistent with the PRD error response format.

### Reversal difficulty
Low

---

## DECISION-019 — JWT Bearer Token Authentication Middleware Architecture

Date: 2026-08-20
Phase: Phase 3B — Backend Authentication
Status: Accepted

### Context
Protected endpoints (GET /auth/me, and all future article/challenge/comment mutations) require server-side JWT verification. DECISION-005 established JWT + bcryptjs with Bearer token via Authorization header.

### Decision
Create two separate middleware functions:
1. `authenticateToken` — extracts Bearer token from Authorization header, verifies JWT signature and expiration, fetches user from DB, attaches `{ id, username, email, role, status }` to `req.user`.
2. `requireRole(...roles: Role[])` — checks `req.user.role` against an allowed roles list. Returns 403 if insufficient.

These are composed per-route: `router.get('/me', authenticateToken, controller.getMe)`.

### Alternatives considered
- **Option A:** Single combined middleware (authenticate + authorize in one function).
- **Option B:** Separate middleware composed per-route.
- **Option C:** Global middleware that authenticates every request.

### Why this approach
- Single-responsibility: authentication and authorization are distinct concerns.
- `authenticateToken` is reusable on all protected routes.
- `requireRole` is optional and composable only where needed.
- Avoids global authentication that would break public endpoints.

### Why not the alternatives
- Combined middleware cannot be selectively applied to some routes but not others.
- Global authentication adds unnecessary overhead to public endpoints and complicates error handling.

### Files/modules affected
- `server/src/middleware/authenticateToken.ts` (new)
- `server/src/middleware/requireRole.ts` (new)

### Consequences
- Every protected route explicitly includes `authenticateToken`.
- Admin/moderator routes additionally include `requireRole('ADMIN')` or `requireRole('MODERATOR', 'ADMIN')`.

### Reversal difficulty
Low

---

## DECISION-020 — Auth Service: Separate Business Logic Layer for Authentication

Date: 2026-08-20
Phase: Phase 3B — Backend Authentication
Status: Accepted

### Context
Registration, login, and user retrieval involve password hashing, JWT generation, duplicate checking, and status verification. These must live in the service layer per DECISION-003.

### Decision
Create `server/src/services/authService.ts` as a class-based singleton (matching `categoryService.ts` pattern) containing:
- `register(data)` — duplicate check, hash, create user, generate JWT
- `login(email, password)` — find user, check status, compare password, generate JWT
- `getMe(userId)` — fetch user profile by ID

### Alternatives considered
- **Option A:** Put auth logic directly in the controller.
- **Option B:** Create a standalone utility module for auth functions.
- **Option C:** Class-based service singleton matching existing patterns.

### Why this approach
- Follows the established `categoryService.ts` class singleton pattern exactly.
- Keeps controllers thin (HTTP parameter extraction + response formatting only).
- Auth business logic is testable in isolation from Express request/response.

### Files/modules affected
- `server/src/services/authService.ts` (new)

### Reversal difficulty
Low

---

## DECISION-021 — Stale JWT Handling Without Token Blocklist

Date: 2026-08-20
Phase: Phase 3B — Backend Authentication
Status: Accepted

### Context
When a user's status changes to SUSPENDED or BANNED after login, their existing JWT remains valid until expiration. The preflight architecture decided against a token blocklist (requires Redis) for V1.

### Decision
On every protected request, `authenticateToken` middleware re-fetches the user from the database and checks `user.status`. If status is not `ACTIVE`, the request is rejected with 403. This provides near-real-time enforcement without a blocklist.

### Alternatives considered
- **Option A:** Redis-based token blocklist (reject immediately).
- **Option B:** Re-fetch user status on every protected request.
- **Option C:** Embed status in JWT and never re-check (fast but stale).

### Why this approach
- One additional DB query per protected request is acceptable for a portfolio project.
- No new infrastructure (Redis) required.
- Suspended/banned users lose access within seconds of the status change.

### Why not the alternatives
- Redis adds V1 infrastructure complexity per DECISION-005.
- Embedding status in JWT means a banned user retains access until token expires (unacceptable).

### Files/modules affected
- `server/src/middleware/authenticateToken.ts`

### Consequences
- Slight performance overhead (one `findUnique` per protected request).
- Accurate, real-time authorization enforcement.

### Reversal difficulty
Low

---

## DECISION-022 — React Context for Frontend Authentication State

Date: 2026-08-20
Phase: Phase 3C — Frontend Authentication
Status: Accepted

### Context
Frontend authentication requires managing current user state, login/logout actions, and session restoration across the component tree. The app must know whether the user is authenticated to conditionally render Navbar, protect routes, and restore sessions on mount.

### Decision
Use React Context (`AuthContext`) with `useState` + `useCallback` hooks to manage authentication state. Expose `user`, `isLoading`, `isAuthenticated`, `login()`, `register()`, and `logout()` via context. Place `AuthProvider` inside `QueryClientProvider` but outside `PulseThemeProvider` and `BrowserRouter`.

### Alternatives considered
- **Option A:** Redux Toolkit with auth slice.
- **Option B:** TanStack Query for auth state management.
- **Option C:** React Context with useState/useCallback.

### Why this approach
- Matches the existing ThemeProvider pattern exactly — the project already uses React Context for theme state.
- Auth state is primarily client-owned (user object, loading flag) — not a server-state cache problem.
- Zero new dependencies required.
- Simple, readable, easy to explain in interviews.

### Why not the alternatives
- Redux adds unnecessary global state boilerplate for a single auth context.
- TanStack Query is designed for server state caching, not client-side authentication state transitions (login/logout).

### Files/modules affected
- `client/src/features/auth/AuthContext.tsx` (new)
- `client/src/features/auth/useAuth.ts` (new)
- `client/src/App.tsx` (modified — AuthProvider wrapping)

### Consequences
- All components access auth state via `useAuth()` hook.
- No prop drilling for auth state.

### Reversal difficulty
Low

---

## DECISION-023 — localStorage for JWT Token Persistence (V1)

Date: 2026-08-20
Phase: Phase 3C — Frontend Authentication
Status: Accepted

### Context
The JWT token must persist across browser sessions for a reasonable user experience. Three storage mechanisms were evaluated.

### Decision
Use `localStorage` with key `pn_auth_token`. The existing `axiosClient` request interceptor already reads from this key, and the response interceptor already removes it on 401.

### Alternatives considered
- **Option A:** localStorage (persist across sessions, vulnerable to XSS).
- **Option B:** sessionStorage (cleared on tab close, same XSS vulnerability).
- **Option C:** HttpOnly cookie (best XSS protection, requires backend rewrite).

### Why this approach
- Already implemented in `axiosClient.ts` — zero new code needed for token attachment.
- Session persistence is expected UX for a publishing platform.
- For a portfolio/resume project, the XSS trade-off is documented and acceptable.

### Why not the alternatives
- sessionStorage provides no meaningful XSS advantage over localStorage — both are accessible to injected JavaScript. The only difference is persistence, which degrades UX.
- HttpOnly cookies require backend changes (Set-Cookie headers, CSRF protection, SameSite configuration) that constitute a Phase 3B rewrite, disproportionate for V1.

### Files/modules affected
- `client/src/features/auth/authService.ts` (uses existing localStorage key)
- `client/src/api/axiosClient.ts` (unchanged — already uses pn_auth_token)

### Consequences
- Token survives browser close/reopen.
- XSS vulnerability is a documented known limitation.
- Phase 2+ can evaluate HttpOnly cookie migration if the project evolves.

### Reversal difficulty
Low

---

## DECISION-024 — Decoupled Auth-State Notification via CustomEvent (axiosClient ↔ AuthProvider)

Date: 2026-08-20
Phase: Phase 3C — Frontend Authentication
Status: Accepted

### Context
When the axios response interceptor detects a 401, it removes the token from localStorage. However, the React AuthContext's `user` state is still set. The AuthProvider must be notified to clear its state. Directly importing AuthContext into axiosClient creates a circular dependency:
`axiosClient → AuthContext → authService → axiosClient`.

### Decision
Use a browser-level `CustomEvent` mechanism. `axiosClient` emits a `pn:auth:invalid` event via `window.dispatchEvent(new CustomEvent(...))`. `AuthProvider` subscribes to this event via `window.addEventListener` in a `useEffect` and calls `setUser(null)` when received. The event utility is encapsulated in `authEvents.ts`.

### Alternatives considered
- **Option A:** Import AuthContext directly in axiosClient (creates circular dependency).
- **Option B:** Export a standalone `setAuthUser` function from AuthContext module (still tight coupling).
- **Option C:** CustomEvent via window (decoupled, zero dependencies, simple).

### Why this approach
- Zero coupling between axiosClient and AuthContext — neither imports the other.
- CustomEvent is a standard browser API, no libraries needed.
- Easy to test, debug, and document.
- AuthProvider cleanup function unsubscribes on unmount.

### Why not the alternatives
- Circular dependency breaks module resolution and makes the codebase fragile.
- Standalone setter functions still create import-order dependencies.

### Files/modules affected
- `client/src/features/auth/authEvents.ts` (new — event utility)
- `client/src/api/axiosClient.ts` (modified — imports authEvents, emits on 401)
- `client/src/features/auth/AuthContext.tsx` (modified — subscribes to event)

### Consequences
- Auth state is cleared immediately on 401, even from non-auth API calls.
- No circular imports.

### Reversal difficulty
Low

---

## DECISION-025 — Protected Route Wrapper Component

Date: 2026-08-20
Phase: Phase 3C — Frontend Authentication
Status: Accepted

### Context
Multiple routes will require authentication (write, settings, profile edit). Each route should not duplicate authentication checking logic.

### Decision
Create a reusable `ProtectedRoute` wrapper component that reads `useAuth()` state and either renders children, shows a loading state, or redirects to `/login`. Wrap protected routes in `AppRoutes.tsx` using `<ProtectedRoute>{children}</ProtectedRoute>`.

### Alternatives considered
- **Option A:** Check auth in every page component individually.
- **Option B:** Centralized route-level auth configuration object.
- **Option C:** Reusable wrapper component.

### Why this approach
- Follows React Router v7 composition patterns.
- Single source of truth for protected route logic.
- Loading state handled once, prevents authentication flash.
- Easy to extend with role-based checks later.

### Why not the alternatives
- Per-page auth checks duplicate logic and risk inconsistency.
- Configuration objects add abstraction without benefit for 2-3 protected routes.

### Files/modules affected
- `client/src/components/auth/ProtectedRoute.tsx` (new)
- `client/src/pages/AppRoutes.tsx` (modified — wraps protected routes)

### Consequences
- All protected routes use the same loading/redirect logic.

### Reversal difficulty
Low

---

## DECISION-026 — Article Delete Strategy

Date: 2026-08-20
Phase: Phase 4B — Article API

### Decision
Hard delete articles with Prisma `onDelete: Cascade` on all relations.

### Rationale
- Portfolio project — no compliance/legal requirement for soft delete
- All Article relations (ArticleTag, Comment, Vote, Bookmark, ArticleLike) use `onDelete: Cascade`
- Hard delete is simple, clean, and doesn't require status field management
- Cascade ensures no orphaned records

### Why not the alternatives
- Soft delete adds `deletedAt` column, nullable index, and WHERE clause filtering on every query
- Archive status adds enum complexity and UI state management
- Version history is overkill for a portfolio project

### Files/modules affected
- `server/prisma/schema.prisma` — already has `onDelete: Cascade` on all Article relations

### Consequences
- Deleted articles are permanently removed
- All child records (tags, comments, votes, bookmarks) are cascade-deleted

### Reversal difficulty
Medium (would need to add `deletedAt` column and migration)

---

## DECISION-027 — Slug Uniqueness Strategy

Date: 2026-08-20
Phase: Phase 4B — Article API

### Decision
Auto-generate slugs from title with retry-based suffix collision handling. Explicit slugs from create request also get collision handling.

### Rationale
- User-friendly URL structure: `/articles/my-article-title`
- Suffix approach: `my-article` → `my-article-1` → `my-article-2` (max 10 retries)
- Handles race conditions via Prisma `P2002` catch with retry
- Explicit slugs from authors also get uniqueness enforcement

### Why not the alternatives
- UUID slugs are ugly and not SEO-friendly
- Timestamp-based slugs add noise without value
- Rejecting duplicate titles is hostile UX

### Files/modules affected
- `server/src/services/articleService.ts` — `generateSlug()` and `generateUniqueSlug()` functions

### Consequences
- Slugs are unique across all articles (not scoped to author)
- Deleted article slugs become available again (hard delete)

### Reversal difficulty
Low

---

## DECISION-028 — Optional Authentication for Public Endpoints

Date: 2026-08-20
Phase: Phase 4B — Article API

### Decision
Create `optionalAuthenticateToken` middleware that attempts JWT verification but continues without `req.user` on failure.

### Rationale
- GET `/api/articles` and GET `/api/articles/:slug` must be public (no token required)
- But when an author is authenticated, they should see their own drafts
- `authenticateToken` middleware fails hard on missing/invalid token — can't be reused
- `optionalAuth` tries auth, continues without user context on any failure

### Why not the alternatives
- Separate endpoints for public/authenticated is duplication
- Modifying `authenticateToken` to be optional would break existing auth guarantees
- Query parameter for user ID is insecure

### Files/modules affected
- `server/src/middleware/optionalAuth.ts` (new)
- `server/src/routes/articleRoutes.ts` (applied to GET list and GET slug)

### Consequences
- GET endpoints work with or without token
- Visibility filtering uses `req.user` if present, defaults to public view if absent

### Reversal difficulty
Low

---

## DECISION-029 — Article API Layering Pattern

Date: 2026-08-20
Phase: Phase 4B — Article API

### Decision
Follow the same Validator → Service → Controller → Routes pattern established by the Auth feature.

### Rationale
- Consistency with existing codebase
- Separation of concerns: validation, business logic, HTTP handling, routing
- Services are testable independently of Express
- Controllers are thin — just extract params and call service

### Why not the alternatives
- Route handlers with inline logic don't scale
- Controller-only pattern mixes HTTP concerns with business logic
- Service + repository adds a layer without benefit for direct Prisma queries

### Files/modules affected
- `server/src/validators/articleValidators.ts`
- `server/src/services/articleService.ts`
- `server/src/controllers/articleController.ts`
- `server/src/routes/articleRoutes.ts`

### Consequences
- Article API follows established pattern exactly
- Easy to extend with new endpoints

### Reversal difficulty
Low

---

## DECISION-030 — Visibility Filtering at DB Level

Date: 2026-08-20
Phase: Phase 4B — Article API

### Decision
Apply article visibility filtering directly in the Prisma query via `OR` clauses, not as post-fetch filtering.

### Rationale
- Efficient: database filters before transferring data
- Correct: pagination counts are accurate (filtered at source)
- Consistent: single query returns correct data and total count
- Author visibility: `{ OR: [{ status: PUBLISHED }, { authorId: userId }] }`

### Why not the alternatives
- Post-filtering breaks pagination (total count is wrong)
- Fetching all and filtering in Node.js wastes bandwidth and memory
- Two queries (one public, one for author) add complexity

### Files/modules affected
- `server/src/services/articleService.ts` — `buildVisibilityWhere()` method

### Consequences
- Pagination is accurate for all user roles
- Query complexity is slightly higher but Prisma handles it well

### Reversal difficulty
Low

