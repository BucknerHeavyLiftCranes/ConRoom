import { render, screen } from '@testing-library/react'
import BriefEventDetails from '../BriefEventDetails/BriefEventDetails'
import { vi } from 'vitest'

const createMockEvent = (overrides = {}) => ({
  id: '1',
  subject: 'Meeting with Team',
  startDate: '2025-05-01',
  getFormattedTimeRange: () => '10:00 AM - 11:00 AM',
  status: () => 'Not Started',
  ...overrides
})

describe('BriefEventDetails', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders "No Events Received" when events is undefined', () => {
    const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<BriefEventDetails events={undefined} eventsLoading={false} timeLeft={5} darkMode={false} />)
    expect(screen.getByText(/No Events Received/i)).toBeInTheDocument()
    logSpy.mockRestore()
  })

  it('renders "Loading now" when loading and timeLeft is 0', () => {
    render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={0} darkMode={false} />)
    expect(screen.getByText('Loading now')).toBeInTheDocument()
  })

  it('renders "Loading in: X seconds" when loading and timeLeft > 0', () => {
    render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={3} darkMode={false} />)
    expect(screen.getByText(/Loading in: 3 seconds/)).toBeInTheDocument()
  })

  it('filters out completed and in-progress events', () => {
    const events = [
      createMockEvent({ id: '1', status: () => 'Completed' }),
      createMockEvent({ id: '2', status: () => 'In Progress' })
    ]
    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={false} />)
    expect(screen.getByText(/No Upcoming Meetings/i)).toBeInTheDocument()
  })

  it('renders upcoming event title and time', () => {
    const events = [createMockEvent()]
    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={false} />)

    expect(screen.getByText('Upcoming Meetings')).toBeInTheDocument()
    expect(screen.getByText('Meeting with Team')).toBeInTheDocument()
    expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument()
  })

  it('applies dark mode styles for loading message', () => {
    const { container } = render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={1} darkMode={true} />)
    expect(container.querySelector('p').style.color).toBe('white')
  })

  it('applies dark mode styles for "No Events Received"', () => {
    const { container } = render(<BriefEventDetails events={undefined} eventsLoading={false} timeLeft={5} darkMode={true} />)
    expect(container.querySelector('p').style.color).toBe('white')
  })

  it('renders with light mode styles by default', () => {
    const { container } = render(<BriefEventDetails events={[]} eventsLoading={true} timeLeft={1} darkMode={false} />)
    expect(container.querySelector('p').style.color).toBe('black')
  })

  it('renders multiple upcoming events', () => {
    const events = [
      createMockEvent({ id: '1', subject: 'A' }),
      createMockEvent({ id: '2', subject: 'B' })
    ]

    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={false} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('does not render anything unexpected in valid render', () => {
    const events = [createMockEvent()]
    render(<BriefEventDetails events={events} eventsLoading={false} timeLeft={0} darkMode={false} />)
    expect(screen.queryByText(/No Events Received/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument()
  })
})
