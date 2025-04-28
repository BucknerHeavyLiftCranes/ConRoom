import { useState } from 'react'
import PropTypes from 'prop-types'
import ActionButton from '../ActionButtonModule/ActionButton'
import FullScreenPopup from '../FullScreenPopupModule/FullScreenPopup.jsx'
import styles from './ReservationDetails.module.css'
import { makeRoute } from '../../services/apiService.js'
import { MeetingDetails } from '../../models/MeetingDetails.js'
// import { checkResponse } from '../../services/authService.js'

/**
 * Reservation details about a given meeting.
 * @param {Object} props
 * @param {MeetingDetails} [props.meetingDetails] details about the meeting.
 * @param {Function} [props.onDelete] handler for deleting the reservation from the UI.
 * @returns a module to display, edit, and delete a meeting.
 */
function ReservationDetails({ meetingDetails, onDelete }) {
    const [deletedMeeting, setDeletedMeeting] = useState(null);
    const editReservation = (meetingDetails) => {
        console.log(`Editing Reservation with id: ${meetingDetails.id}`) // placeholder logic
    }

    const deleteReservation = async () => {
        try {
            if (!(window.confirm(`Are you sure you want to delete this reservation?\nThis action is irreversible!`))) {
                return
            }

            const response = await fetch(makeRoute(`reservations/${meetingDetails.id}`), {
                method: 'DELETE',
            });
    
            // checkResponse(response, `Failed to delete reservation: ${response.statusText}`)
            if (!response.ok) {
                throw new Error(`Failed to delete reservation: ${response.statusText}`);
            }


            let deletedMeetingData = await response.json()
            deletedMeetingData = MeetingDetails.fromObject(deletedMeetingData)
            
            setDeletedMeeting(deletedMeetingData)

        } catch (err) {
            console.error(err.message)
            window.alert("Failed to delete reservation")
        }
    }


    return (
        <div className={styles.detailsContainer}>
            <h3 className={styles.meetingLabel}>{meetingDetails.title}</h3>
            <p className={styles.roomLabel}><strong>Room:</strong> {meetingDetails.room}</p>
            <p className={styles.dateLabel}><strong>Date:</strong> {meetingDetails.date}</p>
            <p className={styles.timeLabel}><strong>Time:</strong> {meetingDetails.getFormattedTimeRange()}</p>
            <p className={styles.durationLabel}><strong>Duration:</strong> {meetingDetails.calculateDuration()}</p>
            <p className={styles.statusLabel}><strong>Status:</strong> {meetingDetails.status()}</p>
            <div className={styles.buttonControls}>
                <ActionButton 
                    label="Edit"
                    action={() => {editReservation(meetingDetails)}}
                />
                <ActionButton 
                    label="Delete"
                    action={() => {deleteReservation()}}
                />
            </div>
            <FullScreenPopup isOpen={deletedMeeting !== null} onClose={() => {
                onDelete(deletedMeeting.id)
                setDeletedMeeting(null)
                }}>
              <h2>Reservation Deleted</h2>
               {deletedMeeting ? (
                   <>
                       <p><strong>Title:</strong> {deletedMeeting.title}</p>
                       <p><strong>Room:</strong> {deletedMeeting.room}</p>
                       <p><strong>Date:</strong> {deletedMeeting.date}</p>
                       <p><strong>Time:</strong> {deletedMeeting.getFormattedTimeRange()}</p>
                   </>
               ) : (
                   <p>Loading...</p>  /* Fallback content while deletedMeeting is null */
               )}
           </FullScreenPopup>
        </div>
    )
}


ReservationDetails.propTypes = {
    meetingDetails: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        room: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        getFormattedTimeRange: PropTypes.func.isRequired,
        calculateDuration: PropTypes.func.isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ReservationDetails