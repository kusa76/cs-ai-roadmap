import type { PagedMessages } from './api'
import { listMessages } from './api'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'

export default function App() {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const offset = useMemo(() => page * limit, [page, limit])

  const { data, isLoading, error } = useQuery<PagedMessages>({
    queryKey: ['messages', { limit, offset, order }],
    queryFn: () => listMessages({ limit, offset, order }),
    keepPreviousData: true,
  })

  const total = data?.total ?? 0
  const maxPage = Math.max(0, Math.ceil(total / limit) - 1)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold">cs-ai-roadmap</h1>

        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
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

        <div>
          {isLoading && <p>Loading messages…</p>}
          {error && <p className="text-red-600">Error: {(error as any)?.message ?? 'failed to load'}</p>}
          {data && (
            <>
              <p className="text-sm text-gray-500">
                Showing {Math.min(limit, data.items.length)} of {data.total} (offset {offset})
              </p>
              <ul className="divide-y divide-gray-200">
                {data.items.length === 0 && <li className="py-2">No messages yet.</li>}
                {data.items.map(m => (
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

