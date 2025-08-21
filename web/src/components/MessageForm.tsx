import { useState } from 'react'

export type CreatePayload = {
  text: string
  session_id: number
  user_id: number | null
}

export default function MessageForm({
  onCreate,
  isSaving,
}: {
  onCreate: (p: CreatePayload) => void
  isSaving: boolean
}) {
  const [text, setText] = useState('')
  const [sessionId, setSessionId] = useState<number>(1)
  const [userId, setUserId] = useState<string>('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onCreate({
      text: trimmed,
      session_id: sessionId,
      user_id: userId.trim() === '' ? null : Number(userId),
    })
    setText('')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={isSaving || !text.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
        >
          {isSaving ? 'Saving…' : 'Add'}
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
  )
}

