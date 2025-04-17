// eslint-disable-next-line no-unused-vars
import { OutlookEventDetails } from '../../models/OutlookEventDetails'
import styles from './BriefEventDetails.module.css'
import PropTypes from 'prop-types'

/**
 * Title and time for all reservations in a room within a certain date range.
 * @param {Object} props
 * @param {OutlookEventDetails[]} [props.events] List of events
 */
function BriefEventDetails({ events, eventsLoading, timeLeft }) {
    if(!events) {
        console.error("NEITHER AN EVENTS[] NOR EMPTY[] WAS RECIEVED");
        return <p><strong><em>No Events Today</em></strong></p>
    }

    if (eventsLoading) {
        return (
            <p style={{ color: 'black', marginBottom: '10px', fontWeight: 'bold' }}>
                {timeLeft === 0 ? "Loading now" : `Loading in: ${timeLeft / 1000} seconds`}
            </p>)
    }
    
    if (events.length === 0){ 
        return <p><strong><em>No Events Today</em></strong></p>
    }

    events = events.filter(
        (event) => event.status() != "In Progress" && event.status() != "Completed"
    ) // exclude past and ongoing events
 
  return (
    // <>
    //     <p style={{color: 'black'}}>Upcoming</p>
    //     {events.map((event) => (
    //                 <div 
    //                 key={event.id}
    //                 className={styles.detailsContainer}>
    //                     <p className={styles.eventDate}>{event.startDate}</p>
    //                     <div className={styles.titleAndTime}>
    //                         <p className={styles.eventTitle}>{event.subject}</p>
    //                         <p className={styles.eventTime}>{event.getFormattedTimeRange()}</p>
    //                     </div>
    //                 </div> // eventually, turn this into a React component           
    //             ))
    //     }
        
    // </>
    <>
        <p style={{ color: 'black', marginBottom: '10px', fontWeight: 'bold' }}>Upcoming</p>
        {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
                <p className={styles.eventDate}>{event.startDate}</p>
                <div className={styles.eventContent}>
                    <p className={styles.eventTitle}>{event.subject}</p>
                    <p className={styles.eventTime}>{event.getFormattedTimeRange()}</p>
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
}

export default BriefEventDetails