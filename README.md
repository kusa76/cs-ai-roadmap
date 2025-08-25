# cs-ai-roadmap
[![CI](https://github.com/kusa76/cs-ai-roadmap/actions/workflows/ci.yml/badge.svg)](https://github.com/kusa76/cs-ai-roadmap/actions)
![Coverage](https://img.shields.io/badge/coverage-79%25-green)
![License](https://img.shields.io/github/license/kusa76/cs-ai-roadmap)

Incremental project exploring CS & SE concepts with AI assistance.
Focus: building an extensible kernel (users → sessions → messages), with CI, testing, and full-stack practices.

## Stack

* **Backend:** FastAPI + Postgres (Docker) + SQLAlchemy (async)
* **Frontend:** React (Vite) + @tanstack/react-query + Tailwind CSS v4
* **Infra:** Docker Compose, Alembic migrations, GitHub Actions CI, Vitest + Testing Library

## Current Features

* Users, Sessions, Messages tables with Alembic migrations
* REST API: `/health`, `/users`, `/sessions`, `/messages`
* `/messages/paged`: limit/offset, order=asc|desc, filters (user\_id, session\_id, since, until)
* Frontend:

  * Paginated message list
  * Order toggle + pagination controls
  * Inline form for adding messages
  * Component tests + integration test
  * Coverage gates enforced in CI

## Dev Setup

**Backend:**
sudo docker compose up -d db pyapi
→ [http://localhost:8000/health](http://localhost:8000/health)

**Frontend:**
cd web
npm install
npm run dev
→ [http://localhost:5173](http://localhost:5173)

## Example

curl '[http://localhost:8000/messages/paged?limit=5\&order=desc](http://localhost:8000/messages/paged?limit=5&order=desc)'
→ { "items": \[...], "total": 42, "limit": 5, "offset": 0 }

## Testing

From the `web/` directory:

* Run tests: `npm run test`
* Run with coverage: `npm run test -- --coverage`

Coverage thresholds are enforced in CI (70% lines/statements, 55% branches, 30% functions).

## CI

* GitHub Actions runs on every push / PR
* **Backend:** SQLite in-memory tests (FastAPI)
* **Frontend:** Node 20, lint + typecheck + Vitest with coverage gates

## Roadmap

* Auth (JWT/OAuth2) + RBAC
* WebSocket message streams
* Agent/MUD-style event loop layer
* Extended integration & end-to-end tests

