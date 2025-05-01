import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FullScreenPopup from '../../FullScreenPopupModule/FullScreenPopup'
import ReservationDetails from '../../ReservationDetailsModule/ReservationDetails'
import { vi } from 'vitest'
import { MeetingDetails } from '../../../models/MeetingDetails'
// Mock ActionButton styles
vi.mock('../../ActionButtonModule/ActionButton', () => ({
  default: ({ label, action }) => <button onClick={action}>{label}</button>
}))
vi.mock('../../services/apiService', () => ({
  makeRoute: (url) => `https://mock-api.com/${url}`
}))

const reservationObj = {
  reservationId: 77,
  title: 'Dev Sync',
  roomName: 'Conference B',
  date: '2025-05-01',
  start: '13:00',
  end: '14:00',
  canceled: false
}
const meeting = MeetingDetails.fromObject(reservationObj)

describe('FullScreenPopup Integration Tests', () => {
  // 1
  it('renders when isOpen is true', () => {
    render(
      <FullScreenPopup isOpen={true} onClose={vi.fn()} darkMode={false} label="Test Label">
        <p>Child Content</p>
      </FullScreenPopup>
    )
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  // 2
  it('does not render when isOpen is false', () => {
    render(
      <FullScreenPopup isOpen={false} onClose={vi.fn()} darkMode={false}>
        <p>Hidden Content</p>
      </FullScreenPopup>
    )
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument()
  })

  // 3
  it('calls onClose when × button is clicked', () => {
    const onClose = vi.fn()
    render(
      <FullScreenPopup isOpen={true} onClose={onClose} darkMode={false} label="Popup">
        <p>Body</p>
      </FullScreenPopup>
    )
    fireEvent.click(screen.getByText('×'))
    expect(onClose).toHaveBeenCalled()
  })

  // 4
  it('does not render label if label is null', () => {
    render(
      <FullScreenPopup isOpen={true} onClose={vi.fn()} darkMode={false}>
        <p>Hi</p>
      </FullScreenPopup>
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })


  // 6
  it('renders ReservationDetails popup after deletion', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(reservationObj)
      })
    )
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<ReservationDetails meetingDetails={meeting} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Reservation Deleted')).toBeInTheDocument()
    })
  })

  // 8
  it('calls onDelete and resets popup state when closed from ReservationDetails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(reservationObj)
      })
    )
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const onDelete = vi.fn()

    render(<ReservationDetails meetingDetails={meeting} onDelete={onDelete} />)
    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Reservation Deleted')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('×'))
    expect(onDelete).toHaveBeenCalledWith(77)
  })


})
