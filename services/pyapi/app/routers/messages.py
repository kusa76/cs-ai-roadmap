import os
from typing import Optional, List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

router = APIRouter(prefix="/messages")

# --- DB session (Postgres via env DATABASE_URL) ---
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@db:5432/postgres",
)
engine = create_async_engine(DATABASE_URL, future=True, echo=False)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_session() -> AsyncSession:
    async with SessionLocal() as session:
        yield session

# --- Schemas (align with frontend) ---
class MessageOut(BaseModel):
    id: int
    text: Optional[str]
    session_id: int
    user_id: Optional[int]
    created_at: str

class PagedMessages(BaseModel):
    items: List[MessageOut]
    total: int
    limit: int
    offset: int

# --- Routes ---
@router.get("", response_model=PagedMessages)
async def list_messages(
    limit: int = 10,
    offset: int = 0,
    order: str = "desc",
    session: AsyncSession = Depends(get_session),
):
    order_sql = "DESC" if order.lower() != "asc" else "ASC"

    # total count
    res_total = await session.execute(text("SELECT COUNT(*) FROM messages"))
    total = int(res_total.scalar() or 0)

    # page query
    res = await session.execute(
        text(
            f"""
            SELECT
              id,
              text,
              session_id,
              user_id,
              to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at
            FROM messages
            ORDER BY id {order_sql}
            LIMIT :limit OFFSET :offset
            """
        ),
        {"limit": limit, "offset": offset},
    )
    items = [MessageOut(**dict(r._mapping)) for r in res.fetchall()]

    return PagedMessages(items=items, total=total, limit=limit, offset=offset)

