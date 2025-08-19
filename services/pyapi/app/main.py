from fastapi import FastAPI, HTTPException
from app.routers import users

app = FastAPI()

@app.get("/health")
def health(): return {"status": "ok"}

@app.get("/hello")
def hello(name: str | None = None):
    if name is None or not name.strip():
        raise HTTPException(status_code=400, detail="name is required")

app.include_router(users.router, prefix="/api", tags=["users"])

# Try to include messages router if present, but don't crash if broken
try:
    from app.routers import messages
    app.include_router(messages.router)
except Exception as e:
    import logging; logging.getLogger(__name__).warning(f"messages router unavailable: {e}")
