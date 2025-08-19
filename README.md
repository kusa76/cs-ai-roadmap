# cs-ai-roadmap

Incremental project exploring CS & SE concepts with AI assistance.  

## Stack
- **Backend:** FastAPI + Postgres (Docker) + SQLAlchemy (async)  
- **Frontend:** React (Vite) + @tanstack/react-query + Tailwind CSS (local v4)  
- **Infra:** Docker Compose, Alembic (migrations), GitHub Actions CI  

## Current Features
- Users, Sessions, Messages tables with Alembic migrations  
- REST API: `/health`, `/users`, `/sessions`, `/messages`  
- `/messages/paged`: limit/offset, order=asc|desc, filters (user_id, session_id, since, until)  
- Frontend: paginated message list, order toggle, Tailwind styling  

## Dev Setup
- Backend:  
  `sudo docker compose up -d db pyapi` → http://localhost:8000/health  
- Frontend:  
  `cd web && npm install && npm run dev` → http://localhost:5173  

## Example
`curl 'http://localhost:8000/messages/paged?limit=5&order=desc'`  
→ `{ "items": [...], "total": 42, "limit": 5, "offset": 0 }`

## CI
- GitHub Actions builds `pyapi`, `web`, `tsapi`  
- SQLite in-memory tests for backend  
- Node 20 build for frontend  

## Roadmap
- Auth (JWT/OAuth2) + RBAC  
- WebSocket message streams  
- Agent/MUD-style event loop layer  

