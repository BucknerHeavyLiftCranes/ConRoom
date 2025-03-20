import ActionButton from '../../components/ActionButtonModule/ActionButton'
import ReservationDetails from '../../components/ReservationDetailsModule/ReservationDetails'
import { MeetingDetails } from '../../models/MeetingDetails.js'
import styles from './Home.module.css'

function Home() {

  const startExternalLogin = () => {
    console.log("Start log in!")
  }

  const fakeMeetingDetails1 = new MeetingDetails(1, "All-Hands Meeting", "Tarheel", "09:00 AM - 10:30 AM", "01:30:00", "Complete")
  const fakeMeetingDetails2 = new MeetingDetails(2, "UI Team Weekly Scrum", "Wolfpack", "11:00 AM - 11:45 AM", "00:45:00", "Ongoing")
  const fakeMeetingDetails3 = new MeetingDetails(3, "Team Strategy Meeting", "Aggies", "02:30 PM - 03:30 AM", "01:00:00", "Pending")
  

  

  return (
    <>
      <h1 className={styles.pageTitle}>Home</h1>
      <div>
        This is the home page
      </div>    
      <ActionButton 
        label="Log In"
        action={startExternalLogin}
      />

      <ReservationDetails 
        meetingDetails={fakeMeetingDetails1}
      />

      <ReservationDetails 
        meetingDetails={fakeMeetingDetails2}
      />

      <ReservationDetails 
        meetingDetails={fakeMeetingDetails3}
      />
    </>
  )
}

export default Home