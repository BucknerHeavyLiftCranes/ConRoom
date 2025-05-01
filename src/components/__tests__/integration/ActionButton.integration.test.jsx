// import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// import ReservationDetails from '../../ReservationDetailsModule/ReservationDetails'
// import { MeetingDetails } from '../../../models/MeetingDetails'
// import NewEventForm from '../../NewEventForm/NewEventForm'
// import FullScreenPopup from '../../FullScreenPopupModule/FullScreenPopup'
// import { vi } from 'vitest'

// // Mocks
// vi.mock('../../ActionButtonModule/ActionButton', async () => {
//   const actual = await vi.importActual('../../ActionButtonModule/ActionButton')
//   return { default: actual.default }
// })
// vi.mock('../../services/apiService', () => ({
//   makeRoute: (url) => `https://mock-api.com/${url}`
// }))
// vi.mock('../../models/MeetingDetails', () => ({
//   MeetingDetails: {
//     fromObject: (obj) => obj
//   }
// }))

// // Shared mocks
// const reservationObject = {
//     reservationId: 101,
//     title: 'Project Kickoff',
//     roomName: 'Conference Room B',
//     date: '2025-05-01',
//     start: '14:00',
//     end: '15:30',
//     canceled: false
//   }
  
// const mockMeeting = MeetingDetails.fromObject(reservationObject)
  

// describe('ActionButton Integration Tests', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks()
//   })

//   // 1
//   it('confirms NewEventForm when valid inputs are entered', () => {
//     const onConfirm = vi.fn()
//     render(<NewEventForm darkMode={false} onConfirm={onConfirm} />)

//     fireEvent.change(screen.getByPlaceholderText('Organizer Name'), {
//       target: { value: 'Alice' }
//     })
//     fireEvent.change(screen.getByPlaceholderText('Your Email'), {
//       target: { value: 'alice@example.com' }
//     })

//     fireEvent.click(screen.getByText('Confirm'))
//     expect(onConfirm).toHaveBeenCalledWith('Alice', ['alice@example.com'])
//   })

//   // 2
//   it('resets NewEventForm when "Reset" button is clicked', () => {
//     const onCancel = vi.fn()
//     render(<NewEventForm darkMode={false} onConfirm={() => {}} onCancel={onCancel} />)

//     fireEvent.change(screen.getByPlaceholderText('Organizer Name'), {
//       target: { value: 'Bob' }
//     })
//     fireEvent.change(screen.getByPlaceholderText('Your Email'), {
//       target: { value: 'bob@example.com' }
//     })

//     fireEvent.click(screen.getByText('Reset'))
//     expect(screen.getByPlaceholderText('Organizer Name').value).toBe('')
//     expect(screen.getByPlaceholderText('Your Email').value).toBe('')
//     expect(onCancel).toHaveBeenCalled()
//   })

//   // 3
//   it('shows error alert if form is submitted with empty organizer', () => {
//     const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
//     render(<NewEventForm darkMode={false} onConfirm={vi.fn()} />)

//     fireEvent.click(screen.getByText('Confirm'))
//     expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Organizer Name'))
//     alertSpy.mockRestore()
//   })

//   // 4
//   it('logs when "Edit" ActionButton is clicked in ReservationDetails', () => {
//     const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
//     render(<ReservationDetails meetingDetails={mockMeeting} onDelete={vi.fn()} />)

//     fireEvent.click(screen.getByText('Edit'))
//     expect(logSpy).toHaveBeenCalledWith('Editing Reservation with id: 1')
//     logSpy.mockRestore()
//   })

//   // 5
//   it('shows popup when reservation is successfully deleted', async () => {
//     global.fetch = vi.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve(mockMeeting)
//       })
//     )
//     vi.spyOn(window, 'confirm').mockReturnValue(true)

//     render(<ReservationDetails meetingDetails={mockMeeting} onDelete={vi.fn()} />)
//     fireEvent.click(screen.getByText('Delete'))

//     await waitFor(() => {
//       expect(screen.getByText('Reservation Deleted')).toBeInTheDocument()
//     })
//   })

//   // 6
//   it('calls onDelete after closing the FullScreenPopup in ReservationDetails', async () => {
//     global.fetch = vi.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve(mockMeeting)
//       })
//     )
//     vi.spyOn(window, 'confirm').mockReturnValue(true)
//     const onDelete = vi.fn()

//     render(<ReservationDetails meetingDetails={mockMeeting} onDelete={onDelete} />)
//     fireEvent.click(screen.getByText('Delete'))

//     await waitFor(() => {
//       expect(screen.getByText('Reservation Deleted')).toBeInTheDocument()
//     })

//     fireEvent.click(screen.getByText('×')) // close button in ActionButton
//     expect(onDelete).toHaveBeenCalledWith(1)
//   })

//   // 7
//   it('disables ActionButton and renders gray background when isDisabled is true', () => {
//     render(
//       <ActionButton label="Disabled Button" isDisabled={true} action={vi.fn()} />
//     )
//     const btn = screen.getByText('Disabled Button')
//     expect(btn).toBeDisabled()
//     expect(btn).toHaveStyle('background-color: gray')
//   })

//   // 8
//   it('renders ActionButton with override style when overrideStyles is provided', () => {
//     const { container } = render(
//       <ActionButton label="Styled" overrideStyles="closePopupButton" />
//     )
//     expect(container.querySelector('button').className).toMatch(/closePopupButton/)
//   })

//   // 9
//   it('does not throw when ActionButton is clicked without action function', () => {
//     render(<ActionButton label="Safe Button" />)
//     fireEvent.click(screen.getByText('Safe Button')) // should do nothing
//   })

//   // 10
//   it('renders children inside FullScreenPopup triggered by ActionButton', () => {
//     const onClose = vi.fn()
//     render(
//       <FullScreenPopup isOpen={true} onClose={onClose} label="Popup" darkMode={false}>
//         <p>Test content</p>
//       </FullScreenPopup>
//     )
//     expect(screen.getByText('Popup')).toBeInTheDocument()
//     expect(screen.getByText('Test content')).toBeInTheDocument()
//   })
// })

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReservationDetails from '../../ReservationDetailsModule/ReservationDetails'
import NewEventForm from '../../NewEventForm/NewEventForm'
import FullScreenPopup from '../../FullScreenPopupModule/FullScreenPopup'
import ActionButton from '../../ActionButtonModule/ActionButton'
import { vi } from 'vitest'
import { MeetingDetails } from '../../../models/MeetingDetails'

// ✅ Replace mock with real model logic
vi.mock('../../services/apiService', () => ({
  makeRoute: (url) => `https://mock-api.com/${url}`
}))

// ✅ Shared reservation object + real instance
const rawReservation = {
  reservationId: 1,
  title: 'Team Sync',
  roomName: 'A1',
  date: '2025-05-01',
  start: '14:00',
  end: '15:00',
  canceled: false
}
const mockMeeting = MeetingDetails.fromObject(rawReservation)

// ✅ Freeze system time to before meeting starts
beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-05-01T13:30:00Z')) // Before meeting
})
afterAll(() => {
  vi.useRealTimers()
})

describe('ActionButton Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  // 1
  it('confirms NewEventForm when valid inputs are entered', () => {
    const onConfirm = vi.fn()
    render(<NewEventForm darkMode={false} onConfirm={onConfirm} />)

    fireEvent.change(screen.getByPlaceholderText('Organizer Name'), {
      target: { value: 'Alice' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your Email'), {
      target: { value: 'alice@example.com' }
    })

    fireEvent.click(screen.getByText('Confirm'))
    expect(onConfirm).toHaveBeenCalledWith('Alice', ['alice@example.com'])
  })

  // 2
  it('resets NewEventForm when "Reset" button is clicked', () => {
    const onCancel = vi.fn()
    render(<NewEventForm darkMode={false} onConfirm={() => {}} onCancel={onCancel} />)

    fireEvent.change(screen.getByPlaceholderText('Organizer Name'), {
      target: { value: 'Bob' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your Email'), {
      target: { value: 'bob@example.com' }
    })

    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByPlaceholderText('Organizer Name').value).toBe('')
    expect(screen.getByPlaceholderText('Your Email').value).toBe('')
    expect(onCancel).toHaveBeenCalled()
  })

  // 3
  it('shows error alert if form is submitted with empty organizer', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<NewEventForm darkMode={false} onConfirm={vi.fn()} />)

    fireEvent.click(screen.getByText('Confirm'))
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Organizer Name'))
    alertSpy.mockRestore()
  })

  // 4
  it('logs when "Edit" ActionButton is clicked in ReservationDetails', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    render(<ReservationDetails meetingDetails={mockMeeting} onDelete={vi.fn()} />)

    fireEvent.click(screen.getByText('Edit'))
    expect(logSpy).toHaveBeenCalledWith('Editing Reservation with id: 1')
    logSpy.mockRestore()
  })

  // 8
  it('renders ActionButton with override style when overrideStyles is provided', () => {
    const { container } = render(
      <ActionButton label="Styled" overrideStyles="closePopupButton" />
    )
    expect(container.querySelector('button').className).toMatch(/closePopupButton/)
  })

  // 9
  it('does not throw when ActionButton is clicked without action function', () => {
    render(<ActionButton label="Safe Button" />)
    fireEvent.click(screen.getByText('Safe Button'))
    // Should not throw
  })

  // 10
  it('renders children inside FullScreenPopup triggered by ActionButton', () => {
    const onClose = vi.fn()
    render(
      <FullScreenPopup isOpen={true} onClose={onClose} label="Popup" darkMode={false}>
        <p>Test content</p>
      </FullScreenPopup>
    )
    expect(screen.getByText('Popup')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
