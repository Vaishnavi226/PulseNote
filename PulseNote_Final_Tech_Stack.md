# PulseNote — Final Tech Stack Specification

## 1. Purpose

PulseNote is a full-stack technology and digital-culture blogging platform where readers can read, discuss, challenge ideas, and engage with articles.

This document is the implementation source of truth for the technical stack.

The project is intended primarily as a **resume and portfolio project**, so the architecture should demonstrate real-world engineering skills without adding unnecessary infrastructure.

---

# 2. Final Stack

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- MUI
- TanStack Query
- Axios
- React Hook Form
- Zod
- TipTap
- Recharts

## Backend

- Node.js
- Express.js
- TypeScript
- REST API

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT
- bcrypt

## File Storage

- Cloudinary

## Testing

- Vitest
- React Testing Library
- Supertest
- Playwright

## Deployment

- Vercel — frontend
- Render or Railway — backend
- Neon/Supabase PostgreSQL — database

## Version Control

- Git
- GitHub

---

# 3. Architecture

Use a simple monorepo:

```text
pulsenote/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── api/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── theme/
│   │   ├── features/
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── config/
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── README.md
├── .gitignore
└── .env.example
```

Do not create a microservice architecture.

---

# 4. Why These Technologies

## React

Use React for the complete frontend because PulseNote has many reusable interactive areas:

- article cards
- challenge threads
- comments
- dashboards
- forms
- filters
- profile pages

## TypeScript

Use TypeScript throughout the frontend and backend.

It should be used for:

- API response types
- form data
- component props
- database-related service types
- reusable utility functions

Avoid `any` unless there is a justified edge case.

## Vite

Use Vite for a fast React development environment and straightforward production build.

## React Router

Use React Router for:

- home
- explore
- trending
- article pages
- category pages
- profile
- dashboard
- admin
- auth pages

## MUI

Use MUI for the component foundation, but customize it heavily using the PulseNote design system.

Do NOT ship a default MUI-looking application.

Create a custom theme for:

- typography
- spacing
- borders
- buttons
- inputs
- cards
- dialogs
- tabs
- chips

## TanStack Query

Use TanStack Query for server state.

Use it for:

- article fetching
- challenges
- comments
- likes
- bookmarks
- notifications
- dashboard analytics

Do not create a large custom global state system just to store API data.

## Axios

Use Axios for API communication.

Create a centralized Axios instance with:

- base URL
- auth headers/interceptors
- common error handling

## React Hook Form + Zod

Use React Hook Form for forms.

Use Zod for validation.

Important forms include:

- register
- login
- write article
- edit article
- challenge
- comment
- profile
- category management

## TipTap

Use TipTap for the article editor.

Support:

- headings
- paragraphs
- bold
- italic
- links
- bullet lists
- numbered lists
- blockquotes
- code blocks
- images

Keep the editor focused and clean.

Do not turn it into an overly complex Notion clone.

## Recharts

Use Recharts for writer analytics:

- views over time
- likes
- bookmarks
- challenge activity
- top articles

---

# 5. Backend Architecture

Use:

```text
React
   ↓
TanStack Query
   ↓
Axios
   ↓
Express REST API
   ↓
Controllers
   ↓
Services
   ↓
Prisma
   ↓
PostgreSQL
```

Keep controllers thin.

Example:

```text
Request
  ↓
Route
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
Database
```

Business logic should live in services rather than inside route files.

---

# 6. REST API

Use REST rather than GraphQL.

Example endpoints:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/articles
GET    /api/articles/:slug
POST   /api/articles
PUT    /api/articles/:id
DELETE /api/articles/:id

GET    /api/challenges/article/:articleId
POST   /api/challenges
PUT    /api/challenges/:id
DELETE /api/challenges/:id

POST   /api/challenges/:id/vote
POST   /api/articles/:id/like
POST   /api/articles/:id/bookmark

GET    /api/comments/article/:articleId
POST   /api/comments
DELETE /api/comments/:id

GET    /api/dashboard
GET    /api/notifications
GET    /api/users/:username
```

All protected endpoints must validate authentication on the server.

---

# 7. Database

Use PostgreSQL with Prisma.

Core models:

```text
User
Article
Category
Tag
ArticleTag
Challenge
ChallengeReply
ChallengeVote
Comment
CommentVote
ArticleLike
Bookmark
Notification
ReadingHistory
ArticleAnalytics
Poll
PollOption
PollVote
```

Do not create tables just because a feature might be useful later.

Build only models required for the current product scope.

---

# 8. Authentication

Use:

- JWT
- bcrypt

Authentication requirements:

- registration
- login
- logout
- current-user endpoint
- protected routes
- role-based access

Roles:

```text
USER
AUTHOR
ADMIN
```

Keep authorization on the backend.

Frontend role checks are only for UI visibility.

Never treat frontend role checks as security.

Passwords must never be stored in plain text.

---

# 9. Image Upload

Use Cloudinary for:

- profile avatars
- article cover images
- article body images

The client should upload through a safe backend-controlled flow or signed upload strategy.

Never expose private Cloudinary secrets in client code.

Validate:

- file type
- file size

---

# 10. PulseNote-Specific Technical Features

## Challenge System

Challenges are NOT comments.

A Challenge is a first-class content entity linked to an Article.

Challenge types:

```text
AGREE
DISAGREE
ADD_CONTEXT
FACT_CHECK
PERSONAL_EXPERIENCE
```

Each challenge can have:

- author
- article
- type
- content
- votes
- replies
- timestamp
- moderation status

This distinction is important for the product.

---

# 11. Pulse Score

Implement a server-side ranking score.

Initial formula:

```text
Pulse Score =
Views
+ (Likes × 2)
+ (Bookmarks × 3)
+ (Challenges × 4)
+ (Comments × 2)
```

This score should be stored or efficiently calculated depending on implementation.

Use it for:

- Trending
- Most Challenged
- discovery ranking

Do not rely only on total views.

---

# 12. Search

For V1, use PostgreSQL search capabilities rather than adding Elasticsearch.

Support:

- title search
- article content search
- category filter
- tag filter
- author filter
- sorting

Add pagination.

Keep search implementation simple enough to maintain.

---

# 13. AI Features

AI must remain a supporting feature, not the core architecture.

Recommended V1/P1 AI features:

### AI TL;DR
Generate a short article summary.

### Explain Simply
Rewrite/explain article content at a beginner-friendly level.

### Key Takeaways
Extract important points.

### Challenge Assistant
Suggest possible angles or counterarguments.

Important rule:

AI suggestions should never automatically publish content on behalf of users.

The user controls the final text.

AI API keys must stay server-side.

---

# 14. Analytics

Writer dashboard should show:

- total views
- likes
- bookmarks
- challenges
- comments
- average reading time
- top articles

Use Recharts on the frontend.

The backend should expose aggregated analytics instead of sending raw event data unnecessarily.

For a resume project, keep analytics at application level.

Do not build a full-scale event streaming system.

---

# 15. Caching and State

Use TanStack Query for:

- API caching
- stale-time management
- refetching
- mutations

Do not add Redis for V1.

Do not add Redux unless a clear global client-state requirement appears.

Prefer local component state + TanStack Query.

---

# 16. Security Requirements

Implement:

- password hashing
- JWT verification
- authorization middleware
- request validation
- sanitized article HTML/content rendering
- safe image upload validation
- CORS configuration
- secure environment variables
- rate limiting on sensitive endpoints
- consistent error responses

Prevent:

- XSS
- unauthorized edits
- unauthorized deletion
- duplicate votes
- duplicate likes
- duplicate bookmarks

Never trust client-supplied author IDs or role values.

---

# 17. Testing Stack

## Unit Tests

Use Vitest.

Test:

- utility functions
- Pulse Score calculation
- validators
- service logic

## Component Tests

Use React Testing Library.

Test:

- login form
- article card
- challenge composer
- challenge list
- comments
- dashboard cards

## API Tests

Use Supertest.

Test:

- authentication
- authorization
- article CRUD
- challenge creation
- challenge voting
- comments
- bookmarks

## End-to-End

Use Playwright.

At minimum test:

```text
Register
  ↓
Login
  ↓
Create Article
  ↓
Publish
  ↓
Open Article
  ↓
Create Challenge
  ↓
Reply/Vote
```

---

# 18. Deployment

## Frontend

Deploy to Vercel.

Required environment variable:

```text
VITE_API_URL=
```

## Backend

Deploy to Render or Railway.

Required variables:

```text
PORT=
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AI_API_KEY=
```

Only include AI_API_KEY if AI features are enabled.

## Database

Use hosted PostgreSQL through:

- Neon
- Supabase

Run Prisma migrations in production.

---

# 19. Environment Variables

Create:

```text
.env.example
```

Never commit real secrets.

Example:

```text
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=
VITE_API_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AI_API_KEY=
```

---

# 20. Coding Standards

Use:

- TypeScript strict mode
- ESLint
- Prettier
- reusable components
- clear naming
- small focused functions
- service-layer business logic
- shared types
- environment-based configuration

Avoid:

- giant components
- duplicate API calls
- duplicate UI components
- hardcoded URLs
- hardcoded secrets
- unnecessary abstractions
- excessive comments explaining obvious code
- `any` everywhere

---

# 21. What NOT to Add in V1

Do NOT add these just to make the stack look impressive:

```text
Redux
GraphQL
Redis
WebSockets
Socket.io
Microservices
Kubernetes
Docker orchestration
Kafka
Elasticsearch
MongoDB
Neo4j
Event sourcing
CQRS
Payment gateway
Real-time collaborative editor
Recommendation ML model
Separate AI microservice
```

These technologies can be considered later only if a real product requirement justifies them.

The goal is a polished, understandable full-stack application—not an over-engineered demo.

---

# 22. Recommended V1 Feature Scope

Build these first:

```text
Authentication
Articles
Categories
Tags
Search
Bookmarks
Likes
Comments
Challenges
Challenge Replies
Challenge Voting
Pulse Score
Writer Dashboard
Admin Moderation
Responsive UI
Dark Mode
Image Upload
Basic AI Assistance
```

Everything else is secondary.

---

# 23. Resume-Focused Engineering Goals

The final project should allow the developer to explain:

1. How React communicates with Express.
2. How JWT authentication works.
3. How Prisma maps application models to PostgreSQL.
4. Why TanStack Query was selected.
5. Why PostgreSQL was selected instead of MongoDB.
6. How authorization is enforced.
7. How Challenge differs from Comment.
8. How Pulse Score is calculated.
9. How pagination works.
10. How image uploads work.
11. How AI API secrets are protected.
12. How the application is deployed.
13. How testing is structured.
14. How the application avoids unnecessary re-fetching.
15. How database constraints prevent duplicate interactions.

---

# 24. Final Technical Positioning

For the resume, position PulseNote as:

> **A full-stack technology and digital-culture publishing platform built with React, TypeScript, Node.js, Express, PostgreSQL and Prisma, featuring JWT authentication, article publishing, challenge-based discussions, engagement ranking, analytics and AI-assisted reading tools.**

The important engineering story is:

```text
React Frontend
      ↓
REST API
      ↓
Authentication + Authorization
      ↓
Business Logic
      ↓
Prisma ORM
      ↓
PostgreSQL
```

This stack is intentionally strong enough to demonstrate full-stack engineering while remaining small enough to actually finish, deploy, explain in interviews, and maintain.
