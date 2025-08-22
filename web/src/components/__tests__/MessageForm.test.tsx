import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessageForm } from '../'

describe('MessageForm', () => {
  it('submits text and clears input', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()

    render(<MessageForm onCreate={onCreate} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'hello world')
    await user.click(screen.getByRole('button'))

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'hello world' })
    )
    expect((input as HTMLInputElement).value).toBe('')
  })
})

