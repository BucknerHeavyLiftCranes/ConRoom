import { render, screen, fireEvent } from '@testing-library/react'
import NewEventForm from '../../NewEventForm/NewEventForm'
import { vi } from 'vitest'

// ✅ Mock styles to avoid CSS errors
vi.mock('../../NewEventForm/NewEventForm.module.css', () => ({
  default: {
    formContainer: 'light-form',
    formContainerDarkMode: 'dark-form',
    organizerInput: 'org-input',
    organizerInputDarkMode: 'org-input-dark',
    attendeeInput: 'att-input',
    attendeeInputDarkMode: 'att-input-dark',
    attendeeRow: 'attendee-row',
    attendeeSection: 'attendee-section',
    removeBtn: 'remove',
    addBtn: 'add',
    controlButtons: 'ctrl-btns'
  }
}))

vi.mock('../../ActionButtonModule/ActionButton', () => ({
  default: ({ label, action }) => (
    <button onClick={action} data-testid={`btn-${label}`}>
      {label}
    </button>
  )
}))

describe('NewEventForm Integration Tests', () => {
  // 1
  it('renders organizer and one attendee input by default', () => {
    render(<NewEventForm onConfirm={vi.fn()} onCancel={vi.fn()} darkMode={false} />)
    expect(screen.getByPlaceholderText('Organizer Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
  })

  // 2
  it('updates organizer input value correctly', () => {
    render(<NewEventForm onConfirm={vi.fn()} onCancel={vi.fn()} darkMode={false} />)
    const input = screen.getByPlaceholderText('Organizer Name')
    fireEvent.change(input, { target: { value: 'Alice' } })
    expect(input.value).toBe('Alice')
  })

  // 3
  it('adds a new attendee input when + is clicked', () => {
    render(<NewEventForm onConfirm={vi.fn()} onCancel={vi.fn()} darkMode={false} />)
    fireEvent.click(screen.getByText('+'))
    expect(screen.getByPlaceholderText('Attendee 1 Email')).toBeInTheDocument()
  })

  // 4
  it('removes an attendee input (but not the last one)', () => {
    render(<NewEventForm onConfirm={vi.fn()} onCancel={vi.fn()} darkMode={false} />)
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getAllByText('−')[1])
    expect(screen.queryByPlaceholderText('Attendee 1 Email')).not.toBeInTheDocument()
  })

  // 5
  it('does not remove the last remaining attendee input', () => {
    render(<NewEventForm onConfirm={vi.fn()} onCancel={vi.fn()} darkMode={false} />)
    fireEvent.click(screen.getByText('−'))
    expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
  })

  // 6
  it('alerts if organizer is missing on confirm', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<NewEventForm onConfirm={vi.fn()} onCancel={vi.fn()} darkMode={false} />)
    fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByTestId('btn-Confirm'))
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Organizer Name'))
    alertSpy.mockRestore()
  })

  // 7
  it('alerts if an attendee email is missing on confirm', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<NewEventForm onConfirm={vi.fn()} onCancel={vi.fn()} darkMode={false} />)
    fireEvent.change(screen.getByPlaceholderText('Organizer Name'), { target: { value: 'Alice' } })
    fireEvent.click(screen.getByTestId('btn-Confirm'))
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Your Email'))
    alertSpy.mockRestore()
  })

  // 8
  it('calls onConfirm with correct data when inputs are valid', () => {
    const onConfirm = vi.fn()
    render(<NewEventForm onConfirm={onConfirm} onCancel={vi.fn()} darkMode={false} />)
    fireEvent.change(screen.getByPlaceholderText('Organizer Name'), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'a@b.com' } })
    fireEvent.click(screen.getByTestId('btn-Confirm'))
    expect(onConfirm).toHaveBeenCalledWith('Alice', ['a@b.com'])
  })

  // 9
  it('calls onCancel and resets inputs when reset is clicked', () => {
    const onCancel = vi.fn()
    render(<NewEventForm onConfirm={vi.fn()} onCancel={onCancel} darkMode={false} />)
    fireEvent.change(screen.getByPlaceholderText('Organizer Name'), { target: { value: 'Reset Me' } })
    fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'reset@x.com' } })
    fireEvent.click(screen.getByTestId('btn-Reset'))
    expect(screen.getByPlaceholderText('Organizer Name').value).toBe('')
    expect(screen.getByPlaceholderText('Your Email').value).toBe('')
    expect(onCancel).toHaveBeenCalled()
  })

  // 10
  it('renders dark mode styles when darkMode is true', () => {
    const { container } = render(<NewEventForm onConfirm={vi.fn()} onCancel={vi.fn()} darkMode={true} />)
    expect(container.firstChild.className).toBe('dark-form')
  })
})
