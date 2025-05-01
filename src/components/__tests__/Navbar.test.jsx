import { render, screen } from '@testing-library/react'
import Navbar from '../NavbarModule/Navbar'

// Mock the Logo component to isolate Navbar
vi.mock('../LogoModule/Logo', () => ({
  default: ({ source, alt, width }) => (
    <img src={source} alt={alt} width={width} data-testid="mock-logo" />
  )
}))

describe('Navbar', () => {
  it('renders the navigation bar container', () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()
  })

  it('renders the logo with correct props', () => {
    render(<Navbar />)
    const logo = screen.getByTestId('mock-logo')
    expect(logo).toHaveAttribute('src', '../../../Buckner_Heavylift_Black.png')
    expect(logo).toHaveAttribute('alt', 'Buckner logo in black')
    expect(logo).toHaveAttribute('width', '200')
  })

  it('renders navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('Room Status')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('navigation links have correct hrefs', () => {
    render(<Navbar />)
    expect(screen.getByText('Room Status')).toHaveAttribute('href', '/room')
    expect(screen.getByText('Logout')).toHaveAttribute('href', '/logout')
  })
})
