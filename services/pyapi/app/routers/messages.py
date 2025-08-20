import os
from typing import Optional, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

router = APIRouter(prefix="/messages", tags=["messages"])

# --- DB session (async) ---
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@db:5432/postgres",
)
engine = create_async_engine(DATABASE_URL, future=True, echo=False)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_session() -> AsyncSession:
    async with SessionLocal() as session:
        yield session

# --- Schemas ---
class MessageOut(BaseModel):
    id: int
    text: Optional[str]
    session_id: int
    user_id: Optional[int]
    created_at: datetime  # <— changed from str to datetime

class PagedMessages(BaseModel):
    items: List[MessageOut]
    total: int
    limit: int
    offset: int

class MessageCreate(BaseModel):
    text: str = Field(..., min_length=1)
    session_id: int
    user_id: Optional[int] = None

class MessageUpdate(BaseModel):
    text: str = Field(..., min_length=1)

# --- Routes ---
@router.get("/paged", response_model=PagedMessages)
async def list_paged(
    limit: int = 10,
    offset: int = 0,
    order: str = "desc",
    session: AsyncSession = Depends(get_session),
):
    order = order.lower()
    if order not in ("asc", "desc"):
        raise HTTPException(status_code=400, detail="order must be asc or desc")

    # total
    res = await session.execute(text("SELECT COUNT(*) FROM public.messages"))
    total = int(res.scalar_one())

    # items
    q = text(f"""
        SELECT id, "text" AS text, session_id, user_id, created_at
        FROM public.messages
        ORDER BY created_at {order}
        LIMIT :limit OFFSET :offset
    """)
    res = await session.execute(q, {"limit": limit, "offset": offset})
    rows = res.mappings().all()
    items = [MessageOut(**dict(r)) for r in rows]
    return PagedMessages(items=items, total=total, limit=limit, offset=offset)

@router.post("", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
async def create_message(body: MessageCreate, session: AsyncSession = Depends(get_session)):
    q = text("""
        INSERT INTO public.messages ("text", session_id, user_id)
        VALUES (:text, :sid, :uid)
        RETURNING id, "text" AS text, session_id, user_id, created_at
    """)
    res = await session.execute(q, {"text": body.text, "sid": body.session_id, "uid": body.user_id})
    row = res.mappings().first()
    await session.commit()
    if not row:
        raise HTTPException(status_code=500, detail="insert failed")
    return MessageOut(**dict(row))

@router.patch("/{message_id}", response_model=MessageOut)
async def update_message(message_id: int, body: MessageUpdate, session: AsyncSession = Depends(get_session)):
    q = text("""
        UPDATE public.messages SET "text" = :text
        WHERE id = :id
        RETURNING id, "text" AS text, session_id, user_id, created_at
    """)
    res = await session.execute(q, {"text": body.text, "id": message_id})
    row = res.mappings().first()
    await session.commit()
    if not row:
        raise HTTPException(status_code=404, detail="message not found")
    return MessageOut(**dict(row))

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: int, session: AsyncSession = Depends(get_session)):
    await session.execute(text("DELETE FROM public.messages WHERE id = :id"), {"id": message_id})
    await session.commit()

