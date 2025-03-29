import PropTypes from 'prop-types'
import ActionButton from '../ActionButtonModule/ActionButton'
import styles from './ReservationDetails.module.css'
import { reservationKey } from '../../../constants/keys/keys.js'
import { DeleteReservationError } from '../../../errors/ReservationError.js'

function ReservationDetails({ meetingDetails }) {

    const editReservation = (meetingDetails) => {
        console.log(`Editing Reservation with id: ${meetingDetails.id}`) // placeholder logic
    }

    const deleteReservation = async () => {
        try {
            const response = await fetch(`${reservationKey}/${meetingDetails.id}`, {
                method: 'DELETE',
            });
    
            if(!response.ok){
                throw new DeleteReservationError("Error deleting reservation")
            }
            
            const deletedMeeting = await response.json()
            console.log(deletedMeeting)

        } catch (err) {
            console.log({message: err.message, stack: err.stack});
        }


        // console.log(`Deleting Reservation with id: ${meetingDetails.id}`) // placeholder logic
    }

    return (
        <div className={styles.detailsContainer}>
            <h3 className={styles.meetingLabel}>{meetingDetails.title}</h3>
            <p className={styles.roomLabel}><strong>Room:</strong> {meetingDetails.room}</p>
            <p className={styles.dateLabel}><strong>Date:</strong> {meetingDetails.date}</p>
            <p className={styles.timeLabel}><strong>Time:</strong> {meetingDetails.timeSpan}</p>
            <p className={styles.durationLabel}><strong>Duration:</strong> {meetingDetails.duration}</p>
            <p className={styles.statusLabel}><strong>Status:</strong> {meetingDetails.status}</p>
            <div className={styles.buttonControls}>
                <ActionButton 
                    label="Edit"
                    action={() => {editReservation(meetingDetails)}}
                />
                <ActionButton 
                    label="Delete"
                    action={() => {deleteReservation(meetingDetails)}}
                />
            </div>
        </div>
    )
}


ReservationDetails.propTypes = {
    meetingDetails: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        room: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        timeSpan: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      }).isRequired,
};

export default ReservationDetails