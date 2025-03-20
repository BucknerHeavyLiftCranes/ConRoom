import PropTypes from 'prop-types'
import ActionButton from '../ActionButtonModule/ActionButton'
import styles from './ReservationDetails.module.css'

function ReservationDetails({ meetingDetails }) {

    const editReservation = (meetingDetails) => {
        console.log(`Editing Reservation with id: ${meetingDetails.id}`) // placeholder logic
    }

    const deleteReservation = () => {
        console.log(`Deleting Reservation with id: ${meetingDetails.id}`) // placeholder logic
    }

    return (
        <div className={styles.detailsContainer}>
            <h3 className={styles.meetingLabel}>{meetingDetails.title}</h3>
            <p className={styles.roomLabel}><strong>Room:</strong> {meetingDetails.room}</p>
            <p className={styles.timeLabel}><strong>Time:</strong> {meetingDetails.time}</p>
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
        time: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      }).isRequired,
};

export default ReservationDetails