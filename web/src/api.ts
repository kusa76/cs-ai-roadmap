import axios from 'axios';
import { z } from 'zod';

const BASE_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:8000';
export const http = axios.create({ baseURL: BASE_URL });

export const MessageOut = z.object({
  id: z.number(),
  text: z.string().nullable().or(z.string()),
  session_id: z.number(),
  user_id: z.number().nullable(),
  created_at: z.string(),
});
export type MessageOut = z.infer<typeof MessageOut>;

export const PagedMessages = z.object({
  items: z.array(MessageOut),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});
export type PagedMessages = z.infer<typeof PagedMessages>;

export type Order = 'asc' | 'desc';
export type QueryParams = {
  limit?: number; offset?: number; order?: Order;
  user_id?: number; session_id?: number; since?: string;
};

export async function listMessages(params: QueryParams = {}) {
  const { data } = await http.get('/messages/paged', { params });
  return PagedMessages.parse(data);
}

export async function createMessage(input: { text: string; session_id: number; user_id?: number | null }) {
  const { data } = await http.post('/messages', {
    text: input.text,
    session_id: input.session_id,
    user_id: input.user_id ?? null,
  });
  return MessageOut.parse(data);
}

export async function patchMessage(id: number, text: string) {
  const { data } = await http.patch(`/messages/${id}`, { text });
  return MessageOut.parse(data);
}

export async function deleteMessage(id: number) {
  await http.delete(`/messages/${id}`);
}

