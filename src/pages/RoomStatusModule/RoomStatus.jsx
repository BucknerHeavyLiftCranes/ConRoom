import styles from "./RoomStatus.module.css"
import DateTimeDisplay from '../../components/DateTimeDisplayModule/DateTimeDisplay'
import BriefMeetingDetails from "../../components/BriefMeetingDetails/BriefMeetingDetails"
import { MeetingDetails } from "../../models/MeetingDetails"
import { useEffect, useState } from "react"

/**
 * Page displaying the status of a room and upcoming meetings for a certain time period
 * @param {Object} props 
 * @param {} [props.room] Details about the room being monitored.
 * @returns 
 */
function RoomStatus({ room }) {
  const REFRESH_INTERVAL = 30000 // 30 seconds
  const [isBusy, setIsBusy] = useState(false) // isBusy to change styling
  const [currentStatus, setCurrentStatus] = useState("OPEN") // currentStatus to display "BUSY"
  const [currentMeeting, setCurrentMeeting] = useState(null) // currentMeeting to display current meeting data
  const fakeMeeting1 = new MeetingDetails(
    1, // id
    "Team 5 Daily Scrum", // title
    "Hillary", // room
    "2025-04-03", // date
    "12:30", // start
    "13:30", // end
    false // status
  )

  const fakeMeeting2 = new MeetingDetails(
    2, // id
    "Fidelity Investments Meeting", // title
    "Hillary", // room
    "2025-04-03", // date
    "15:30", // start
    "16:30", // end
    false // status
  )

  const fakeMeeting3 = new MeetingDetails(
    3, // id
    "How to integrate your Fron...", // title
    "Hillary", // room
    "2025-04-04", // date
    "14:00", // start
    "17:00", // end
    false
  )

  const fakeMeeting4 = new MeetingDetails(
    4, // id
    "Ice Cream Social", // title
    "Hillary", // room
    "2025-04-05", // date
    "16:00", // start
    "17:00", // end
    false
  )

  const fakeMeeting5 = new MeetingDetails(
    5, // id
    "Tax Bracket Analysis", // title
    "Hillary", // room
    "2025-04-04", // date
    "00:00", // start
    "01:21", // end
    false
  )

  const fakeMeeting6 = new MeetingDetails(
    6, // id
    "Wine and Cheese Tasting", // title
    "Hillary", // room
    "2025-04-04", // date
    "01:22", // start
    "12:30", // end
    false
  )

  const fakeMeetings = [fakeMeeting1, fakeMeeting2, fakeMeeting3, fakeMeeting4, fakeMeeting5, fakeMeeting6]

  const updateRoomStatus = () => {
    let mustChangeMeeting = false
    
    setCurrentMeeting((prevMeeting) => {
      if (prevMeeting && prevMeeting.status() === "In Progress") {
        return prevMeeting; // Don't update if it's already "In Progress"
      }else{
        mustChangeMeeting = true
      }
    })

    if(!mustChangeMeeting){ //if we don't have to update the meeting, just exit the function
      return
    }
   
    for (let fakeMeeting of fakeMeetings) {
      if (fakeMeeting.status() == "In Progress") { // assuming code works as intended, there can only ever be one 'In Progress' meeting.
        setIsBusy(true)
        setCurrentStatus("BUSY")
        setCurrentMeeting(fakeMeeting)
        break;
      } else {
        setIsBusy(false)
        setCurrentStatus("OPEN")
        setCurrentMeeting(null)
      }
    }
  }


  useEffect(() => {
    const intervalID = setInterval(() => {
      // console.log(currentMeeting ? `${currentMeeting.title} is ${currentMeeting.status()}` : "This room is free")
      updateRoomStatus();
    }, REFRESH_INTERVAL);

    return () => {clearInterval(intervalID)};

  }, []);


  return (
    <div className={styles.roomStatusContainer}>
      
      <div className={isBusy ? styles.busyStatus : styles.openStatus}>
        <p className={styles.roomName}>Hillary</p>

        <div className={currentMeeting ?  styles.visibleDetails : styles.hiddenDetails}>
          <p><span>Meeting: </span>{currentMeeting ? currentMeeting.title : ""}</p>
          <p><span>Duration: </span>{currentMeeting ? currentMeeting.getFormattedTimeRange() : ""}</p>
          <p><span>Status: </span>{currentMeeting ? currentMeeting.status() : ""}</p>
        </div>

        <header className={styles.roomStatus}>{currentStatus}</header>

      </div>
     
      <div className={styles.infoBox}>
        <div className={styles.dateTime}><DateTimeDisplay/></div>
        <p style={{color: 'black'}}>Upcoming</p>
        <div className={styles.upcomingMeetingsContainer}>

          <BriefMeetingDetails
            meetings={fakeMeetings}
          />
          

        </div>
      </div>

    </div>
  )
}

// RoomStatus.propTypes = {
//   room: propType.shape()
// }

export default RoomStatus