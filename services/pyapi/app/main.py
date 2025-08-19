from fastapi import FastAPI, HTTPException
from app.routers import users

app = FastAPI(title="cs-ai-roadmap API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/hello")
def hello(name: str | None = None):
    if name is None or not name.strip():
        raise HTTPException(status_code=400, detail="name is required")
    return {"hello": name.strip()}

# users under /api
app.include_router(users.router, prefix="/api", tags=["users"])

# messages under /api (log a warning if unavailable, but don't crash)
try:
    from app.routers import messages
    app.include_router(messages.router, prefix="/api", tags=["messages"])
except Exception as e:
    import logging
    logging.getLogger(__name__).warning(f"messages router unavailable: {e}")

