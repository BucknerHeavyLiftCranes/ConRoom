import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './NewEventForm.module.css';
import ActionButton from '../ActionButtonModule/ActionButton';

/**
 * A simple event form for creating static events.
 * @param {Object} props
 * @param {Function} [props.onConfirm] function to be run once event details are confirmed.
 * @param {Function} [props.onCancel] function to be run if user cancels static event creation.
 * @param {boolean} [props.darkMode] Whether the page theme is on is in light or dark mode.
 */
function NewEventForm({ onConfirm, onCancel, darkMode }) {
  const [organizer, setOrganizer] = useState('');
  const [attendees, setAttendees] = useState(['']); // start with one attendee input

  const updateAttendee = (index, value) => {
    const newAttendees = [...attendees];
    newAttendees[index] = value;
    setAttendees(newAttendees);
  };

  const addAttendee = () => {
    setAttendees([...attendees, '']);
  };

  const removeAttendee = (index) => {
    if (attendees.length === 1) {
        return // prevent removing the last input
    }
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const validateEntries = () => {
    if (organizer === "") {
        alert(`Please enter a value for 'Organizer Name'`);
      return false;
    }
    
    const emptyIndexes = attendees
      .map((email, index) => ({ email, index }))
      .filter(({ email }) => !email.trim());
  
    if (emptyIndexes.length > 0) {
      const firstEmpty = emptyIndexes[0].index;
      const label = firstEmpty === 0 ? "'Your Email'" : `'Attendee ${firstEmpty} Email'`;
      alert(`Please enter a value for ${label}`);
      return false;
    }
  
    return true;
  };
  

  /**
   * Reset the event form and perform other actions if provided by calling component.
   * @param {Function} onCancelFn action provided by caller component (for actions to be done outside the event form)
   */
  const handleOnCancel = (onCancelFn) => {
    setOrganizer('')
    setAttendees([''])
    if (onCancelFn && typeof onCancelFn == "function") {
        onCancelFn()
    }
  }

  /**
   * Reset the event form and perform other actions if provided by calling component.
   * @param {Function} onConfirmFn action provided by caller component (for actions to be done outside the event form)
   */
  const handleOnConfirm = (onConfirmFn) => {
    if (validateEntries()) {
        if (onConfirmFn && typeof onConfirmFn == "function") {
            onConfirmFn()
        }
    }
  }

  return (
    <div className={darkMode ? styles.formContainerDarkMode : styles.formContainer}>
        <h3 style={darkMode ? {color: "white", width: "100%", textAlign: "center"} : {color: "black", width: "100%", textAlign: "center"}}>
            New Event
        </h3>
        <input
          type="text"
          placeholder="Organizer Name"
          value={organizer}
          required
          onChange={(e) => setOrganizer(e.target.value)}
          className={darkMode ? styles.organizerInputDarkMode : styles.organizerInput}
        />

      <div className={styles.attendeeSection}>
        {attendees.map((attendee, index) => (
          <div key={index} className={styles.attendeeRow}>
            <input
              type="email"
              placeholder={index === 0 ? "Your Email" : `Attendee ${index} Email`}
              value={attendee}
              required
              onChange={(e) => updateAttendee(index, e.target.value)}
              className={darkMode ? styles.attendeeInputDarkMode : styles.attendeeInput}
            />
            <button onClick={() => removeAttendee(index)} className={styles.removeBtn}>−</button>
            {index === attendees.length - 1 && (
              <button onClick={addAttendee} className={styles.addBtn}>+</button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.controlButtons}>
        {/* <button onClick={() => onConfirm({ organizer, attendees })} className={styles.confirmBtn}>
          Confirm
        </button>
        <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button> */}
        <ActionButton
            label='Confirm'
            action={() => { handleOnConfirm( () => { onConfirm( organizer, attendees ) } ) }}
        />
        <ActionButton
            label='Reset'
            action={() => {handleOnCancel(onCancel)}}
        />
      </div>
    </div>
  );
}

NewEventForm.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    darkMode: PropTypes.bool.isRequired
}

export default NewEventForm;
