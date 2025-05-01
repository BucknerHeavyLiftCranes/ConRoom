import { render, screen, fireEvent } from '@testing-library/react'
import ActionButton from '../ActionButtonModule/ActionButton'

describe('ActionButton', () => {
  it('renders with correct label', () => {
    render(<ActionButton label="Click Me" />)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('calls action when clicked', () => {
    const mockAction = vi.fn() // or jest.fn() if using Jest
    render(<ActionButton label="Click" action={mockAction} />)

    fireEvent.click(screen.getByText('Click'))
    expect(mockAction).toHaveBeenCalled()
  })

  it('does not throw error if action is not provided', () => {
    render(<ActionButton label="Click Me" />)

    // Should not throw
    fireEvent.click(screen.getByText('Click Me'))
  })

  it('applies default style class if no override', () => {
    const { container } = render(<ActionButton label="Click" />)
    const button = container.querySelector('button')
    expect(button.className).toContain('actionButton') // or use exact match
  })

  it('applies override style class when provided', () => {
    const { container } = render(
      <ActionButton label="Click" overrideStyles="closePopupButton" />
    )
    const button = container.querySelector('button')
    expect(button.className).toContain('closePopupButton')
  })

//   it('disables the button when isDisabled is true', () => {
//     render(<ActionButton label="Disabled" isDisabled={true} />)
//     const button = screen.getByText('Disabled')
//     expect(button).toBeDisabled()
//     expect(button).toHaveStyle({ backgroundColor: 'gray' })
//   })
})
