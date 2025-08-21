import type { PagedMessages } from '../api'
import MessageItem from './MessageItem'

export default function MessagesList({
  data,
  isPending,
  isError,
  error,
  limit,
  offset,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: {
  data: PagedMessages | undefined
  isPending: boolean
  isError: boolean
  error: Error | null
  limit: number
  offset: number
  onSave: (id: number, text: string) => void
  onDelete: (id: number) => void
  isSaving: boolean
  isDeleting: boolean
}) {
  if (isPending) return <p>Loading messages…</p>
  if (isError) return <p className="text-red-600">Error: {error?.message ?? 'failed to load'}</p>

  const total = data?.total ?? 0
  const items = data?.items ?? []

  return (
    <>
      <p className="text-sm text-gray-500">
        Showing {Math.min(limit, items.length)} of {total} (offset {offset})
      </p>
      <ul className="divide-y divide-gray-200">
        {items.length === 0 && <li className="py-2">No messages yet.</li>}
        {items.map((m) => (
          <MessageItem
            key={m.id}
            m={m}
            onSave={onSave}
            onDelete={onDelete}
            isSaving={isSaving}
            isDeleting={isDeleting}
          />
        ))}
      </ul>
    </>
  )
}

