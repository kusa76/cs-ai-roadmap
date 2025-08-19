from app.routers import users
from fastapi import FastAPI, HTTPException
app = FastAPI()
@app.get("/health")
def health(): return {"status":"ok"}
@app.get("/hello")
def hello(name: str | None = None):
    if name is None or not name.strip():
        raise HTTPException(status_code=400, detail="name is required")
    return {"message": f"Hello, {name}!"}
app.include_router(users.router, prefix="/api", tags=["users"])
