import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReservationDetails from '../ReservationDetailsModule/ReservationDetails'
import { vi } from 'vitest'

// Mock FullScreenPopup and ActionButton
vi.mock('../FullScreenPopupModule/FullScreenPopup.jsx', () => ({
  default: ({ isOpen, onClose, children }) =>
    isOpen ? (
      <div data-testid="popup">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
}))

vi.mock('../ActionButtonModule/ActionButton', () => ({
  default: ({ label, action }) => <button onClick={action}>{label}</button>
}))

vi.mock('../../services/apiService.js', () => ({
  makeRoute: (path) => `https://mockapi.dev/${path}`
}))

const mockMeetingDetails = {
  id: 1,
  title: 'Test Meeting',
  room: 'A1',
  date: '2025-04-25',
  getFormattedTimeRange: () => '10:00 AM - 11:00 AM',
  calculateDuration: () => '1 hour',
  status: () => 'Scheduled'
}

describe('ReservationDetails', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders all reservation fields', () => {
    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={vi.fn()} />)

    expect(screen.getByText('Test Meeting')).toBeInTheDocument()
    expect(screen.getByText(/Room:/)).toHaveTextContent('Room: A1')
    expect(screen.getByText(/Date:/)).toHaveTextContent('Date: 2025-04-25')
    expect(screen.getByText(/Time:/)).toHaveTextContent('10:00 AM - 11:00 AM')
    expect(screen.getByText(/Duration:/)).toHaveTextContent('1 hour')
    expect(screen.getByText(/Status:/)).toHaveTextContent('Scheduled')
  })

  it('logs edit action when Edit is clicked', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={vi.fn()} />)

    fireEvent.click(screen.getByText('Edit'))
    expect(logSpy).toHaveBeenCalledWith('Editing Reservation with id: 1')

    logSpy.mockRestore()
  })

  it('calls fetch and shows popup after successful deletion', async () => {
    const mockDeleteData = {
      ...mockMeetingDetails,
      getFormattedTimeRange: () => '10:00 AM - 11:00 AM'
    }

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDeleteData)
      })
    ))

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={vi.fn()} />)

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByTestId('popup')).toBeInTheDocument()
      expect(screen.getByText('Reservation Deleted')).toBeInTheDocument()
      expect(screen.getByText('Title:')).toBeInTheDocument()
    })
  })

  it('calls onDelete and closes popup when closed', async () => {
    const mockDeleteData = {
      ...mockMeetingDetails,
      getFormattedTimeRange: () => '10:00 AM - 11:00 AM'
    }

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDeleteData)
      })
    )

    const onDelete = vi.fn()
    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={onDelete} />)

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByTestId('popup')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Close'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('alerts if deletion fails', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: false, statusText: 'Server Error' })
    ))
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to delete reservation')
    })

    alertSpy.mockRestore()
  })

  it('does not delete if user cancels confirmation', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Delete'))

    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
