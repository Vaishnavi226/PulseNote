# PulseNote

> **Read. Think. Challenge.**

A modern technology and digital-culture article platform built with React, Express, TypeScript, and Prisma.

## Overview

PulseNote is a full-stack web application for publishing and reading long-form technology and digital-culture writing. It presents content through an editorial, publication-style interface — a curated home feed, a searchable archive, and distraction-free article pages — rather than a conventional social feed.

The core idea behind PulseNote is *structured conversation*: articles are meant to be engaged with seriously, through counterarguments, supporting evidence, and added context ("challenges") rather than drive-by reactions. That philosophy shapes both the product design and the underlying data model, which includes dedicated structures for challenges, threaded replies, votes, moderation, and notifications.

The current release implements the reading and publishing foundation end to end: JWT authentication with role-based permissions, an article lifecycle (draft → published → archived) with draft-visibility rules, category browsing, search, sorting, and pagination — all backed by a typed REST API and a relational PostgreSQL schema managed with Prisma.

Interactive discussion features (the challenge feed, comments, votes, and notifications) are fully modeled in the database schema but are not yet exposed through the API or UI. See [Current Status](#current-status).

## Features

### Reading experience
- Editorial home page with a featured lead story, latest stories grid, and most-recent list
- Explore/archive page with keyword search, category filtering, sorting (`latest`, `popular`, `pulse`), and URL-driven pagination
- Trending page listing stories ranked by popularity
- Clean, typography-focused article detail pages with reading time, author byline, and linked category
- View counts incremented automatically when an article is opened

### Accounts and authentication
- Email/password registration and login
- JWT-based sessions with client-side token storage and automatic sign-out on invalid sessions
- Session restore on page reload via the authenticated profile endpoint
- Role-based access control (`USER`, `AUTHOR`, `MODERATOR`, `ADMIN`)
- Protected frontend routes

### Publishing
- Article creation, editing, publishing/unpublishing, and deletion via role-gated REST endpoints
- Slug-based public URLs and draft visibility rules (drafts are visible only to their authors, moderators, and admins)
- Categories and tags support on articles, backed by dedicated API endpoints for categories
- Request validation with Zod on every mutating endpoint
- Database seeder with sample categories, tags, users, and articles for local development

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite 6
- Material UI v6 (Emotion) with a custom editorial design system
- React Router 7
- TanStack React Query 5 for server-state management
- Axios (HTTP client with auth interceptors)
- React Hook Form + Zod (form validation)
- Lucide icons

**Backend**
- Node.js + Express 4
- TypeScript
- Zod (request validation)
- Helmet, CORS, Morgan (security and logging)

**Database**
- PostgreSQL
- Prisma ORM 6 (schema, migrations, seeding)

**Authentication**
- JSON Web Tokens (`jsonwebtoken`)
- Password hashing with `bcryptjs`

**Development tools**
- `ts-node-dev` (backend hot reload)
- Vitest + Supertest (API integration tests)
- TypeScript compiler checks used as lint gates on both apps

## Architecture

PulseNote is split into two independent applications that communicate over a JSON REST API:

- **`client/`** — a single-page React application. Pages fetch data through React Query hooks backed by a shared Axios instance, which automatically attaches the stored JWT to requests and clears the session on `401` responses. During development, Vite proxies `/api` requests to the backend server, keeping the frontend and backend decoupled while avoiding cross-origin setup locally.
- **`server/`** — an Express REST API organized in layers: routes → Zod validation → auth/role middleware → controllers → services → Prisma → PostgreSQL. Authentication is stateless JWT bearer auth; a global error handler normalizes all failures into a consistent `{ success, error }` response shape. CORS is restricted to the configured client origin, and security headers are applied via Helmet.

The Prisma schema models the full domain — users, roles, articles, categories, tags, challenges, replies, votes, comments, likes, bookmarks, notifications, reading history, reports, and audit logs — providing the foundation for the community features planned on top of the existing reading/publishing core.

## Project Structure

```text
PulseNote/
├── client/                        # React frontend (Vite)
│   └── src/
│       ├── api/                   # Axios client with auth interceptors
│       ├── components/
│       │   ├── auth/              # ProtectedRoute
│       │   └── common/            # Navbar, AppShell, layout and state components
│       ├── features/
│       │   ├── articles/          # Cards, lists, filters, hooks, API service
│       │   └── auth/              # Auth context, hooks, API service
│       ├── pages/                 # Route-level pages and AppRoutes
│       ├── theme/                 # Design tokens and MUI theme
│       └── main.tsx
├── server/                        # Express REST API
│   ├── prisma/
│   │   ├── schema.prisma          # Data model
│   │   ├── migrations/            # SQL migrations
│   │   └── seed.ts                # Sample data seeder
│   └── src/
│       ├── config/                # Environment config, Prisma client
│       ├── controllers/
│       ├── middleware/            # Auth, roles, validation, error handling
│       ├── routes/
│       ├── services/              # Business logic
│       ├── validators/            # Zod schemas
│       ├── __tests__/             # Vitest integration tests
│       ├── app.ts                 # Express app factory
│       └── server.ts              # HTTP entrypoint
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js 18 or later (LTS recommended)
- npm
- A PostgreSQL database (local installation or hosted instance)

### Installation

```bash
git clone https://github.com/Vaishnavi226/PulseNote.git
cd PulseNote

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

The backend reads configuration from `server/.env`. Create the file and fill in your own values:

```bash
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/pulsenote?schema=public
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the API listens on (defaults to `5000`) |
| `NODE_ENV` | Runtime environment (`development`, `production`) |
| `CLIENT_URL` | Allowed browser origin for CORS (the Vite dev server URL) |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `JWT_EXPIRES_IN` | Token lifetime (defaults to `7d`) |

The frontend has one optional variable, `client/.env`:

```bash
VITE_API_URL=http://localhost:5000/api
```

If omitted, the client calls `/api` relative to its own origin, which works out of the box with the Vite development proxy.

Never commit real `.env` files — they are excluded by `.gitignore`.

### Database Setup

From the `server/` directory:

```bash
# Apply migrations to your database
npm run prisma:migrate

# Generate the Prisma client (also done automatically by migrate)
npm run prisma:generate

# Load sample categories, tags, users, and articles
npm run prisma:seed
```

### Running the Project

```bash
# Terminal 1 — backend API on http://localhost:5000
cd server
npm run dev

# Terminal 2 — frontend on http://localhost:5173
cd client
npm run dev
```

Open http://localhost:5173 in your browser. The Vite dev server forwards all `/api` requests to the backend.

## API Overview

All endpoints are prefixed with `/api` and return JSON in a `{ success, data }` envelope.

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Service health check | Public |
| `POST` | `/api/auth/register` | Register a new account | Public |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT | Public |
| `GET` | `/api/auth/me` | Get the current authenticated user | Private |
| `GET` | `/api/categories` | List all categories | Public |
| `GET` | `/api/categories/:slug` | Get a single category by slug | Public |
| `GET` | `/api/articles` | Paginated article list with `search`, `category`, `status`, and `sort` (`latest` / `popular` / `pulse`) filters | Public* |
| `GET` | `/api/articles/:slug` | Full article by slug; increments the view count | Public* |
| `POST` | `/api/articles` | Create an article | Author+ |
| `PATCH` | `/api/articles/:id` | Update an article | Author+ |
| `PATCH` | `/api/articles/:id/publish` | Publish or unpublish an article | Author+ |
| `DELETE` | `/api/articles/:id` | Delete an article | Author/Admin |

\* These endpoints use optional authentication: anonymous visitors see published articles, while signed-in authors, moderators, and admins also gain access to their own drafts.

"Author+" means the request must carry a valid JWT from a user with the `AUTHOR`, `MODERATOR`, or `ADMIN` role.

## Development

Backend commands (run inside `server/`):

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with hot reload |
| `npm run lint` | Type-check the backend (`tsc --noEmit`) |
| `npm test` | Run Vitest integration tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |

Frontend commands (run inside `client/`):

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run lint` | Type-check the frontend (`tsc --noEmit`) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

Note: the backend integration tests exercise real registration/login flows against the database, so a reachable `DATABASE_URL` is required when running them.

## Current Status

**Implemented**

- Authentication (register, login, session restore) with JWTs and hashed passwords
- Role-based authorization across the API
- Article CRUD with publish/unpublish workflow and draft-visibility rules
- Public browsing: home feed, explore/search/sort/filter/pagination, trending, article detail with view tracking
- Categories API and category filtering in the UI
- Database schema covering the full product domain (users, articles, categories, tags, challenges, replies, votes, comments, likes, bookmarks, notifications, reading history, reports, audit logs)
- Sample-data seeder and API integration tests for authentication

**Not yet implemented**

- Challenge system API and UI (data model exists; the Challenges page currently shows a placeholder empty state)
- Comments, likes, bookmarks, votes, and threaded replies endpoints/UI
- Notifications, reading history, reporting, and moderation tooling (modeled only)
- Article editor page (the protected `/write` route is scaffolded but renders placeholder content)
- Media/image upload integration
- CI pipelines and deployment configuration

## Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch
2. Make your changes and ensure `npm run lint` passes in both `client/` and `server/`
3. Test your changes against a local database
4. Open a pull request describing what changed and why

## License

This project currently has no declared license. All rights are reserved by the author unless a license is added.

## Author

**Vaishnavi Tripathi**

GitHub: [https://github.com/Vaishnavi226](https://github.com/Vaishnavi226)
