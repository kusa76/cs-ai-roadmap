from fastapi import APIRouter

router = APIRouter()

@router.get("/users")
async def list_users():
    return [{"id": 1, "name": "TestUser"}]

@router.post("/users")
async def create_user(name: str):
    return {"id": 1, "name": name}
