import { render, screen, act } from '@testing-library/react'
import DateTimeDisplay from '../DateTimeDisplayModule/DateTimeDisplay'
import { vi } from 'vitest'

vi.mock('../DateTimeDisplay.module.css', () => ({
  dateTimeDisplay: 'light-wrapper',
  dateTimeDisplayDarkMode: 'dark-wrapper',
  time: 'light-time',
  timeDarkMode: 'dark-time',
  date: 'light-date',
  dateDarkMode: 'dark-date'
}))

describe('DateTimeDisplay', () => {
  const fixedDate = new Date('2025-04-30T14:45:00')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders time in 12-hour format by default', () => {
    render(<DateTimeDisplay format="12-hour" darkMode={false} />)
    expect(screen.getByText('02:45')).toBeInTheDocument()
  })

  it('renders time in 24-hour format', () => {
    render(<DateTimeDisplay format="24-hour" darkMode={false} />)
    expect(screen.getByText('14:45')).toBeInTheDocument()
  })

  it('falls back to 12-hour format if invalid format is passed', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<DateTimeDisplay format="invalid-format" darkMode={false} />)
    expect(screen.getByText('02:45')).toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('renders current date correctly', () => {
    render(<DateTimeDisplay format="12-hour" darkMode={false} />)
    expect(screen.getByText('Wednesday, April 30')).toBeInTheDocument()
  })

  it('pads hours and minutes with leading zeros in 24-hour format', () => {
    vi.setSystemTime(new Date('2025-04-30T03:07:00'))
    render(<DateTimeDisplay format="24-hour" darkMode={false} />)
    expect(screen.getByText('03:07')).toBeInTheDocument()
  })

  it('converts hour 0 to 12 in 12-hour format', () => {
    vi.setSystemTime(new Date('2025-04-30T00:05:00'))
    render(<DateTimeDisplay format="12-hour" darkMode={false} />)
    expect(screen.getByText('12:05')).toBeInTheDocument()
  })

  it('does not crash if darkMode is missing (edge case)', () => {
    // @ts-expect-error: testing missing required prop
    render(<DateTimeDisplay format="12-hour" />)
    expect(screen.getByText('02:45')).toBeInTheDocument()
  })
})
