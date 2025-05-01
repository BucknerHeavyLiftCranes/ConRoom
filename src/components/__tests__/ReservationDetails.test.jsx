import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReservationDetails from '../ReservationDetailsModule/ReservationDetails'
import { vi } from 'vitest'

// Mock external components and modules
vi.mock('../ActionButtonModule/ActionButton', () => ({
  default: ({ label, action }) => (
    <button onClick={action} data-testid={`btn-${label.toLowerCase()}`}>{label}</button>
  )
}))

vi.mock('../FullScreenPopupModule/FullScreenPopup.jsx', () => ({
  default: ({ isOpen, onClose, children }) =>
    isOpen ? (
      <div data-testid="popup">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
}))

vi.mock('../../services/apiService.js', () => ({
  makeRoute: (route) => `https://mock-api.com/${route}`
}))

vi.mock('../../models/MeetingDetails.js', () => ({
  MeetingDetails: {
    fromObject: vi.fn((data) => data)
  }
}))

const mockMeetingDetails = {
  id: 1,
  title: 'Weekly Sync',
  room: 'A1',
  date: '2025-05-01',
  getFormattedTimeRange: () => '10:00 AM - 11:00 AM',
  calculateDuration: () => '1 hour',
  status: () => 'Scheduled'
}

describe('ReservationDetails', () => {
  const onDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs when edit button is clicked', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={onDelete} />)
    fireEvent.click(screen.getByTestId('btn-edit'))
    expect(logSpy).toHaveBeenCalledWith('Editing Reservation with id: 1')
    logSpy.mockRestore()
  })

  it('shows popup after successful deletion', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockMeetingDetails })
      })
    )
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={onDelete} />)
    fireEvent.click(screen.getByTestId('btn-delete'))

    await waitFor(() => {
      expect(screen.getByTestId('popup')).toBeInTheDocument()
      expect(screen.getByText('Reservation Deleted')).toBeInTheDocument()
      expect(screen.getByText('Title:')).toBeInTheDocument()
    })
  })

  it('calls onDelete and closes popup on close', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockMeetingDetails })
      })
    )
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={onDelete} />)
    fireEvent.click(screen.getByTestId('btn-delete'))

    await waitFor(() => {
      expect(screen.getByTestId('popup')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Close'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('does not delete if user cancels confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    global.fetch = vi.fn()

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={onDelete} />)
    fireEvent.click(screen.getByTestId('btn-delete'))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('alerts when deletion fails', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Bad Request'
      })
    ))

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={onDelete} />)
    fireEvent.click(screen.getByTestId('btn-delete'))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to delete reservation')
    })
  })

  it('calls correct route when deleting', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMeetingDetails)
      })
    )
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={onDelete} />)
    fireEvent.click(screen.getByTestId('btn-delete'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://mock-api.com/reservations/1', expect.anything())
    })
  })

  it('does not throw when response has no JSON body', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      })
    )
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<ReservationDetails meetingDetails={mockMeetingDetails} onDelete={onDelete} />)
    fireEvent.click(screen.getByTestId('btn-delete'))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to delete reservation')
    })
  })
})
