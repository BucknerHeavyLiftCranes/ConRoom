import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReservationDetails from '../../ReservationDetailsModule/ReservationDetails'
import { vi } from 'vitest'
import { MeetingDetails } from '../../../models/MeetingDetails.js'
// ✅ Mock styles
vi.mock('../../ReservationDetailsModule/ReservationDetails.module.css', () => ({
  default: {
    detailsContainer: 'container',
    meetingLabel: 'meeting',
    roomLabel: 'room',
    dateLabel: 'date',
    timeLabel: 'time',
    durationLabel: 'duration',
    statusLabel: 'status',
    buttonControls: 'buttons'
  }
}))

// ✅ Mock ActionButton
vi.mock('../../ActionButtonModule/ActionButton', () => ({
  default: ({ label, action }) => <button onClick={action}>{label}</button>
}))

// ✅ Mock FullScreenPopup
vi.mock('../../FullScreenPopupModule/FullScreenPopup', () => ({
  default: ({ isOpen, onClose, children }) =>
    isOpen ? (
      <div>
        <h2>Reservation Deleted</h2>
        <button onClick={onClose}>×</button>
        {children}
      </div>
    ) : null
}))

// ✅ Mock API
vi.mock('../../services/apiService', () => ({
  makeRoute: (url) => `https://mock-api.com/${url}`
}))

const raw = {
  reservationId: 1,
  title: 'Demo Event',
  roomName: 'Room A',
  date: '2025-05-01',
  start: '10:00',
  end: '11:00',
  canceled: false
}

const mockMeeting = MeetingDetails.fromObject(raw)

describe('ReservationDetails Integration Tests', () => {
  beforeEach(() => vi.restoreAllMocks())
  // 2
  it('logs to console when Edit button is clicked', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    render(<ReservationDetails meetingDetails={mockMeeting} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Edit'))
    expect(spy).toHaveBeenCalledWith('Editing Reservation with id: 1')
  })

  // 3
  it('does not delete if confirm is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const onDelete = vi.fn()
    render(<ReservationDetails meetingDetails={mockMeeting} onDelete={onDelete} />)
    fireEvent.click(screen.getByText('Delete'))
    await waitFor(() => {
      expect(screen.queryByText('Reservation Deleted')).not.toBeInTheDocument()
    })
  })


  // 5
  it('calls onDelete with correct id when popup is closed', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(raw)
      })
    )
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const onDelete = vi.fn()
    render(<ReservationDetails meetingDetails={mockMeeting} onDelete={onDelete} />)
    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => fireEvent.click(screen.getByText('×')))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  // 6
  it('alerts when delete API fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, statusText: 'Error 500' })
    )
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<ReservationDetails meetingDetails={mockMeeting} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Failed to delete reservation')
    })
  })


})
