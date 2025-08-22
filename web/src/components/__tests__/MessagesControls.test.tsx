import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessagesControls } from '../'

describe('MessagesControls', () => {
  it('toggles order and resets page', async () => {
    const user = userEvent.setup()
    const setOrder = vi.fn()
    const setPage = vi.fn()
    const setLimit = vi.fn()

    render(
      <MessagesControls
        order="desc"
        page={0}
        total={2}
        limit={10}
        setOrder={setOrder}
        setPage={setPage}
        setLimit={setLimit}
      />
    )

    await user.click(screen.getByRole('button', { name: /order:\s*desc/i }))
    expect(setPage).toHaveBeenCalledWith(0)
    expect(setOrder).toHaveBeenCalledWith('asc')
  })
})

