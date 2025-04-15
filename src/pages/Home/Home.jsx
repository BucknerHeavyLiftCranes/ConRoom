import { adminKey, reservationKey } from '../../../constants/keys/keys.js'
import { useState, useEffect } from 'react'
import ReservationDetails from '../../components/ReservationDetailsModule/ReservationDetails'
import { MeetingDetails } from '../../models/MeetingDetails.js'
import styles from './Home.module.css'
import DateTimeDisplay from '../../components/DateTimeDisplayModule/DateTimeDisplay.jsx'
import { verifyAndExtractResponsePayload, fetchWithAuth } from '../../services/apiService.js'
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
      const response = await fetch(reservationKey)
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

  // const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6InJUVFYxYzQ5VnFHNTJtZ1NYWkZuS0RPcVFaM0hxVmtTQXd3emg0ekh0YmMiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yNTBlZTU3OS00YmYzLTQxNzYtYTJjNS00NTVjZTBhM2MyNDEvIiwiaWF0IjoxNzQ0Mzg4MTMwLCJuYmYiOjE3NDQzODgxMzAsImV4cCI6MTc0NDM5Mzc5OCwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsicDEiLCJ1cm46dXNlcjpyZWdpc3RlcnNlY3VyaXR5aW5mbyJdLCJhaW8iOiJBV1FBbS84WkFBQUF1UXBwY0xMaTN5Wm5WUFVQRE9reitaZXV3dnArYWo1SEhqMWVlVDI1TGg2V2pFMU0wYkVVeWtvQ2NIbVJYcGN0ZEw0U3hoOWRWRnVIcm94TjdvbHdrSldhK1Q5ckJaL1lmaFZ6Y3k5RHdTWjdwNVVQYlo3cDFwRmNCa0ZIOEpUQiIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiT3BlbklEZm9ySVRJIiwiYXBwaWQiOiJkODcyMzMyMi1hNzhhLTQ0MGMtOTE3ZC1jMmM4MzQ2ZmQzMzUiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IlRlYW0iLCJnaXZlbl9uYW1lIjoiVU5DIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTUyLjIzLjExMS45NSIsIm5hbWUiOiJVTkMgVGVhbSIsIm9pZCI6ImI4YzlmMDRkLTExMDAtNDNhYy05YjI0LWY5YTE4ODZhZjZhMSIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzMjAwMzUwNDE4MjM5IiwicmgiOiIxLkFWZ0FlZVVPSmZOTGRrR2l4VVZjNEtQQ1FRTUFBQUFBQUFBQXdBQUFBQUFBQUFCWUFMcFlBQS4iLCJzY3AiOiJVc2VyLlJlYWQgcHJvZmlsZSBvcGVuaWQgZW1haWwiLCJzaWQiOiIwMDMyODk5OS0wZDkxLThjMTctMTlhMC01NjE0NWU5MjE2NjQiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJlc0JfdG85dHhOSVJUVlBiR0EyVm9aRDJhS1Z0ZU8zV3g5eWxvR0kwU1JVIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiMjUwZWU1NzktNGJmMy00MTc2LWEyYzUtNDU1Y2UwYTNjMjQxIiwidW5pcXVlX25hbWUiOiJ1bmN0ZWFtQGJ1Y2tuZXJoZWF2eWxpZnQuY29tIiwidXBuIjoidW5jdGVhbUBidWNrbmVyaGVhdnlsaWZ0LmNvbSIsInV0aSI6IlZhbDllN2N4T0VDY1dQUWEycmMtQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfZnRkIjoidE1CZVlVdk5oQXhpSk4zS1c4bVhuRHc1SHdqd1ZVSWhWZFZLSW5pdW05byIsInhtc19pZHJlbCI6IjI2IDEiLCJ4bXNfc3QiOnsic3ViIjoibXNNVHR6XzNmWFVYeVdaOGx5cEJIR21FaDN5MXA1TFFvSFVEUzdUSHp2dyJ9LCJ4bXNfdGNkdCI6MTQzNzY2NjY5N30.UERVsBNu2syMBgEcZlKxcIuFLF7DMjYJwfeKFOHdVOKkEssLIK3Kz1NIfu4DUoGoNXBcr1nZZbOWe8BLFoCyofnS3x5R9sv_IfYG27ulHDblzQFhLj2EOU9v_pVqhbc6nS4smsjTqBT7pP20LCz4zL3WxlZ9zWkcaOueset1zI_TAU7Y2CTiRPYI_LpXanIvWTnx2YHqvql3bp7Rn6jMGCJhiQdBdbQXsXQn4VDi-Nm3LzTo8d1ukbQCrPvCFWfHKJO7mgkfrv879iz3YVjmkcqMzYPkinjH5YXR-3Hr6z1PJxjhTujK0qE13rLVnBHOaVtjdkgIotHJN4nPBmDGBg"

  const getUserInfo = async () => {
    const response = await fetchWithAuth(`${adminKey}/current`);

    const userInfo = await verifyAndExtractResponsePayload(response, "Failed to get current user's information.")
    console.log(userInfo)
  }


  return (
    <>
      <div className={styles.dateTime}><DateTimeDisplay/></div>
      <h1 className={styles.pageTitle}>Home</h1>
      <header className={styles.pageTitle}>
        {user?.name || (loading ? "" : "Guest")}
      </header>
      <ActionButton
        label='Log User Info'
        action={getUserInfo}
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