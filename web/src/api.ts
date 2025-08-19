import axios from 'axios'
import { z } from 'zod'

export const MessageOut = z.object({
  id: z.number(),
  text: z.string().nullable(),
  session_id: z.number(),
  user_id: z.number().nullable(),
  created_at: z.string(),
})
export type MessageOut = z.infer<typeof MessageOut>

export const PagedMessages = z.object({
  items: z.array(MessageOut),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
})
export type PagedMessages = z.infer<typeof PagedMessages>

export type Order = 'asc' | 'desc'
export type QueryParams = {
  limit?: number; offset?: number; order?: Order;
  user_id?: number; session_id?: number; since?: string; until?: string;
}

// Base URL empty → use same origin; Vite proxy will route /messages → :8000
const api = axios.create({ baseURL: '', timeout: 10000 })

export async function listMessages(params: QueryParams = {}): Promise<PagedMessages> {
  const res = await api.get('/messages/paged', { params })
  return PagedMessages.parse(res.data)
}

