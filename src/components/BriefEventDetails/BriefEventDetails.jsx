// eslint-disable-next-line no-unused-vars
import { OutlookEventDetails } from '../../models/OutlookEventDetails'
import styles from './BriefEventDetails.module.css'
import PropTypes from 'prop-types'

/**
 * Title, date, and time of an event.
 * @param {Object} props
 * @param {OutlookEventDetails[]} [props.events]
 * @param {boolean} [props.eventsLoading]
 * @param {number} [props.timeLeft]
 * @param {boolean} [props.darkMode]
 */
function BriefEventDetails({ events, eventsLoading, timeLeft, darkMode }) {
    if(!events) {
        console.error("NEITHER AN EVENTS[] NOR EMPTY[] WAS RECIEVED");
        return (
            <p style={ darkMode ? { color: 'white' } : { color: 'black' } }>
                <strong><em>No Events Received</em></strong>
            </p>
        )
    }

    if (eventsLoading) {
        return (
            <p style={ darkMode ? { color: 'white', marginBottom: '10px', fontWeight: 'bold' } : { color: 'black', marginBottom: '10px', fontWeight: 'bold' } }>
                {timeLeft === 0 ? "Loading now" : `Loading in: ${timeLeft / 1000} seconds`}
            </p>
        )
    }
    

    events = events.filter(
        (event) => event.status() != "In Progress" && event.status() != "Completed"
    ) // exclude past and ongoing events

    if (events.length === 0){ 
        return (
            <p style={ darkMode ? { color: 'white' } : { color: 'black' } }>
                <strong><em>No Upcoming Meetings</em></strong>
            </p>
        )
    }
 
  return (
    <>
        <p style={darkMode ? { color: 'white', marginBottom: '10px', fontWeight: 'bold' } : { color: 'black', marginBottom: '10px', fontWeight: 'bold' }}>
            Upcoming
        </p>
        {events.map((event) => (
            <div key={event.id} className={darkMode ? styles.eventCardDarkMode: styles.eventCard}>
                <p className={darkMode ? styles.eventDateDarkMode: styles.eventDate}>{event.startDate}</p>
                <div className={styles.eventContent}>
                    <p className={darkMode ? styles.eventTitleDarkMode: styles.eventTitle}>{event.subject}</p>
                    <p className={darkMode ? styles.eventTimeDarkMode: styles.eventTime}>{event.getFormattedTimeRange()}</p>
                </div>
            </div>
        ))}
    </>
  )
}


BriefEventDetails.propTypes = {
    events: PropTypes.array.isRequired,
    eventsLoading: PropTypes.bool.isRequired,
    timeLeft: PropTypes.number.isRequired,
    darkMode: PropTypes.bool.isRequired
}

export default BriefEventDetails