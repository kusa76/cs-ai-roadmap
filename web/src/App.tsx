import type { PagedMessages } from './api'
import { listMessages, createMessage, patchMessage, deleteMessage } from './api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'

type Order = 'asc' | 'desc'
type MsgKey = ['messages', { limit: number; offset: number; order: Order }]

export default function App() {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState<Order>('desc')

  // Create inputs
  const [text, setText] = useState('')
  const [sessionId, setSessionId] = useState<number>(1)
  const [userId, setUserId] = useState<string>('')

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState<string>('')

  const qc = useQueryClient()
  const offset = useMemo(() => page * limit, [page, limit])

  const { data, isPending, isError, error } = useQuery<
    PagedMessages,
    Error,
    PagedMessages,
    MsgKey
  >({
    queryKey: ['messages', { limit, offset, order }],
    queryFn: () => listMessages({ limit, offset, order }),
    placeholderData: (prev) => prev,
  })

  const createMut = useMutation({
    mutationFn: () =>
      createMessage({
        text,
        session_id: sessionId,
        user_id: userId.trim() === '' ? null : Number(userId),
      }),
    onSuccess: () => {
      setText('')
      qc.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const patchMut = useMutation({
    mutationFn: ({ id, text }: { id: number; text: string }) =>
      patchMessage(id, text),
    onSuccess: () => {
      setEditingId(null)
      setEditText('')
      qc.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteMessage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const total = data?.total ?? 0
  const maxPage = Math.max(0, Math.ceil(total / limit) - 1)
  const items = data?.items ?? []

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold">cs-ai-roadmap</h1>

        {/* Create form */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (text.trim()) createMut.mutate(); }}
          className="flex flex-col gap-3"
        >
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message…"
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              type="submit"
              disabled={createMut.isPending || !text.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
            >
              {createMut.isPending ? 'Saving…' : 'Add'}
            </button>
          </div>
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <label className="flex items-center gap-2">
              Session ID:
              <input
                type="number"
                min={1}
                value={sessionId}
                onChange={(e) => setSessionId(Number(e.target.value))}
                className="w-24 border rounded px-2 py-1"
              />
            </label>
            <label className="flex items-center gap-2">
              User ID (optional):
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-28 border rounded px-2 py-1"
              />
            </label>
          </div>
        </form>
        {createMut.isError && <p className="text-red-600 text-sm">Save failed.</p>}

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => { setPage(0); setOrder(order === 'desc' ? 'asc' : 'desc') }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Order: {order.toUpperCase()}
          </button>

          <label className="flex items-center gap-2">
            Limit:
            <select
              value={limit}
              onChange={(e) => { setPage(0); setLimit(Number(e.target.value)); }}
              className="border rounded px-2 py-1"
            >
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ‹ Prev
            </button>
            <span className="text-sm">
              Page {page + 1} / {maxPage + 1}
            </span>
            <button
              onClick={() => setPage(p => Math.min(maxPage, p + 1))}
              disabled={page >= maxPage}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next ›
            </button>
          </div>
        </div>

        {/* List */}
        <div>
          {isPending && <p>Loading messages…</p>}
          {isError && <p className="text-red-600">Error: {error?.message ?? 'failed to load'}</p>}
          {data && (
            <>
              <p className="text-sm text-gray-500">
                Showing {Math.min(limit, items.length)} of {total} (offset {offset})
              </p>
              <ul className="divide-y divide-gray-200">
                {items.length === 0 && <li className="py-2">No messages yet.</li>}
                {items.map((m: PagedMessages['items'][number]) => {
                  const isEditing = editingId === m.id
                  return (
                    <li key={m.id} className="py-2 flex items-start gap-3">
                      <span className="font-mono text-blue-600 pt-2">#{m.id}</span>
                      <div className="flex-1">
                        {isEditing ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              if (editText.trim()) patchMut.mutate({ id: m.id, text: editText })
                            }}
                            className="flex gap-2"
                          >
                            <input
                              autoFocus
                              className="flex-1 border rounded px-3 py-2"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              placeholder="Edit text…"
                            />
                            <button
                              type="submit"
                              disabled={patchMut.isPending || !editText.trim()}
                              className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
                            >
                              {patchMut.isPending ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingId(null); setEditText('') }}
                              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <>
                            <div className="text-lg">{m.text ?? '(no text)'}</div>
                            <div className="text-xs text-gray-500">
                              sess {m.session_id} • user {m.user_id ?? '—'} • {new Date(m.created_at).toLocaleString()}
                            </div>
                          </>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingId(m.id); setEditText(m.text ?? '') }}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => {
                              if (deleteMut.isPending) return
                              if (window.confirm(`Delete message #${m.id}?`)) deleteMut.mutate(m.id)
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            disabled={deleteMut.isPending}
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

