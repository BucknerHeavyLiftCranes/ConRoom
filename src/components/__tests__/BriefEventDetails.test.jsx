import { render, screen } from '@testing-library/react'
import BriefEventDetails from '../BriefEventDetails/BriefEventDetails'

// Create mock OutlookEventDetails
const mockEvent = (overridqes = {}) => ({
  id: '1',
  subject: 'Team Sync',
  startDate: '2025-04-25',
  getFormattedTimeRange: () => '10:00 AM - 11:00 AM',
  status: () => 'Not Started',
  ...overrides
})

describe('BriefEventDetails', () => {
  it('renders fallback message when events is undefined', () => {
    render(<BriefEventDetails events={undefined} eventsLoading={false} timeLeft={5} darkMode={false} />)
    expect(screen.getByText(/No Events Received/i)).toBeInTheDocument()
  })

  it('shows loading message with countdown', () => {
    render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={3} darkMode={false} />)
    expect(screen.getByText(/Loading in: 3 seconds/i)).toBeInTheDocument()
  })

  it('shows "Loading now" when timeLeft is 0', () => {
    render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={0} darkMode={false} />)
    expect(screen.getByText(/Loading now/i)).toBeInTheDocument()
  })

  it('filters out "In Progress" and "Completed" events and shows no upcoming message', () => {
    const events = [
      mockEvent({ id: '1', status: () => 'In Progress' }),
      mockEvent({ id: '2', status: () => 'Completed' })
    ]

    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={5} darkMode={false} />)
    expect(screen.getByText(/No Upcoming Meetings/i)).toBeInTheDocument()
  })

  it('renders upcoming events', () => {
    const events = [
      mockEvent({ id: '1', subject: 'Meeting A' }),
      mockEvent({ id: '2', subject: 'Meeting B' }),
    ]

    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={5} darkMode={false} />)

    expect(screen.getByText('Upcoming Meetings')).toBeInTheDocument()
    expect(screen.getByText('Meeting A')).toBeInTheDocument()
    expect(screen.getByText('Meeting B')).toBeInTheDocument()
    expect(screen.getAllByText('10:00 AM - 11:00 AM')).toHaveLength(2)
  })

  it('renders with dark mode styles', () => {
    const events = [mockEvent()]
    const { container } = render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={true} />)

    const label = screen.getByText(/Upcoming Meetings/i)
    expect(label.className).toMatch(/upcomingLabelDarkMode/)

    const eventTitle = screen.getByText('Team Sync')
    expect(eventTitle.className).toMatch(/eventTitleDarkMode/)
  })
})
