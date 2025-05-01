import { render, screen, fireEvent } from '@testing-library/react'
import FullScreenPopup from '../FullScreenPopupModule/FullScreenPopup'
import { vi } from 'vitest'

// Mock ActionButton to isolate tests
vi.mock('../ActionButtonModule/ActionButton', () => ({
  default: ({ label, action }) => (
    <button onClick={action} data-testid="mock-close-btn">{label}</button>
  )
}))

vi.mock('../FullScreenPopup.module.css', () => ({
  overlay: 'overlay-style',
  popup: 'popup-light',
  popupDarkMode: 'popup-dark',
  label: 'label-light',
  labelDarkMode: 'label-dark',
  closeButtonContainer: 'close-container',
}))

describe('FullScreenPopup', () => {
  const baseProps = {
    isOpen: true,
    onClose: vi.fn(),
    label: 'Test Popup',
    darkMode: false,
    children: <p>Popup Content</p>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(<FullScreenPopup {...baseProps} isOpen={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders when isOpen is true', () => {
    render(<FullScreenPopup {...baseProps} />)
    expect(screen.getByText('Popup Content')).toBeInTheDocument()
  })

  it('renders the label if provided', () => {
    render(<FullScreenPopup {...baseProps} />)
    expect(screen.getByText('Test Popup')).toBeInTheDocument()
  })

  it('does not render a label when empty string is provided', () => {
    const { queryByRole } = render(<FullScreenPopup {...baseProps} label="" />)
    expect(queryByRole('heading')).toBeNull()
  })

  it('calls onClose when close button is clicked', () => {
    render(<FullScreenPopup {...baseProps} />)
    fireEvent.click(screen.getByTestId('mock-close-btn'))
    expect(baseProps.onClose).toHaveBeenCalled()
  })

  it('renders children properly inside popup', () => {
    render(<FullScreenPopup {...baseProps}><span>Custom Child</span></FullScreenPopup>)
    expect(screen.getByText('Custom Child')).toBeInTheDocument()
  })

  it('renders h2 element when label is present', () => {
    render(<FullScreenPopup {...baseProps} />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })
})
