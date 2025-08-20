from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
from app.routers import messages  # keep existing /messages/* paths

app = FastAPI(title="cs-ai-roadmap API")

# Dev CORS (open for localhost dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Fallback OPTIONS so preflights don't 405
@app.options("/{rest_of_path:path}")
async def preflight_ok(rest_of_path: str):
    return Response(status_code=200)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/hello")
def hello(name: str | None = None):
    if name is None or not name.strip():
        raise HTTPException(status_code=400, detail="name is required")
    return {"hello": name.strip()}

# Mount routers (no /api prefix to preserve current frontend URLs)
app.include_router(messages.router)

