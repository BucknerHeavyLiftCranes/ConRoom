import { makeRoute } from '../../services/apiService.js'
import { useState, useEffect } from 'react'
import ReservationDetails from '../../components/ReservationDetailsModule/ReservationDetails'
import { MeetingDetails } from '../../models/MeetingDetails.js'
import styles from './Home.module.css'
import DateTimeDisplay from '../../components/DateTimeDisplayModule/DateTimeDisplay.jsx'
import { verifyAndExtractResponsePayload } from '../../services/apiService.js'
import ActionButton from '../../components/ActionButtonModule/ActionButton.jsx'
import { useUser } from '../../../context/exports/useUser.js'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [meetingCards, setMeetingCards] = useState([]);
  const { user, loading } = useUser()
  const navigate = useNavigate()
  
  /**
   * Fetch meeting details for all reservations.
   * @returns {Promise<MeetingDetails[]>} All reservation meeting details in the system.
   */
  const fetchMeetings = async () => {
    try {
      const response = await fetch(makeRoute("reservations"))
      // console.log(response)

      // if (!response.ok){
      //   throw new Error("Couldn't fetch meeting details")
      // }

      /** @type {any[]} */
      const allMeetings = await verifyAndExtractResponsePayload(response, "Couldn't fetch meeting details")//await response.json()

      return allMeetings.map(data => 
        MeetingDetails.fromObject(data)
      )

    } catch (err) {
      console.log({message: err.message, stack: err.stack});
      window.alert(err.message, err.stack)
        return [] // Return an empty array to avoid issues if fetch fails
    }
  }

  useEffect(() => {
    const getMeetings = async () => {
      try {
        const meetings = await fetchMeetings();
        setMeetingCards(meetings)
      } catch (err) {
        console.log({message: err.message, stack: err.stack});
      }
    };
  
    getMeetings();
  }, []);
  
  
  const updateMeetingDetailsList = (reservationId) => {
    setMeetingCards(prevMeetings =>
      prevMeetings.filter(meeting => meeting.id !== reservationId)
    );
  };

  // const getUserInfo = async () => {
  //   const response = await fetchWithAuth(makeRoute("admin/current"));

  //   const userInfo = await verifyAndExtractResponsePayload(response, "Failed to get current user's information.")
  //   console.log(userInfo)
  // }

  // const getAllEvents = async () => {
  //   const response = await fetchWithAuth(makeRoute("calendar/all"));

  //   const eventsInfo = await verifyAndExtractResponsePayload(response, "Failed to get current user's information.")
  //   console.log(eventsInfo)
  // }



  return (
    <>
      <div className={styles.dateTime}><DateTimeDisplay/></div>
      <h1 className={styles.pageTitle}>Home</h1>
      <header className={styles.pageTitle}>
        {user?.name || (loading ? "" : "Guest")}
      </header>
      <ActionButton
        label='See Room Status'
        action={() => {setTimeout(() => {navigate('/room')}, 800)}}
      />

      <ActionButton
        label='Log Out'
        action={() => {setTimeout(() => {navigate('/logout')}, 800)}}
      />
    

      {meetingCards.map((meeting, id) => (

        <ReservationDetails
            key={id}
            meetingDetails={meeting}
            onDelete={updateMeetingDetailsList}
        />
      ))}
    </>
  )
}

export default Home