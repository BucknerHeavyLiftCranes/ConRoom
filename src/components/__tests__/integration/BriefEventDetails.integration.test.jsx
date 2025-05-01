import { render, screen } from '@testing-library/react'
import BriefEventDetails from '../../BriefEventDetails/BriefEventDetails'
import { vi } from 'vitest'

// ✅ Fake OutlookEventDetails shape
const makeEvent = (overrides = {}) => ({
  id: overrides.id || Math.random().toString(36).substring(2),
  subject: overrides.subject || 'Team Sync',
  startDate: overrides.startDate || 'May 1, 2025',
  getFormattedTimeRange: () => overrides.time || '10:00 AM - 11:00 AM',
  status: () => overrides.status || 'Confirmed'
})

describe('BriefEventDetails Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  // 1
  it('renders "No Events Received" when events is undefined', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<BriefEventDetails events={undefined} eventsLoading={false} timeLeft={0} darkMode={false} />)
    expect(screen.getByText(/No Events Received/i)).toBeInTheDocument()
    errorSpy.mockRestore()
  })

  // 2
  it('renders loading message when eventsLoading is true', () => {
    render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={5} darkMode={false} />)
    expect(screen.getByText('Loading in: 5 seconds')).toBeInTheDocument()
  })

  // 3
  it('renders "Loading now" when timeLeft is 0', () => {
    render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={0} darkMode={false} />)
    expect(screen.getByText('Loading now')).toBeInTheDocument()
  })

  // 4
  it('filters out events with "In Progress" and "Completed" statuses', () => {
    const events = [
      makeEvent({ status: 'Completed' }),
      makeEvent({ status: 'In Progress' })
    ]
    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={false} />)
    expect(screen.getByText(/No Upcoming Meetings/i)).toBeInTheDocument()
  })

  // 5
  it('renders a list of upcoming events', () => {
    const events = [
      makeEvent({ id: '1', subject: 'Kickoff', startDate: 'May 1', time: '10:00 AM - 11:00 AM' }),
      makeEvent({ id: '2', subject: 'Review', startDate: 'May 2', time: '1:00 PM - 2:00 PM' })
    ]
    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={false} />)

    expect(screen.getByText('Kickoff')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Upcoming Meetings')).toBeInTheDocument()
  })

  // 6
  it('applies dark mode styling for loading state', () => {
    const { container } = render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={2} darkMode={true} />)
    expect(container.querySelector('p').style.color).toBe('white')
  })

  // 7
  it('applies dark mode styling when showing events', () => {
    const events = [makeEvent({ subject: 'Budget Planning' })]
    const { container } = render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={true} />)
    expect(container.querySelector('h3').className).toMatch(/upcomingLabelDarkMode/)
  })

  // 8
  it('renders "No Upcoming Meetings" when all events are filtered out', () => {
    const events = [
      makeEvent({ status: 'Completed' }),
      makeEvent({ status: 'In Progress' })
    ]
    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={false} />)
    expect(screen.getByText(/No Upcoming Meetings/)).toBeInTheDocument()
  })

  // 9
  it('renders correct event times using getFormattedTimeRange()', () => {
    const events = [
      makeEvent({ subject: 'Planning', time: '9:00 AM - 10:00 AM' }),
    ]
    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={false} />)
    expect(screen.getByText('9:00 AM - 10:00 AM')).toBeInTheDocument()
  })

  // 10
  it('renders black text in light mode fallback when events undefined', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(<BriefEventDetails events={undefined} eventsLoading={false} timeLeft={0} darkMode={false} />)
    expect(container.querySelector('p').style.color).toBe('black')
    errorSpy.mockRestore()
  })
})
