import { render, screen, fireEvent } from '@testing-library/react'
import Logo from '../LogoModule/Logo'
import { vi } from 'vitest'

// Mock the CSS module
vi.mock('../Logo.module.css', () => ({
  logo: 'mock-logo-class',
  clickableLogo: 'mock-clickable-class'
}))

describe('Logo Component', () => {
  const baseProps = {
    source: 'https://example.com/logo.png',
    alt: 'Company Logo',
    width: 150,
    clickable: false,
    action: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders an image with correct src and alt', () => {
    render(<Logo {...baseProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', baseProps.source)
    expect(img).toHaveAttribute('alt', baseProps.alt)
  })

  it('applies correct width to container div', () => {
    const { container } = render(<Logo {...baseProps} />)
    expect(container.firstChild).toHaveStyle(`width: ${baseProps.width}px`)
  })

  it('does not apply clickable class when clickable is false', () => {
    const { container } = render(<Logo {...baseProps} clickable={false} />)
    expect(container.firstChild.className).not.toContain('mock-clickable-class')
  })

  it('calls action when clickable and clicked', () => {
    render(<Logo {...baseProps} clickable={true} />)
    fireEvent.click(screen.getByRole('img').parentElement)
    expect(baseProps.action).toHaveBeenCalled()
  })

  it('does not call action when clickable is false', () => {
    render(<Logo {...baseProps} clickable={false} />)
    fireEvent.click(screen.getByRole('img').parentElement)
    expect(baseProps.action).not.toHaveBeenCalled()
  })

  it('does not throw when clickable is true but action is undefined', () => {
    const props = { ...baseProps, clickable: true, action: undefined }
    render(<Logo {...props} />)
    fireEvent.click(screen.getByRole('img').parentElement)
    // Passes if it doesn't crash
  })

  it('renders alt text correctly for screen readers', () => {
    render(<Logo {...baseProps} />)
    expect(screen.getByAltText(baseProps.alt)).toBeInTheDocument()
  })

  it('supports dynamic width changes', () => {
    const { rerender, container } = render(<Logo {...baseProps} width={100} />)
    expect(container.firstChild).toHaveStyle('width: 100px')

    rerender(<Logo {...baseProps} width={200} />)
    expect(container.firstChild).toHaveStyle('width: 200px')
  })
})
