# Phase 4B — Article API: Implementation Report

**Date:** 2026-08-20
**Status:** COMPLETE
**TypeScript:** Clean compile, zero errors
**Tests:** 34/34 passing

---

## Files Created (5)

| File | Purpose |
|---|---|
| `server/src/validators/articleValidators.ts` | Zod schemas for article list query, create body, update body, publish params, slug/UUID params |
| `server/src/services/articleService.ts` | Full business logic: CRUD, slug generation, visibility filtering, pagination, search, sorting, tag replacement |
| `server/src/controllers/articleController.ts` | Thin HTTP handlers: list, getBySlug, create, update, publish, delete |
| `server/src/routes/articleRoutes.ts` | Route definitions with authentication, role guards, and validation middleware |
| `server/src/middleware/optionalAuth.ts` | Optional JWT auth — sets `req.user` if valid token, continues without if missing/invalid |

## Files Modified (2)

| File | Change |
|---|---|
| `server/src/app.ts` | Added `articleRoutes` import and mount at `/api/articles` |
| `server/src/middleware/validate.ts` | Stores Zod-parsed result back onto `req[source]` (fixes coercion for query params) |

## Files Removed (1)

| File | Reason |
|---|---|
| `server/src/test-articles.ts` | Test-only file, removed after verification |

## Documentation Updated (2)

| File | Added |
|---|---|
| `DECISIONS.md` | DECISION-026 through DECISION-030 |
| `FLOW.md` | Section 13 — Phase 4B execution flows (13.1–13.7) |

---

## API Endpoints (6)

| Method | Path | Auth | Roles | Description |
|---|---|---|---|---|
| `GET` | `/api/articles` | Optional | Public | List articles (paginated, filterable, sortable) |
| `GET` | `/api/articles/:slug` | Optional | Public | Get full article by slug |
| `POST` | `/api/articles` | Required | AUTHOR, MODERATOR, ADMIN | Create new article (DRAFT) |
| `PATCH` | `/api/articles/:id` | Required | Author (own), MODERATOR, ADMIN | Update article |
| `DELETE` | `/api/articles/:id` | Required | Author (own), MODERATOR, ADMIN | Hard delete article |
| `PATCH` | `/api/articles/:id/publish` | Required | Author (own), MODERATOR, ADMIN | Toggle PUBLISHED/DRAFT status |

---

## Authorization Matrix

| Operation | Unauthenticated | MEMBER | AUTHOR | MODERATOR | ADMIN |
|---|---|---|---|---|---|
| GET list | Published only | Published only | Published + own drafts | Published + all drafts | All articles, all statuses |
| GET by slug | Published only | Published only | Published + own drafts | Published + all drafts | All articles, all statuses |
| Create | 401 | 403 | Own article (DRAFT) | Own article (DRAFT) | Own article (DRAFT) |
| Update | 401 | 403 | Own article only | Any article | Any article |
| Delete | 401 | 403 | Own article only | Any article | Any article |
| Publish | 401 | 403 | Own article only | Any article | Any article |

---

## Query Parameters (GET /api/articles)

| Param | Type | Default | Options | Description |
|---|---|---|---|---|
| `page` | number | 1 | min: 1 | Page number |
| `limit` | number | 10 | min: 1, max: 50 | Items per page |
| `sort` | string | `newest` | `newest`, `oldest`, `popular`, `pulse` | Sort order |
| `category` | string | — | Category slug | Filter by category |
| `search` | string | — | Any text | Search title + excerpt (ILIKE) |
| `tag` | string | — | Tag slug | Filter by tag |

---

## Validation Rules

### Create Article
- `title`: required, 1–200 chars
- `content`: required, min 1 char
- `categoryId`: required, valid UUID
- `excerpt`: optional, max 500 chars
- `quickTake`: optional, max 280 chars
- `coverImageUrl`: optional, valid URL
- `tagIds`: optional, array of UUIDs
- `slug`: optional, auto-generated from title if omitted

### Update Article
- All create fields optional (partial update)
- Only provided fields are updated
- Tag replacement: if `tagIds` is provided, replaces all existing tags

---

## Business Logic

### Slug Generation
1. Slugify title: lowercase, replace non-alphanumeric with hyphens, collapse multiples, trim hyphens
2. Check uniqueness in DB
3. If collision: append `-1`, `-2`, etc. until unique (max 10 retries)
4. Explicit slugs from create request also get collision handling

### Visibility Filtering
- **Public (no token)**: `{ status: PUBLISHED }`
- **Member**: `{ status: PUBLISHED }`
- **Author**: `{ OR: [{ status: PUBLISHED }, { authorId: userId }] }`
- **Moderator/Admin**: No filter (sees everything)

### Pagination Response
```json
{
  "success": true,
  "data": {
    "articles": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 19,
      "totalPages": 2
    }
  }
}
```

### Article Response (GET by slug)
Includes: author, category, tags, like count, comment count, bookmark count, challenge count

---

## Test Results (34/34)

### GET /api/articles (6 tests)
- ✅ Returns published articles (public, no auth)
- ✅ Category filter works
- ✅ Search filter works
- ✅ Sort by popular works
- ✅ Sort by pulse works
- ✅ Pagination works

### GET /api/articles/:slug (2 tests)
- ✅ Returns full article by slug (includes relations)
- ✅ Returns 404 for non-existent slug

### POST /api/articles (4 tests)
- ✅ Returns 401 without token
- ✅ Returns 403 for MEMBER role
- ✅ Creates article as AUTHOR (DRAFT status)
- ✅ Validates required fields (400)

### PATCH /api/articles/:id (3 tests)
- ✅ Updates own article
- ✅ Returns 403 when updating another author's article
- ✅ Admin can update any article

### PATCH /api/articles/:id/publish (3 tests)
- ✅ Publishes own draft (DRAFT → PUBLISHED)
- ✅ Unpublishes own article (PUBLISHED → DRAFT)
- ✅ Cannot publish another author's article (403)

### Draft Visibility (4 tests)
- ✅ Published article visible to public (by slug)
- ✅ Draft hidden from public in list
- ✅ Draft visible to author in list
- ✅ Admin sees all statuses in list

### DELETE /api/articles/:id (4 tests)
- ✅ Cannot delete without auth (401)
- ✅ Cannot delete another author's article (403)
- ✅ Author can delete own article
- ✅ Deleted article returns 404

### Backward Compatibility (2 tests)
- ✅ GET /api/categories still works
- ✅ POST /api/auth/login still works

### Slug Collision (1 test)
- ✅ Handles slug collision with suffix (-1, -2)

---

## Bugs Found & Fixed During Implementation

### 1. validate middleware discards coerced values (Critical)
**Symptom**: All GET /api/articles returned 500 — `take: "2"` (string) caused Prisma error
**Root cause**: `schema.parse(req.query)` validates but doesn't store the parsed result; `req.query` retains raw string values
**Fix**: `validate.ts` now stores `schema.parse(req[source])` back onto `req[source]`
**Impact**: Fixes all query-param validation for the entire app

### 2. Author cannot see own drafts in list (Critical)
**Symptom**: `GET /api/articles` with author token still returned only published articles
**Root cause**: GET routes didn't use `authenticateToken` middleware — `req.user` was always `undefined`
**Fix**: Created `optionalAuthenticateToken` middleware that tries auth but continues on failure; applied to GET list and GET slug routes
**Impact**: Author visibility filter now works correctly

### 3. Explicit slug collision with leftover test data (Minor)
**Symptom**: Test for explicit slug creation failed with `my-custom-slug-test-2` instead of `my-custom-slug-test`
**Root cause**: Previous test runs left articles in DB with slug `my-custom-slug-test`
**Fix**: Collision handling (suffix `-1`, `-2`) is working correctly; cleaned leftover data

---

## Decisions Documented (DECISION-026 to DECISION-030)

| Decision | Choice |
|---|---|
| 026 — Article delete strategy | Hard delete with `onDelete: Cascade` (safe, all relations cascade) |
| 027 — Slug uniqueness | Auto-generate from title with retry-based suffix collision handling |
| 028 — Optional auth for public endpoints | `optionalAuthenticateToken` middleware — no failure on missing token |
| 029 — Article API layering | Validator → Service → Controller → Routes (consistent with auth pattern) |
| 030 — Visibility filtering | DB-level filtering via `OR` clauses in Prisma query (not post-filter) |

---

## Known Limitations (V1)

1. **No article status enum validation on create** — articles always start as DRAFT, no DRAFT/PUBLISHED in create body
2. **No soft delete** — hard delete only, cascade removes all child records
3. **No version history** — updates overwrite, no revision tracking
4. **No rate limiting** — no throttling on article creation
5. **No image upload** — cover image is URL-only

---

## Next Phase

**Phase 4C — Comments & Voting API:**
- Comment CRUD with nested replies
- Upvote/downvote on articles
- Vote score aggregation
