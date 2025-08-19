import os
from typing import Optional, Literal, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

router = APIRouter(prefix="/messages", tags=["messages"])

# --- Session factory ---
DB_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/postgres")
engine = create_async_engine(DB_URL, echo=False, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
async def get_session() -> AsyncSession:
    async with SessionLocal() as s:
        yield s

@router.get("/ping")
async def ping():
    return {"ok": True}

# --- Typed response models ---
class MessageOut(BaseModel):
    id: int
    text: str
    session_id: int
    user_id: Optional[int]  # some rows may have NULL user_id
    created_at: datetime

class PagedMessages(BaseModel):
    items: List[MessageOut]
    total: int
    limit: int
    offset: int

def _row_to_out(r) -> MessageOut:
    return MessageOut(
        id=r.id,
        text=r.text,
        session_id=r.session_id,
        user_id=r.user_id,
        created_at=r.created_at,
    )

# --- /paged endpoint ---
@router.get("/paged", response_model=PagedMessages)
async def paged_messages(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user_id: Optional[int] = None,
    session_id: Optional[int] = None,
    since: Optional[datetime] = None,
    until: Optional[datetime] = None,
    order: Literal["asc", "desc"] = "desc",
    session: AsyncSession = Depends(get_session),
):
    if order not in ("asc", "desc"):
        raise HTTPException(status_code=400, detail="invalid order")

    where, params = [], {"limit": limit, "offset": offset}
    if user_id is not None:
        where.append("user_id = :user_id")
        params["user_id"] = user_id
    if session_id is not None:
        where.append("session_id = :session_id")
        params["session_id"] = session_id
    if since is not None:
        where.append("created_at >= :since")
        params["since"] = since
    if until is not None:
        where.append("created_at <= :until")
        params["until"] = until

    where_sql = (" WHERE " + " AND ".join(where)) if where else ""

    items_sql = f"""
        SELECT id, text, session_id, user_id, created_at
        FROM messages{where_sql}
        ORDER BY created_at {order}
        LIMIT :limit OFFSET :offset
    """
    total_sql = f"SELECT COUNT(*) FROM messages{where_sql}"

    res = await session.execute(text(total_sql), params)
    total = int(res.scalar() or 0)

    res = await session.execute(text(items_sql), params)
    items = [_row_to_out(x) for x in res.fetchall()]

    return PagedMessages(items=items, total=total, limit=limit, offset=offset)

