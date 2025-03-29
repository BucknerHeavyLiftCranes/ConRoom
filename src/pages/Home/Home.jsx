import { rootKey } from '../../../keys/keys.js'
import { useState, useEffect } from 'react'
import ActionButton from '../../components/ActionButtonModule/ActionButton'
import ReservationDetails from '../../components/ReservationDetailsModule/ReservationDetails'
import { MeetingDetails } from '../../models/MeetingDetails.js'
import styles from './Home.module.css'
import { StaticReservationResquest } from '../../models/StaticReservationResquest.js'

function Home() {
  const [meetingCards, setMeetingCards] = useState([]);



  const startExternalLogin = async () => {
    // try {
    //   console.log("Start log in!")
    //   const response = await fetch(baseKey)

    //   if (response.ok){
    //     const testData = await response.json()
    //     console.log(testData)
    //   }
    // } catch (error) {
    //   console.log(error)
      
    // }

    console.log("SIGN IN")

  }

  /**
   * Fetch meeting details for all reservation.
   * @returns {Promise<MeetingDetails[]>} all reservation meeting details in the system.
   */
  async function fetchMeetings(){
    try {
      const response = await fetch(rootKey)
      // console.log(response)

      if (!response.ok){
        throw new Error("Couldn't fetch meeting details")
      }

      /** @type {any[]} */
      const allMeetings = await response.json()

      return allMeetings.map(data => 
        new MeetingDetails(
          data.reservationId,
          data.title,
          data.roomName,
          data.date,
          data.startTime,
          data.endTime,
          data.status
        )
      )

    } catch (err) {
      console.log({message: err.message, stack: err.stack});
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
  

  let shortMeeting = new StaticReservationResquest(
    "Short Meeting",
    "Twinnings",
    "mimi@abc.com",
    "11:00",
    90
  )

  console.log(shortMeeting)
  // const fakeMeetingDetails1 = new MeetingDetails(1, "All-Hands Meeting", "Tarheel", "09:00 AM - 10:30 AM", "01:30:00", "Complete")
  // const fakeMeetingDetails2 = new MeetingDetails(2, "UI Team Weekly Scrum", "Wolfpack", "11:00 AM - 11:45 AM", "00:45:00", "Ongoing")
  // const fakeMeetingDetails3 = new MeetingDetails(3, "Team Strategy Meeting", "Aggies", "02:30 PM - 03:30 AM", "01:00:00", "Pending")
  

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

      {meetingCards.map((meeting, id) => (

        <ReservationDetails
            key={id}
            meetingDetails={meeting}
        />
      ))}

      {/* <ReservationDetails 
        meetingDetails={fakeMeetingDetails1}
      />

      <ReservationDetails 
        meetingDetails={fakeMeetingDetails2}
      />

      <ReservationDetails 
        meetingDetails={fakeMeetingDetails3}
      /> */}
    </>
  )
}

export default Home