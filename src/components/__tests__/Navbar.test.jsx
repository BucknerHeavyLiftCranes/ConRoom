import { render, screen } from '@testing-library/react'
import Navbar from '../NavbarModule/Navbar'
import { vi } from 'vitest'

// ✅ Mock Logo component
vi.mock('../LogoModule/Logo', () => ({
  default: ({ source, alt, width }) => (
    <img src={source} alt={alt} width={width} data-testid="mock-logo" />
  )
}))

// ✅ Mock CSS module
vi.mock('../Navbar.module.css', () => ({
  navContainer: 'mock-nav-container',
  logo: 'mock-logo-container',
  navLink: 'mock-nav-link',
}))

describe('Navbar', () => {
  it('renders a <nav> element', () => {
    const { container } = render(<Navbar />)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('renders the Logo component with correct props', () => {
    render(<Navbar />)
    const logo = screen.getByTestId('mock-logo')
    expect(logo).toHaveAttribute('src', '../../../Buckner_Heavylift_Black.png')
    expect(logo).toHaveAttribute('alt', 'Buckner logo in black')
    expect(logo).toHaveAttribute('width', '200')
  })

  it('renders "Room Status" link', () => {
    render(<Navbar />)
    const roomLink = screen.getByText('Room Status')
    expect(roomLink).toBeInTheDocument()
    expect(roomLink).toHaveAttribute('href', '/room')
  })

  it('renders "Logout" link', () => {
    render(<Navbar />)
    const logoutLink = screen.getByText('Logout')
    expect(logoutLink).toBeInTheDocument()
    expect(logoutLink).toHaveAttribute('href', '/logout')
  })

  it('renders two navigation links total', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(2)
  })

  it('does not render any buttons (only links)', () => {
    const { container } = render(<Navbar />)
    expect(container.querySelector('button')).toBeNull()
  })

  it('renders correctly without crashing', () => {
    const { container } = render(<Navbar />)
    expect(container).toBeDefined()
  })
})
