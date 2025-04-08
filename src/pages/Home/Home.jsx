import { reservationKey } from '../../../constants/keys/keys.js'
import { useState, useEffect } from 'react'
import ReservationDetails from '../../components/ReservationDetailsModule/ReservationDetails'
import { MeetingDetails } from '../../models/MeetingDetails.js'
import styles from './Home.module.css'
import DateTimeDisplay from '../../components/DateTimeDisplayModule/DateTimeDisplay.jsx'
import { requestAccessToken } from '../../services/authService.js'

function Home() {
  const [meetingCards, setMeetingCards] = useState([]);

  const getAccessToken = async () => {
    const params = new URLSearchParams(window.location.search);
    /** @type {string} authorization code given by Microsoft to be exchanged for a token. */
    const authCode = params.get("code");
    // requestAccessToken(authCode)

  }

  useEffect(() => {
    getAccessToken()
  }, []);
  

  /**
   * Fetch meeting details for all reservations.
   * @returns {Promise<MeetingDetails[]>} All reservation meeting details in the system.
   */
  const fetchMeetings = async () => {
    try {
      const response = await fetch(reservationKey)
      // console.log(response)

      if (!response.ok){
        throw new Error("Couldn't fetch meeting details")
      }

      /** @type {any[]} */
      const allMeetings = await response.json()

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


  return (
    <>
      <DateTimeDisplay/>
      <h1 className={styles.pageTitle}>Home</h1>    

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