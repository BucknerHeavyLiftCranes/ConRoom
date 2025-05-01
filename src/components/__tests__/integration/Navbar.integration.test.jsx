import { render, screen } from '@testing-library/react'
import Navbar from '../../NavbarModule/Navbar'
import { vi } from 'vitest'

// ✅ Mock CSS modules properly
vi.mock('../../NavbarModule/Navbar.module.css', () => ({
  default: {
    navContainer: 'nav-container',
    logo: 'nav-logo',
    navLink: 'nav-link'
  }
}))

// ✅ Mock Logo to track props and avoid loading real image
vi.mock('../../LogoModule/Logo', () => ({
  default: ({ source, alt, width }) => (
    <img src={source} alt={alt} width={width} data-testid="mock-logo" />
  )
}))

describe('Navbar Integration Tests', () => {
  // 1
  it('renders the nav container with correct class', () => {
    const { container } = render(<Navbar />)
    expect(container.querySelector('nav')).toHaveClass('nav-container')
  })

  // 2
  it('renders the Logo component', () => {
    render(<Navbar />)
    const logo = screen.getByTestId('mock-logo')
    expect(logo).toBeInTheDocument()
  })

  // 3
  it('passes correct props to Logo', () => {
    render(<Navbar />)
    const logo = screen.getByAltText('Buckner logo in black')
    expect(logo).toHaveAttribute('src', '../../../Buckner_Heavylift_Black.png')
    expect(logo).toHaveAttribute('width', '200')
  })

  // 4
  it('applies logo wrapper class from CSS module', () => {
    const { container } = render(<Navbar />)
    expect(container.querySelector('.nav-logo')).toBeInTheDocument()
  })

  // 5
  it('includes a link to the Room Status page', () => {
    render(<Navbar />)
    const link = screen.getByText('Room Status')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/room')
  })

  // 6
  it('includes a link to the Logout page', () => {
    render(<Navbar />)
    const link = screen.getByText('Logout')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/logout')
  })

  // 7
  it('applies navLink class to each navigation link', () => {
    const { container } = render(<Navbar />)
    const links = container.querySelectorAll('a')
    links.forEach(link => {
      expect(link).toHaveClass('nav-link')
    })
  })

  // 8
  it('renders exactly two navigation links', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(2)
  })

  // 9
  it('logo renders before navigation links', () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')
    const firstChild = nav.firstElementChild
    expect(firstChild).toHaveClass('nav-logo')
  })

  // 10
  it('navigation links appear in expected order', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('Room Status')
    expect(links[1]).toHaveTextContent('Logout')
  })
})
