import { render, screen } from '@testing-library/react'
import { MessagesList } from '../'

describe('MessagesList', () => {
  it('renders items', () => {
    const items = [
      { id: 1, text: 'first',  session_id: 1, user_id: null, created_at: '2025-08-21T15:00:00Z' },
      { id: 2, text: 'second', session_id: 1, user_id: null, created_at: '2025-08-21T15:01:00Z' },
    ]

    render(
      <MessagesList
        data={{ items, total: 2, limit: 10, offset: 0 }}
        isPending={false}
        isError={false}
        error={null}
        limit={10}
        offset={0}
        isSaving={false}
        isDeleting={false}
        onSave={() => {}}
        onDelete={() => {}}
      />
    )

    expect(screen.getByText('first')).toBeInTheDocument()
    expect(screen.getByText('second')).toBeInTheDocument()
  })
})

