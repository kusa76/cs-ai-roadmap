import type { PagedMessages } from './api'
import { listMessages, createMessage, patchMessage, deleteMessage } from './api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { MessageForm, MessagesControls, MessagesList } from './components'
import type { CreatePayload } from './components/MessageForm'


type Order = 'asc' | 'desc'
type MsgKey = ['messages', { limit: number; offset: number; order: Order }]

export default function App() {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState<Order>('desc')

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
    mutationFn: (p: CreatePayload) => createMessage(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const patchMut = useMutation({
    mutationFn: ({ id, text }: { id: number; text: string }) =>
      patchMessage(id, text),
    onSuccess: () => {
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold">cs-ai-roadmap</h1>

        <MessageForm onCreate={(p) => createMut.mutate(p)} isSaving={createMut.isPending} />
        {createMut.isError && (
          <p className="text-red-600 text-sm">Save failed.</p>
        )}

        <MessagesControls
          order={order}
          setOrder={setOrder}
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          maxPage={maxPage}
        />

        <MessagesList
          data={data}
          isPending={isPending}
          isError={isError}
          error={error ?? null}
          limit={limit}
          offset={offset}
          onSave={(id, text) => patchMut.mutate({ id, text })}
          onDelete={(id) => deleteMut.mutate(id)}
          isSaving={patchMut.isPending}
          isDeleting={deleteMut.isPending}
        />
      </div>
    </div>
  )
}

