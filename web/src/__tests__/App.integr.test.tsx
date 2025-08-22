import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'

// Mock axios so any axios.create().get(...) resolves with our data
vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        get: vi.fn().mockResolvedValue({
          data: {
            items: [
              { id: 1, text: 'server-first', session_id: 1, user_id: null, created_at: '2025-08-21T15:00:00Z' },
            ],
            total: 1, limit: 10, offset: 0,
          },
        }),
      }),
    },
  }
})

it('loads messages from API and shows them', async () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  render(
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  )

  await waitFor(() =>
    expect(screen.getByText(/server-first/i)).toBeInTheDocument()
  )
})

