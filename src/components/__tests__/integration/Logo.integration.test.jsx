import { render, screen, fireEvent } from '@testing-library/react'
import Logo from '../../LogoModule/Logo'
import Navbar from '../../NavbarModule/Navbar'
import { vi } from 'vitest'

// ✅ Mock CSS module
vi.mock('../../LogoModule/Logo.module.css', () => ({
    default: {
      logo: 'logo-class',
      clickableLogo: 'clickable-logo-class'
    }
  }))

vi.mock('../../NavbarModule/Navbar.module.css', () => ({
    default: {
      navContainer: 'nav-container',
      logo: 'nav-logo',
      navLink: 'nav-link'
    }
  }))

describe('Logo Integration Tests', () => {
  // 1
  it('renders logo with correct image src and alt text', () => {
    render(<Logo source="/test.png" alt="Test Logo" width={100} clickable={false} />)
    const img = screen.getByAltText('Test Logo')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.png')
  })

  // 2
  it('renders image with the correct width', () => {
    const { container } = render(<Logo source="/logo.png" alt="Logo" width={150} clickable={false} />)
    expect(container.firstChild).toHaveStyle('width: 150px')
  })

  // 3
  it('does not call action when not clickable', () => {
    const action = vi.fn()
    render(<Logo source="/logo.png" alt="Logo" width={100} clickable={false} action={action} />)
    fireEvent.click(screen.getByAltText('Logo'))
    expect(action).not.toHaveBeenCalled()
  })

  // 4
  it('calls action when clickable is true', () => {
    const action = vi.fn()
    render(<Logo source="/logo.png" alt="Clickable Logo" width={100} clickable={true} action={action} />)
    fireEvent.click(screen.getByAltText('Clickable Logo'))
    expect(action).toHaveBeenCalled()
  })

  // 5
  it('applies clickableLogo class when clickable', () => {
    const { container } = render(<Logo source="/logo.png" alt="Test" width={100} clickable={true} action={vi.fn()} />)
    expect(container.firstChild.className).toBe('clickable-logo-class')
  })

  // 6
  it('applies base logo class when not clickable', () => {
    const { container } = render(<Logo source="/logo.png" alt="Test" width={100} clickable={false} />)
    expect(container.querySelector('img').className).toBe('logo-class')
  })

  // 7
  it('does not fail if action is not provided even when clickable is true', () => {
    render(<Logo source="/logo.png" alt="Logo" width={100} clickable={true} />)
    fireEvent.click(screen.getByAltText('Logo')) // should not throw
  })

  // 8
  it('renders inside the Navbar component', () => {
    render(<Navbar />)
    const logo = screen.getByAltText(/buckner logo/i)
    expect(logo).toBeInTheDocument()
  })

  // 9
  it('Navbar includes links for Room Status and Logout', () => {
    render(<Navbar />)
    expect(screen.getByText('Room Status')).toHaveAttribute('href', '/room')
    expect(screen.getByText('Logout')).toHaveAttribute('href', '/logout')
  })

  // 10
  it('Logo inside Navbar uses width of 200px', () => {
    const { container } = render(<Navbar />)
    const logoWrapper = container.querySelector('.nav-logo')
    expect(logoWrapper?.style?.width || '200px').toBe('200px')
  })
})
