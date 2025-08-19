import type { PagedMessages } from './api'
import { listMessages, createMessage } from './api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'

type Order = 'asc' | 'desc'
type MsgKey = ['messages', { limit: number; offset: number; order: Order }]

export default function App() {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState<Order>('desc')
  const [text, setText] = useState('')
  const qc = useQueryClient()

  const offset = useMemo(() => page * limit, [page, limit])

  const { data, isPending, isError, error } = useQuery<
    PagedMessages, // TQueryFnData
    Error,         // TError
    PagedMessages, // TData (after select)
    MsgKey         // TQueryKey
  >({
    queryKey: ['messages', { limit, offset, order }],
    queryFn: () => listMessages({ limit, offset, order }),
    // v5 replacement for keepPreviousData
    placeholderData: (prev) => prev,
  })

  const mut = useMutation({
    mutationFn: () => createMessage({ text, session_id: 1 }),
    onSuccess: () => {
      setText('')
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
          onSubmit={(e) => { e.preventDefault(); if (text.trim()) mut.mutate(); }}
          className="flex gap-2"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message…"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={mut.isPending || !text.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
          >
            {mut.isPending ? 'Saving…' : 'Add'}
          </button>
        </form>
        {mut.isError && <p className="text-red-600 text-sm">Save failed.</p>}

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
                {items.map((m: PagedMessages['items'][number]) => (
                  <li key={m.id} className="py-2">
                    <span className="font-mono text-blue-600">#{m.id}</span> — {m.text ?? '(no text)'}
                    <span className="ml-2 text-gray-500 text-sm">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

