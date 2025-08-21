import { useState } from 'react'
import type { PagedMessages } from '../api'

export default function MessageItem({
  m,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: {
  m: PagedMessages['items'][number]
  onSave: (id: number, text: string) => void
  onDelete: (id: number) => void
  isSaving: boolean
  isDeleting: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(m.text ?? '')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!editText.trim()) return
    onSave(m.id, editText.trim())
    setIsEditing(false)
  }

  return (
    <li className="py-2 flex items-start gap-3">
      <span className="font-mono text-blue-600 pt-2">#{m.id}</span>
      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={submit} className="flex gap-2">
            <input
              autoFocus
              className="flex-1 border rounded px-3 py-2"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Edit text…"
            />
            <button
              type="submit"
              disabled={isSaving || !editText.trim()}
              className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setEditText(m.text ?? '')
              }}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="text-lg">{m.text ?? '(no text)'}</div>
            <div className="text-xs text-gray-500">
              sess {m.session_id} • user {m.user_id ?? '—'} •{' '}
              {new Date(m.created_at).toLocaleString()}
            </div>
          </>
        )}
      </div>
      {!isEditing && (
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => {
              if (isDeleting) return
              if (window.confirm(`Delete message #${m.id}?`)) onDelete(m.id)
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            disabled={isDeleting}
            title="Delete"
          >
            🗑
          </button>
        </div>
      )}
    </li>
  )
}

