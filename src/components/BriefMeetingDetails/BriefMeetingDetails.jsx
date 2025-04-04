// eslint-disable-next-line no-unused-vars
import { MeetingDetails } from '../../models/MeetingDetails'
import styles from './BriefMeetingDetails.module.css'
import PropTypes from 'prop-types'

/**
 * Title and time for all reservations in a room within a certain date range.
 * @param {Object} props
 * @param {MeetingDetails[]} [props.meetings] List of meetings for the next few days
 */
function BriefMeetingDetails({ meetings }) {
    meetings = meetings.filter(
        (meeting) => meeting.status() != "In Progress" && meeting.status() != "Completed"
    ) // exclude past and ongoing meetings
 
  return (
    <>
        {meetings.length !== 0 ? (meetings.map((meeting) => (
                <div 
                key={meeting.id}
                className={styles.detailsContainer}>
                    <p className={styles.meetingDate}>{meeting.date}</p>
                    <div className={styles.titleAndTime}>
                        <p className={styles.meetingTitle}>{meeting.title}</p>
                        <p className={styles.meetingTime}>{meeting.getFormattedTimeRange()}</p>
                    </div>
                </div> // eventually, turn this into a React component
            
        ))
        ) : (
                <p><strong><em>No Meetings</em></strong></p>
            )
        }
        
    </>
  )
}


BriefMeetingDetails.propTypes = {
    meetings: PropTypes.array.isRequired
}

export default BriefMeetingDetails