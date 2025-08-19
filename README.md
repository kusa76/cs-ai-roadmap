# cs-ai-roadmap
Learning Computer Science & Software Engineering with AI — step by step.

## Current State
✅ Lesson 1: Local dev env set up
- Installed Python, Node.js, Docker, Git
- Created repo + services (pyapi, tsapi)
- Docker Compose with both APIs
- Health endpoints working
- Tests passing locally & in GitHub Actions CI

✅ Lesson 2 (Part A): Database foundations
- Added Postgres + Adminer to docker-compose.yml
- Connected pyapi via async SQLAlchemy + aiosqlite fallback
- Implemented basic /users endpoints
- Wired /api/users router into FastAPI main app (currently stubbed)

## Next Targets
Lesson 2 (Part B):
- Add Alembic migrations
- Replace stub with DB-backed logic
- Version control schema changes in CI

Lesson 3:
- Data validation with Pydantic
- Error handling (400/404s)
- Expanded tests

Lesson 4:
- Authentication (JWT, OAuth2 basics)
- Role-based access

Lesson 5:
- Frontend basics (React + Vite)
- Hook frontend → tsapi & pyapi

## Usage
Start services:
docker compose up -d

Health checks:
curl -s http://localhost:8000/health
curl -s http://localhost:3000/health

Stop services:
docker compose down

## Contributing
This repo is part of a guided AI-assisted Computer Science roadmap. Each lesson builds incrementally with code, commits, and CI.

- Issues are used as lesson TODOs
- CI ensures services build and tests pass

## Progress Log
- ✅ Structured services with pyapi, tsapi, Postgres, Adminer
- ✅ Implemented /health, /hello, /api/users (stub) in FastAPI
- ✅ Fixed missing deps by updating services/pyapi/requirements.txt (added SQLAlchemy, asyncpg)
- ✅ Standardized terminal→clipboard workflow using xclip alias cpc
- ✅ Standardized one-liners: { …; …; } 2>&1 | tee /dev/tty | cpc (show + copy)


### Lesson 2B — Alembic (async) quick notes
- DSN set via `alembic.ini` and `app/db.py` → `postgresql+asyncpg://<user>:<pass>@db:5432/<db>`
- Commands:
  - `python -m alembic revision --autogenerate -m "msg"`
  - `python -m alembic upgrade head`
- Models live in `app/models.py` and are imported in `migrations/env.py` to enable autogenerate.


### Lesson 3B — Error handling
- `GET /users/{id}` returns 404 when not found.


### Lesson 3C — DELETE /users/{id}
- **204 No Content** when a user is deleted
- **404** when the user does not exist

### Lesson 4A — Messages scaffold
- Added `messages` table (id, text, created_at) via Alembic.
- Endpoints:
  - `POST /messages` with Pydantic validation.
  - `GET /messages` returns list.
- Sets stage for chat/MUD/automation streams (WebSocket next).
