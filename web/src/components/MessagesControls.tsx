type Order = 'asc' | 'desc'

export default function MessagesControls({
  order,
  setOrder,
  limit,
  setLimit,
  page,
  setPage,
  maxPage,
}: {
  order: Order
  setOrder: (o: Order) => void
  limit: number
  setLimit: (n: number) => void
  page: number
  setPage: (n: number) => void
  maxPage: number
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <button
        onClick={() => {
          setPage(0)
          setOrder(order === 'desc' ? 'asc' : 'desc')
        }}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Order: {order.toUpperCase()}
      </button>

      <label className="flex items-center gap-2">
        Limit:
        <select
          value={limit}
          onChange={(e) => {
            setPage(0)
            setLimit(Number(e.target.value))
          }}
          className="border rounded px-2 py-1"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ‹ Prev
        </button>
        <span className="text-sm">
          Page {page + 1} / {maxPage + 1}
        </span>
        <button
          onClick={() => setPage(Math.min(maxPage, page + 1))}
          disabled={page >= maxPage}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next ›
        </button>
      </div>
    </div>
  )
}

