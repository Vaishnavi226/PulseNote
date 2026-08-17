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
