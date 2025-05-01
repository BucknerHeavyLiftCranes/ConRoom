import { render, screen, act } from '@testing-library/react'
import DateTimeDisplay from '../DateTimeDisplayModule/DateTimeDisplay'
import { vi } from 'vitest'

describe('DateTimeDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers() // Use jest.useFakeTimers() for Jest
    vi.setSystemTime(new Date('2025-04-25T14:45:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders time and date in 12-hour format by default', () => {
    render(<DateTimeDisplay format="12-hour" darkMode={false} />)

    // 2:45 PM in 12-hour => "02:45"
    expect(screen.getByText('02:45')).toBeInTheDocument()
    expect(screen.getByText(/Friday, April 25/)).toBeInTheDocument()
  })

  it('renders time in 24-hour format', () => {
    render(<DateTimeDisplay format="24-hour" darkMode={false} />)
    expect(screen.getByText('14:45')).toBeInTheDocument()
  })

  it('falls back to 12-hour on invalid format', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(<DateTimeDisplay format="not-a-format" darkMode={false} />)
    expect(screen.getByText('02:45')).toBeInTheDocument()

    spy.mockRestore()
    logSpy.mockRestore()
  })

  it('applies dark mode styles', () => {
    const { container } = render(<DateTimeDisplay format="12-hour" darkMode={true} />)
    const wrapper = container.firstChild
    expect(wrapper.className).toContain('dateTimeDisplayDarkMode')
  })

  it('updates time every second', () => {
    render(<DateTimeDisplay format="24-hour" darkMode={false} />)

    expect(screen.getByText('14:45')).toBeInTheDocument()

    // Simulate 1 minute passing
    act(() => {
      vi.setSystemTime(new Date('2025-04-25T14:46:00'))
      vi.advanceTimersByTime(60 * 1000)
    })

    expect(screen.getByText('14:46')).toBeInTheDocument()
  })
})
