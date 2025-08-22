import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  // match /messages on any origin or prefix (e.g., /api/messages, http://localhost:8000/messages, /tsapi/messages)
  http.get('*/messages', () =>
    HttpResponse.json({
      items: [
        { id: 1, text: 'server-first', session_id: 1, user_id: null, created_at: '2025-08-21T15:00:00Z' },
      ],
      total: 1, limit: 10, offset: 0,
    })
  )
)

