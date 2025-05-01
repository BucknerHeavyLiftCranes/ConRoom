
import { render, screen, fireEvent } from '@testing-library/react'
import FullScreenPopup from '../FullScreenPopupModule/FullScreenPopup'

describe('FullScreenPopup', () => {
  const onClose = vi.fn() // Use jest.fn() if using Jest

  beforeEach(() => {
    onClose.mockReset()
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <FullScreenPopup
        isOpen={false}
        onClose={onClose}
        label="Popup Title"
        darkMode={false}
      >
        <p>Content</p>
      </FullScreenPopup>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when isOpen is true', () => {
    render(
      <FullScreenPopup
        isOpen={true}
        onClose={onClose}
        label="Popup Title"
        darkMode={false}
      >
        <p>Content</p>
      </FullScreenPopup>
    )
    expect(screen.getByText('Popup Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('calls onClose when clicking the background overlay', () => {
    const { container } = render(
      <FullScreenPopup
        isOpen={true}
        onClose={onClose}
        label="Popup Title"
        darkMode={false}
      >
        <p>Content</p>
      </FullScreenPopup>
    )
    fireEvent.click(container.firstChild) // outer div = overlay
    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when clicking inside popup', () => {
    const { container } = render(
      <FullScreenPopup
        isOpen={true}
        onClose={onClose}
        label="Popup Title"
        darkMode={false}
      >
        <p>Content</p>
      </FullScreenPopup>
    )

    const popupContent = container.querySelector('div > div') // second div is popup
    fireEvent.click(popupContent)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when clicking the close button', () => {
    render(
      <FullScreenPopup
        isOpen={true}
        onClose={onClose}
        label="Popup Title"
        darkMode={false}
      >
        <p>Content</p>
      </FullScreenPopup>
    )
    const button = screen.getByText('×')
    fireEvent.click(button)
    expect(onClose).toHaveBeenCalled()
  })

  it('applies dark mode styles when darkMode is true', () => {
    const { container } = render(
      <FullScreenPopup
        isOpen={true}
        onClose={onClose}
        label="Popup Title"
        darkMode={true}
      >
        <p>Content</p>
      </FullScreenPopup>
    )
    const popup = container.querySelector('div > div')
    expect(popup.className).toContain('popupDarkMode')

    const heading = screen.getByRole('heading', { name: 'Popup Title' })
    expect(heading.className).toContain('labelDarkMode')
  })
})
