import { makeRoute } from '../../services/apiService.js'
import { useState, useEffect } from 'react'
import ReservationDetails from '../../components/ReservationDetailsModule/ReservationDetails'
import { MeetingDetails } from '../../models/MeetingDetails.js'
import styles from './Home.module.css'
import { verifyAndExtractResponsePayload } from '../../services/apiService.js'
import { useUser } from '../../../context/exports/useUser.js'
import Navbar from '../../components/NavbarModule/Navbar.jsx'

function Home() {
  const [meetingCards, setMeetingCards] = useState([]);
  const { user, loading } = useUser()

  
  /**
   * Fetch meeting details for all reservations.
   * @returns {Promise<MeetingDetails[]>} All reservation meeting details in the system.
   */
  const fetchMeetings = async () => {
    try {
      const response = await fetch(makeRoute("reservations"))
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
      <Navbar/>
      <div className={styles.homePage}>
        <header className={styles.pageTitle}>
          Hello, {user?.name || (loading ? "" : "Guest")}
        </header>
      

        {meetingCards.map((meeting, id) => (

          <ReservationDetails
              key={id}
              meetingDetails={meeting}
              onDelete={updateMeetingDetailsList}
          />))
        }
      </div>
    </>
  )
}

export default Home