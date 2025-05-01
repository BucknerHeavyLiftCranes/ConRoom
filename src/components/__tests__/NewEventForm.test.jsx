import { render, screen, fireEvent } from '@testing-library/react'
import NewEventForm from '../NewEventForm/NewEventForm'
import { vi } from 'vitest'

vi.mock('../ActionButtonModule/ActionButton', () => ({
  default: ({ label, action }) => (
    <button onClick={action} data-testid={`btn-${label.toLowerCase()}`}>{label}</button>
  )
}))

vi.mock('../NewEventForm.module.css', () => ({
  formContainer: 'form-light',
  formContainerDarkMode: 'form-dark',
  organizerInput: 'organizer-light',
  organizerInputDarkMode: 'organizer-dark',
  attendeeInput: 'attendee-light',
  attendeeInputDarkMode: 'attendee-dark',
  attendeeRow: 'row',
  attendeeSection: 'section',
  removeBtn: 'remove',
  addBtn: 'add',
  controlButtons: 'controls',
}))

describe('NewEventForm', () => {
  const confirmMock = vi.fn()
  const cancelMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and initial inputs', () => {
    render(<NewEventForm onConfirm={confirmMock} onCancel={cancelMock} darkMode={false} />)
    expect(screen.getByText('New Event')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Organizer Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
  })

  it('adds a new attendee input when "+" is clicked', () => {
    render(<NewEventForm onConfirm={confirmMock} onCancel={cancelMock} darkMode={false} />)
    fireEvent.click(screen.getByText('+'))
    expect(screen.getByPlaceholderText('Attendee 1 Email')).toBeInTheDocument()
  })

  it('removes an attendee input when "−" is clicked (but not the last one)', () => {
    render(<NewEventForm onConfirm={confirmMock} onCancel={cancelMock} darkMode={false} />)
    fireEvent.click(screen.getByText('+'))
    const removeButtons = screen.getAllByText('−')
    fireEvent.click(removeButtons[1]) // remove second input
    expect(screen.queryByPlaceholderText('Attendee 1 Email')).not.toBeInTheDocument()
  })

  it('does not remove the last attendee input', () => {
    render(<NewEventForm onConfirm={confirmMock} onCancel={cancelMock} darkMode={false} />)
    fireEvent.click(screen.getByText('−')) // only one input
    expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
  })

  it('calls onCancel and resets form when "Reset" is clicked', () => {
    render(<NewEventForm onConfirm={confirmMock} onCancel={cancelMock} darkMode={false} />)
    fireEvent.change(screen.getByPlaceholderText('Organizer Name'), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'alice@test.com' } })
    fireEvent.click(screen.getByTestId('btn-reset'))
    expect(screen.getByPlaceholderText('Organizer Name').value).toBe('')
    expect(screen.getByPlaceholderText('Your Email').value).toBe('')
    expect(cancelMock).toHaveBeenCalled()
  })

  it('shows alert if organizer is empty on confirm', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<NewEventForm onConfirm={confirmMock} onCancel={cancelMock} darkMode={false} />)
    fireEvent.click(screen.getByTestId('btn-confirm'))
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Organizer Name"))
    alertSpy.mockRestore()
  })

  it('shows alert if an attendee email is missing on confirm', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<NewEventForm onConfirm={confirmMock} onCancel={cancelMock} darkMode={false} />)
    fireEvent.change(screen.getByPlaceholderText('Organizer Name'), { target: { value: 'Alice' } })
    fireEvent.click(screen.getByTestId('btn-confirm'))
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Your Email"))
    alertSpy.mockRestore()
  })

  it('calls onConfirm with organizer and attendees when inputs are valid', () => {
    render(<NewEventForm onConfirm={confirmMock} onCancel={cancelMock} darkMode={false} />)
    fireEvent.change(screen.getByPlaceholderText('Organizer Name'), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'alice@example.com' } })
    fireEvent.click(screen.getByTestId('btn-confirm'))
    expect(confirmMock).toHaveBeenCalledWith('Alice', ['alice@example.com'])
  })

})
