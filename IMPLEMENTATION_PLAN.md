# PulseNote — Master Implementation Plan (IMPLEMENTATION_PLAN.md)

This document specifies the phase-by-phase engineering roadmap for PulseNote. Each phase outlines its objective, dependencies, frontend/backend/database changes, API contracts, testing requirements, and major decisions requiring a technical quiz.

---

## Phase 0 — Foundation & Architecture Planning

### Objective
Complete source-of-truth specification review, establish engineering documentation (`DECISIONS.md`, `FLOW.md`, `IMPLEMENTATION_PLAN.md`), resolve architectural ambiguities, and outline project phase discipline.

### Dependencies
- `PulseNote_PRD.md`
- `PulseNote_Design_System_and_UI_Spec.md`
- `PulseNote_Final_Tech_Stack.md`

### Expected Frontend Changes
- Define component structure, design token guidelines (`tokens.ts`), and routing architecture plan in documentation.

### Expected Backend Changes
- Establish 5-tier backend execution pattern (`Routes → Validators → Controllers → Services → Prisma`).

### Expected Database Changes
- Design relational schema for PostgreSQL featuring stored `pulseScore` and database-level unique constraints.

### Expected APIs
- Map base REST endpoints (`/api/auth`, `/api/articles`, `/api/challenges`, `/api/comments`, etc.).

### Expected Tests
- Validate documentation integrity and plan completeness.

### Major Decisions Likely to Require a Quiz
- Monorepo folder architecture (DECISION-001)
- TanStack Query server state strategy (DECISION-002)
- Layered backend service architecture (DECISION-003)
- Stored `pulseScore` database indexing strategy (DECISION-004)
- JWT Bearer token authentication flow (DECISION-005)

---

## Phase 1 — Project Setup

### Objective
Initialize the two-directory monorepo (`client/` and `server/`), setup TypeScript configurations, Vite React client, Express REST server, custom MUI Theme with PulseNote tokens (`tokens.ts`, `theme.ts`), and Axios API client.

### Dependencies
- Phase 0 completed.

### Expected Frontend Changes
- Initialize `client/` directory with Vite, React 19, React Router v6, TanStack Query v5, Axios, MUI, and Lucide icons.
- Create `client/src/theme/tokens.ts` (`#F7F7F4` canvas, `#5C78B8` accent, `#F2DEA1` yellow, `#AAE2E4` cyan) and `client/src/theme/theme.ts`.
- Create centralized `client/src/api/axiosClient.ts` with request/response interceptors.
- Create `client/src/pages/AppRoutes.tsx` with layout containers (`MainLayout`).

### Expected Backend Changes
- Initialize `server/` directory with Express, TypeScript, CORS, Helmet, Morgan, and JSON parser.
- Create `server/src/server.ts` entry point and global error handling middleware (`errorHandler.ts`).
- Create environment variable validation utility (`env.ts`).

### Expected Database Changes
- Initialize `server/prisma/schema.prisma` configuration file.

### Expected APIs
- Health check endpoint: `GET /api/health`.

### Expected Tests
- `server.test.ts` (Supertest GET `/api/health` returns 200 OK).
- Theme rendering test for MUI custom provider.

### Major Decisions Likely to Require a Quiz
- Custom MUI Theme override strategy vs default Material UI components.
- Centralized Axios request/response error handling interceptors.

---

## Phase 2 — Database + Prisma

### Objective
Define the complete relational database schema in Prisma, execute database migrations against PostgreSQL, configure unique constraints, and seed initial category and mock data.

### Dependencies
- Phase 1 completed.

### Expected Frontend Changes
- Export shared database TypeScript interfaces/types from `@prisma/client` or generated types for frontend consumption.

### Expected Backend Changes
- Create `server/src/config/prisma.ts` singleton client connection instance.
- Create seed script (`server/prisma/seed.ts`) populating the 9 canonical categories (`AI`, `Development`, `Web Development`, `Startups`, `Cybersecurity`, `Design`, `Tech Careers`, `Emerging Technology`, `Digital Culture`) and initial demo users/articles.

### Expected Database Changes
- Execute Prisma migration for core models:
  - `User`, `Article`, `Category`, `Tag`, `ArticleTag`, `Challenge`, `ChallengeReply`, `ChallengeVote`, `Comment`, `ArticleLike`, `ArticleBookmark`, `Notification`, `ReadingHistory`, `ArticleAnalyticsDaily`, `Report`, `ModerationAction`, `AuditLog`.
- Database-level unique constraints:
  - `@@unique([challengeId, userId])` on `ChallengeVote`
  - `@@unique([articleId, userId])` on `ArticleLike`
  - `@@unique([articleId, userId])` on `ArticleBookmark`
  - `@@unique([articleId, tagId])` on `ArticleTag`

### Expected APIs
- `GET /api/categories` (Public category list).

### Expected Tests
- Database seed script validation test.
- Prisma schema integrity tests verifying unique constraints prevent duplicate likes/votes.

### Major Decisions Likely to Require a Quiz
- Database schema structure and unique constraint enforcement for voting/likes/bookmarks.
- Primary key and relation indexing strategy for article queries.

---

## Phase 3 — Authentication

### Objective
Implement full registration, login, logout, and token verification workflow with `bcryptjs` password hashing, JWT token issuance, and server-side role authorization middleware.

### Dependencies
- Phase 2 completed.

### Expected Frontend Changes
- Create `AuthContext` and `useAuth()` hook for managing user state.
- Create `RegisterPage` and `LoginPage` components with React Hook Form + Zod schema validation.
- Inject Authorization Bearer token into `axiosClient` interceptor automatically on login.
- Implement protected route wrapper (`ProtectedRoute.tsx`) guarding member/author screens.

### Expected Backend Changes
- Create `authValidator.ts` (Zod schemas for register/login).
- Create `authMiddleware.ts` (`authenticateToken`, `requireRole(['USER', 'AUTHOR', 'ADMIN'])`).
- Create `authService.ts` (`register`, `login`, `getMe`).
- Create `authController.ts`.
- Create `authRoutes.ts`.

### Expected Database Changes
- Query and insert records into `User` model (`passwordHash` stored securely).

### Expected APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Expected Tests
- Unit test for password hashing & JWT token verification in `authService.test.ts`.
- Supertest integration tests for `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
- Component test for `LoginForm` and `RegisterForm`.

### Major Decisions Likely to Require a Quiz
- JWT Token expiration & server-side authorization enforcement (`requireRole`).
- Password security and salt round calculation.

---

## Phase 4 — Article Publishing

### Objective
Implement author article management including rich-text publishing (TipTap), draft saving, cover image uploading via Cloudinary, and category/tag associations.

### Dependencies
- Phase 3 completed.

### Expected Frontend Changes
- Build `ArticleEditor` component using TipTap rich-text editor (headings, lists, blockquotes, code blocks, images).
- Build `WritePage` / `EditArticlePage` with React Hook Form for metadata (title, subtitle, categoryId, tags, cover image upload widget).
- Create Cloudinary upload helper integration for cover images.

### Expected Backend Changes
- Create `articleValidator.ts` (Zod schema for title, body, excerpt, categoryId).
- Create `articleService.ts` (slug generation, word count / reading time calculation, CRUD operations).
- Create `articleController.ts`.
- Create `articleRoutes.ts`.
- Setup Cloudinary backend signature/upload endpoint (`POST /api/upload/image`).

### Expected Database Changes
- CRUD operations on `Article`, `Tag`, `ArticleTag` tables.

### Expected APIs
- `GET /api/articles/drafts` (Author drafts)
- `POST /api/articles` (Create draft / publish)
- `GET /api/articles/:slug` (Fetch article by slug)
- `PUT /api/articles/:id` (Update article)
- `DELETE /api/articles/:id` (Delete article)
- `POST /api/articles/:id/publish` (Publish draft)
- `POST /api/upload/image` (Cloudinary signed image upload)

### Expected Tests
- `articleService.test.ts` (Slug generation, reading time calculation).
- Supertest integration tests for Article CRUD and publishing auth guards.
- TipTap editor component render test.

### Major Decisions Likely to Require a Quiz
- Cloudinary backend-signed upload workflow vs direct client key exposure.
- Slug generation and duplicate slug handling logic.

---

## Phase 5 — Discovery / Search

### Objective
Build the reading discovery experience including Homepage (Hero, Editorial Preview, Trending, Categories, Latest Stories), Explore page with multi-filter search, and Article Reading view with Quick Take.

### Dependencies
- Phase 4 completed.

### Expected Frontend Changes
- Create `HomePage` adhering to Design System spec (Hero section with soft pastel atmosphere, interactive editorial preview, Editorial Topic Strip, Trending grid, Latest stories list, Category typography links).
- Create `ExplorePage` with search bar, category chips, tag selector, sorting dropdown (Latest, Trending, Most Challenged), and paginated results.
- Create `ArticlePage` featuring `ArticleHeader`, `QuickTake` box, `ArticleBody`, and `AuthorCard`.
- Create `SearchBar`, `FilterBar`, and `Pagination` components.

### Expected Backend Changes
- Create `searchService.ts` with PostgreSQL full-text search (`ILIKE` / title & excerpt search, filtering by category, tag, author, and sorting).
- Update `articleService.ts` to fetch published articles with pagination metadata.

### Expected Database Changes
- Query optimization and index creation on `Article.slug`, `Article.status`, `Article.categoryId`, `Article.publishedAt`.

### Expected APIs
- `GET /api/articles` (Query params: `search`, `category`, `tag`, `sort`, `page`, `limit`)
- `GET /api/search` (Search suggestions & results)

### Expected Tests
- `searchService.test.ts` (Filtering and sorting queries).
- Supertest API integration tests for paginated search results.
- Component tests for `ArticleCard`, `QuickTake`, and `FilterBar`.

### Major Decisions Likely to Require a Quiz
- PostgreSQL full-text search implementation vs external search engines.
- URL state synchronization for search and filter parameters.

---

## Phase 6 — Challenge System

### Objective
Implement PulseNote's core differentiator—the first-class Challenge System: creation of challenges by type (`AGREE`, `DISAGREE`, `ADD_CONTEXT`, `FACT_CHECK`, `PERSONAL_EXPERIENCE`), agree/disagree voting, threaded replies, and challenge sorting.

### Dependencies
- Phase 5 completed.

### Expected Frontend Changes
- Create `ChallengeComposer` modal/drawer with challenge type selectors, body input, quoted text, and source link fields.
- Create `ChallengeCard` displaying challenge type indicator pill, author, quoted passage, agree/disagree counts, and reply button.
- Create `ChallengeThread` displaying nested replies (max depth 3).
- Create `ChallengeVote` component handling optimistic agree/disagree toggles.

### Expected Backend Changes
- Create `challengeValidator.ts` (Zod schema for challenge creation and voting).
- Create `challengeService.ts` (create challenge, handle vote logic with transaction, handle replies, fetch challenge feed).
- Create `challengeController.ts`.
- Create `challengeRoutes.ts`.

### Expected Database Changes
- Insert/Update records in `Challenge`, `ChallengeReply`, `ChallengeVote` tables.
- Transactional update of `agreeCount` and `disagreeCount` on `Challenge`.
- Trigger article `pulseScore` recalculation.

### Expected APIs
- `GET /api/articles/:id/challenges` (Query params: `sort`, `type`, `page`)
- `POST /api/articles/:id/challenges` (Create challenge)
- `POST /api/challenges/:id/vote` (Agree / Disagree vote)
- `GET /api/challenges/:id/replies` (Fetch replies)
- `POST /api/challenges/:id/replies` (Create reply)

### Expected Tests
- `challengeService.test.ts` (Vote toggle logic, vote switching from AGREE to DISAGREE, reply creation).
- Supertest API integration tests for challenge creation and vote constraints.
- Component tests for `ChallengeComposer` and `ChallengeCard`.

### Major Decisions Likely to Require a Quiz
- Challenge Vote state machine (New Vote → Delete Same Vote → Toggle Opposite Vote).
- Challenge Reply nesting representation and UI caps.

---

## Phase 7 — Engagement

### Objective
Implement binary Likes, Article Bookmarks, general Article Comments, and In-App Notifications for community engagement.

### Dependencies
- Phase 6 completed.

### Expected Frontend Changes
- Create `LikeButton` and `BookmarkButton` components with optimistic UI toggles.
- Create `CommentSection` and `CommentComposer` for general non-challenge article discussion.
- Create `NotificationBell` header widget with unread counter dropdown and `NotificationsPage`.
- Create `BookmarksPage` under user profile.

### Expected Backend Changes
- Create `likeService.ts` and `bookmarkService.ts` for toggling likes/bookmarks.
- Create `commentService.ts` for general comments.
- Create `notificationService.ts` generating notifications when users like, challenge, or reply to content.
- Create `likeController.ts`, `bookmarkController.ts`, `commentController.ts`, `notificationController.ts`.

### Expected Database Changes
- Inserts/Deletions in `ArticleLike`, `ArticleBookmark`, `Comment`, `Notification`.

### Expected APIs
- `POST /api/articles/:id/like` & `DELETE /api/articles/:id/like`
- `POST /api/articles/:id/bookmark` & `DELETE /api/articles/:id/bookmark`
- `GET /api/me/bookmarks`
- `GET /api/articles/:id/comments` & `POST /api/articles/:id/comments`
- `GET /api/me/notifications` & `POST /api/me/notifications/:id/read`

### Expected Tests
- `likeService.test.ts` and `bookmarkService.test.ts`.
- Supertest API tests for likes, bookmarks, and notification generation.
- Component tests for `BookmarkButton` and `NotificationBell`.

### Major Decisions Likely to Require a Quiz
- Optimistic UI updates for likes and bookmarks with query cache rollbacks on error.
- In-app notification creation triggers inside service mutations.

---

## Phase 8 — Pulse Score + Trending

### Objective
Implement the Pulse Score calculation engine (`Views + Likes*2 + Bookmarks*3 + Challenges*4 + Comments*2`), update stored `pulseScore` values asynchronously, and power the Trending and Most Challenged feeds.

### Dependencies
- Phase 7 completed.

### Expected Frontend Changes
- Create `PulseScoreBadge` component highlighting high-engagement articles.
- Create `TrendingPage` explaining Pulse Score ranking context.
- Create `MostChallengedSection` on Homepage with numbered rank hierarchy (01, 02, 03).

### Expected Backend Changes
- Create `pulseScoreUtil.ts` containing formula calculation logic.
- Integrate automatic `pulseScore` updating inside `likeService`, `bookmarkService`, `challengeService`, and `commentService`.
- Create `trendingService.ts` fetching top-ranked articles by `pulseScore` and challenge velocity.

### Expected Database Changes
- Maintain and query `Article.pulseScore` index.

### Expected APIs
- `GET /api/articles/trending`
- `GET /api/articles/most-challenged`

### Expected Tests
- Unit test for `pulseScoreUtil.test.ts` verifying exact formula math.
- Integration test checking that adding a challenge increases an article's `pulseScore` by 4.

### Major Decisions Likely to Require a Quiz
- Stored `pulseScore` calculation triggers vs batch cron calculation.

---

## Phase 9 — Dashboard + Analytics

### Objective
Build the Writer Dashboard displaying author metrics (total views, likes, bookmarks, challenges, avg reading time) and performance visualization charts using Recharts.

### Dependencies
- Phase 8 completed.

### Expected Frontend Changes
- Create `DashboardLayout` with sidebar navigation (Overview, Articles, Challenges, Analytics).
- Create `WriterDashboardPage` featuring metric summary cards.
- Integrate `Recharts` for Views Over Time (Line chart) and Engagement Breakdown (Bar chart).
- Create `TopArticlesTable` sorting author content by views and Pulse Score.

### Expected Backend Changes
- Create `dashboardService.ts` executing aggregated Prisma queries for author stats across articles, likes, bookmarks, and challenges.
- Create `dashboardController.ts`.
- Create `dashboardRoutes.ts`.

### Expected Database Changes
- Aggregate queries over `Article`, `ArticleLike`, `ArticleBookmark`, `Challenge`.

### Expected APIs
- `GET /api/me/dashboard/summary`
- `GET /api/me/dashboard/analytics?timeframe=30d`

### Expected Tests
- `dashboardService.test.ts` verifying metrics aggregation calculations.
- Supertest API tests for author authorization on dashboard routes.
- Component test for `WriterDashboardPage` with chart mocks.

### Major Decisions Likely to Require a Quiz
- Server-side data aggregation vs client-side event processing for analytics.

---

## Phase 10 — AI Features

### Objective
Integrate AI reading and writing assistance: AI TL;DR (Quick Take generator), Explain Simply, Key Takeaways, and Challenge Assistant. Keep API keys protected on the backend server.

### Dependencies
- Phase 9 completed.

### Expected Frontend Changes
- Add "AI TL;DR" button on author `ArticleEditor` populating the Quick Take summary box with an "AI-assisted" badge.
- Add "Explain Simply" modal on `ArticlePage` providing beginner-friendly explanations.
- Add AI prompt suggestions panel inside `ChallengeComposer` assisting users in formulating counterarguments.

### Expected Backend Changes
- Create `aiService.ts` connecting to Google Gemini API / OpenAI API server-side.
- Create prompt templates for TL;DR, simplification, key takeaways, and challenge ideas.
- Create `aiController.ts` with rate-limiting middleware (`rateLimiter.ts`).
- Create `aiRoutes.ts`.

### Expected Database Changes
- Save approved AI-generated Quick Take string in `Article.quickTake`.

### Expected APIs
- `POST /api/ai/generate` (Payload: `{ action: 'tldr' | 'explain' | 'takeaways' | 'challenge_ideas', text: string }`)

### Expected Tests
- `aiService.test.ts` with mocked AI provider API calls.
- Supertest rate-limiting and authorization tests on `/api/ai/generate`.

### Major Decisions Likely to Require a Quiz
- AI API key server isolation and user rate limiting.
- Author approval workflow before publishing AI summaries.

---

## Phase 11 — Admin + Moderation

### Objective
Implement content reporting, moderator review queues, content hiding/restoration, audit logging, and category/tag management for Admins and Moderators.

### Dependencies
- Phase 10 completed.

### Expected Frontend Changes
- Create `AdminLayout` and `AdminDashboardPage`.
- Create `ModerationQueueTable` displaying reported challenges/comments with reason, report count, and action buttons (Hide, Restore, Delete).
- Create `ReportModal` allowing members to report offensive content.
- Create `CategoryManagementPage` allowing admins to create/edit categories.

### Expected Backend Changes
- Create `reportService.ts` (create report, list reported content for admin).
- Create `moderationService.ts` (hide content, update status, append `AuditLog` entry).
- Create `adminController.ts`.
- Create `adminRoutes.ts` guarded by `requireRole(['ADMIN', 'MODERATOR'])`.

### Expected Database Changes
- Insert/Update in `Report`, `ModerationAction`, `AuditLog`, `Category`, `Tag`.
- Update `status` field on `Article`, `Challenge`, `Comment` (`VISIBLE` | `HIDDEN` | `UNDER_REVIEW`).

### Expected APIs
- `POST /api/reports` (Submit report)
- `GET /api/admin/reports` (Fetch moderation queue)
- `POST /api/admin/moderation/:id/hide`
- `POST /api/admin/moderation/:id/restore`
- `POST /api/admin/categories`

### Expected Tests
- `moderationService.test.ts` verifying audit log generation.
- Supertest integration tests ensuring non-admin users receive `403 Forbidden` on admin routes.
- Component test for `ModerationQueueTable`.

### Major Decisions Likely to Require a Quiz
- Server-side role-based access control (`requireRole(['ADMIN', 'MODERATOR'])`) vs client route hiding.
- Audit logging requirements for moderation actions.

---

## Phase 12 — Testing + Security

### Objective
Conduct full system security hardening (XSS sanitization, CORS configuration, HTTP headers via Helmet, rate limiting) and comprehensive test suite verification (Unit, Component, Integration, and Playwright E2E).

### Dependencies
- Phase 11 completed.

### Expected Frontend Changes
- Sanitize HTML body rendering using `DOMPurify` / `sanitize-html` to prevent XSS.
- Accessibility audit fixes (keyboard focus, aria labels, WCAG 2.2 AA contrast compliance).

### Expected Backend Changes
- Configure strict CORS origin whitelist (`CLIENT_URL`).
- Apply rate limiters on sensitive endpoints (`/api/auth/*`, `/api/ai/*`, `/api/articles/:id/challenges`).
- Ensure no raw error stack traces are exposed in API responses.

### Expected Database Changes
- Verify database indexes on foreign keys and frequently queried fields.

### Expected APIs
- All existing endpoints hardened and validated.

### Expected Tests
- **Unit Tests (Vitest):** Utilities, validation schemas, Pulse Score calculation, permissions.
- **Component Tests (RTL):** Auth forms, ArticleCard, ChallengeComposer, ChallengeCard, NotificationBell.
- **Integration Tests (Supertest):** Auth, Article CRUD, Challenge creation/voting, Moderation.
- **E2E Tests (Playwright):**
  1. User Registration → Login → Write Article → Publish.
  2. Reader Open Article → Quick Take → Challenge Article → Agree Vote → Reply.
  3. Report Content → Admin Review → Content Hidden.

### Major Decisions Likely to Require a Quiz
- XSS prevention strategy for rich-text article body rendering.
- Comprehensive testing strategy (Unit vs Integration vs E2E boundary).

---

## Phase 13 — Deployment + Documentation

### Objective
Deploy PulseNote to production environments (Frontend on Vercel, Backend on Render/Railway, Database on Neon/Supabase), run production Prisma migrations, populate initial seed data, and finalize README documentation.

### Dependencies
- Phase 12 completed.

### Expected Frontend Changes
- Configure production build scripts (`npm run build`).
- Set `VITE_API_URL` environment variable for production Vercel deployment.

### Expected Backend Changes
- Configure production start scripts (`npm run start`).
- Setup environment variables (`PORT`, `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `CLOUDINARY_*`, `AI_API_KEY`).

### Expected Database Changes
- Run `npx prisma migrate deploy` on production PostgreSQL database.
- Execute production seed script for default categories.

### Expected APIs
- Production API deployment verification.

### Expected Tests
- Production deployment health check and E2E smoke tests against production URL.

### Major Decisions Likely to Require a Quiz
- Production environment variable management and security.
- Database migration deployment discipline (`prisma migrate deploy`).
