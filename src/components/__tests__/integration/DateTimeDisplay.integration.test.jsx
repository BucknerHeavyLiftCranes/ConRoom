import { render, screen, act } from '@testing-library/react'
import DateTimeDisplay from '../../DateTimeDisplayModule/DateTimeDisplay'
import { vi } from 'vitest'

// Mock styles to prevent CSS-related issues
vi.mock('../DateTimeDisplay.module.css', () => ({
  dateTimeDisplay: 'light-wrapper',
  dateTimeDisplayDarkMode: 'dark-wrapper',
  time: 'light-time',
  timeDarkMode: 'dark-time',
  date: 'light-date',
  dateDarkMode: 'dark-date'
}))

describe('DateTimeDisplay Integration Tests', () => {
  const fixedDate = new Date('2025-05-01T14:30:00Z') // 2:30 PM UTC

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // 1
  it('renders in 12-hour format by default', () => {
    render(<DateTimeDisplay format="12-hour" darkMode={false} />)
    expect(screen.getByText('02:30')).toBeInTheDocument()
  })

  // 2
  it('renders in 24-hour format', () => {
    render(<DateTimeDisplay format="24-hour" darkMode={false} />)
    expect(screen.getByText('14:30')).toBeInTheDocument()
  })

  // 3
  it('falls back to 12-hour format if format is invalid', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<DateTimeDisplay format="unknown-format" darkMode={false} />)
    expect(screen.getByText('02:30')).toBeInTheDocument()
    errorSpy.mockRestore()
  })

  // 4
  it('formats date correctly', () => {
    render(<DateTimeDisplay format="12-hour" darkMode={false} />)
    expect(screen.getByText('Thursday, May 01')).toBeInTheDocument()
  })

  // 7
  it('pads 0 properly in single-digit hours/minutes in 12-hour format', () => {
    vi.setSystemTime(new Date('2025-05-01T03:07:00Z')) // 3:07 AM UTC
    render(<DateTimeDisplay format="12-hour" darkMode={false} />)
    expect(screen.getByText('03:07')).toBeInTheDocument()
  })

  // 8
  it('renders 12 instead of 0 in 12-hour format', () => {
    vi.setSystemTime(new Date('2025-05-01T00:15:00Z')) // midnight UTC
    render(<DateTimeDisplay format="12-hour" darkMode={false} />)
    expect(screen.getByText('12:15')).toBeInTheDocument()
  })

  // 9
  it('renders correct 24-hour value for midnight (00:15)', () => {
    vi.setSystemTime(new Date('2025-05-01T00:15:00Z')) // 00:15 UTC
    render(<DateTimeDisplay format="24-hour" darkMode={false} />)
    expect(screen.getByText('00:15')).toBeInTheDocument()
  })

  // 10
  it('updates the displayed time after 1 second', () => {
    render(<DateTimeDisplay format="24-hour" darkMode={false} />)
    expect(screen.getByText('14:30')).toBeInTheDocument()

    act(() => {
      vi.setSystemTime(new Date('2025-05-01T14:31:00Z'))
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('14:31')).toBeInTheDocument()
  })
})
