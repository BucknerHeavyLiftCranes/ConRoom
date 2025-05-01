import { render, screen, fireEvent } from '@testing-library/react'
import ActionButton from '../ActionButtonModule/ActionButton'
import { vi } from 'vitest'

// CSS module mock
vi.mock('./ActionButton.module.css', () => ({
  actionButton: 'default-class',
  closePopupButton: 'override-class'
}))

describe('ActionButton', () => {
  it('renders with correct label', () => {
    render(<ActionButton label="Submit" />)
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('calls action when clicked', () => {
    const mockFn = vi.fn()
    render(<ActionButton label="Click" action={mockFn} />)
    fireEvent.click(screen.getByText('Click'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does not throw if action is undefined', () => {
    render(<ActionButton label="No Action" />)
    fireEvent.click(screen.getByText('No Action'))
    // No assertion needed — passes if no error is thrown
  })

  it('is disabled when `isDisabled` is true', () => {
    render(<ActionButton label="Disabled" isDisabled={true} />)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
  })

  it('has no inline style when enabled', () => {
    render(<ActionButton label="Styled" isDisabled={false} />)
    const button = screen.getByText('Styled')
    expect(button).not.toHaveStyle({ backgroundColor: 'gray' })
  })


  it('still works when overrideStyles is an invalid class', () => {
    vi.mocked(console).error = vi.fn() // suppress error
    const { container } = render(<ActionButton label="Bad Style" overrideStyles="nonExistentClass" />)
    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('only calls the action once per click', () => {
    const mockFn = vi.fn()
    render(<ActionButton label="Click Once" action={mockFn} />)
    fireEvent.click(screen.getByText('Click Once'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
