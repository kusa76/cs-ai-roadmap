// Lightweight helpers for consistent mock data across tests
export type Msg = { id: number; session_id: number; user_id?: number | null; role: string; content: string; created_at?: string };

export const makeMsg = (id: number, content = `m${id}`): Msg => ({
  id,
  session_id: 1,
  user_id: null,
  role: "user",
  content,
  created_at: new Date(2025, 7, 19, 12, id).toISOString(),
});

export const paged = (items: Msg[], total: number, limit: number, offset: number) => ({
  items,
  total,
  limit,
  offset,
});

