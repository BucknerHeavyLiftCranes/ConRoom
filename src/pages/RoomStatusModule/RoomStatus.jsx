import React from 'react'
import styles from "./RoomStatus.module.css"
import DateTimeDisplay from '../../components/DateTimeDisplayModule/DateTimeDisplay'

function RoomStatus() {
  return (
    <div className={styles.statusContainer}>
      
      <div className={styles.statusBox}>
        <p className={styles.roomName}>Room: Hillary</p>
        <header className={styles.roomStatus}>CLOSED</header>

      </div>
     
      <div className={styles.infoBox}>
        <DateTimeDisplay/>
        <div className={styles.upcomingMeetingsContainer}>Upcoming</div>
      </div>

    </div>
  )
}

export default RoomStatus