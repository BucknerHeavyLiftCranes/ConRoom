import styles from "./RoomStatus.module.css"
import DateTimeDisplay from '../../components/DateTimeDisplayModule/DateTimeDisplay'
import BriefEventDetails from "../../components/BriefMeetingDetails/BriefEventDetails.jsx"
import { useEffect, useRef, useState } from "react"
import { fetchWithAuth, verifyAndExtractResponsePayload } from "../../services/apiService.js"
import { makeRoute } from '../../services/apiService.js'
import { OutlookEventDetails } from "../../models/OutlookEventDetails.js"
import { ResponseError } from "../../../errors/ApiError.js"
import { useUser } from "../../../context/exports/useUser.js"

/**
 * Page displaying the status of a room and upcoming meetings for a certain time period
 * @param {Object} props 
 * @param {} [props.room] Details about the room being monitored.
 * @returns 
 */
function RoomStatus() {
  const REFRESH_INTERVAL = 10000 //30000 // 30 seconds
  const timeLeftRef = useRef(REFRESH_INTERVAL);
  const [ timeLeft, setTimeLeft ] = useState(REFRESH_INTERVAL)
  const { user, loading } = useUser()
  const [eventsLoading, setEventsLoading] = useState(true)
  const [isBusy, setIsBusy] = useState(false) // isBusy to change styling
  const [currentStatus, setCurrentStatus] = useState("OPEN") // currentStatus to display "BUSY"
  const [currentEvent, setCurrentEvent] = useState(null) // currentEvent to display current meeting data
  const [events, setEvents] = useState([])

  /**
   * Fetch all calendar events from Outlook for logged in account.
   * @returns {Promise<OutlookEventDetails[]>} All events
   */
  const getAllEvents = async () => {
    try{
      const response = await fetchWithAuth(makeRoute("calendar/all"));

      /** @type {any[]} */
      const eventsInfo = (await verifyAndExtractResponsePayload(response, "Failed to get current user's information."))
                          .events
      if(!eventsInfo) {
        throw ResponseError("Could not fetch events")
      }

      if (eventsInfo.length === 0) {
        return []
      }
      
      /** @type {OutlookEventDetails[]} */
      const events = eventsInfo.map( (eventInfo) => OutlookEventDetails.fromObject(eventInfo))
      // console.log(events)
      return events
    } catch (err) {
      console.error(err)
      return []
    }
  }

  /**
   * 
   * @param {OutlookEventDetails} events 
   * @returns 
   */
  const sortEventsByStartTime = (events) => {
    return [...events].sort( (eventA, eventB) => {
      return OutlookEventDetails.parseEventDateTime(eventA.start) - OutlookEventDetails.parseEventDateTime(eventB.start)
    })
  }


  /**
   * 
   */
  const updateRoomStatus = async () => {
    try {
      // let mustChangeEvent = false
    
      // setCurrentEvent((prevEvent) => {
      //   if (prevEvent && prevEvent.status() === "In Progress") {
      //     return prevEvent; // Don't update if it's already "In Progress"
      //   }else{
      //     mustChangeEvent = true
      //   }
      // })
    
      const events = await getAllEvents() // where the magic happens (syncing with Outlook)

      if (events.length === 0) {
          setIsBusy(false)
          setCurrentStatus("OPEN")
          setCurrentEvent(null)
          return []
      }

      // console.log(events)

      // if(!mustChangeEvent){ //if we don't have to update the meeting, just exit the function
      //   return events
      // }

      for (let event of events) {
        if (event.status() == "In Progress") { // assuming code works as intended, there can only ever be one 'In Progress' meeting.
          setIsBusy(true)
          setCurrentStatus("BUSY")
          setCurrentEvent(event)
          break;
        } else {
          setIsBusy(false)
          setCurrentStatus("OPEN")
          setCurrentEvent(null)
        }
      }

      return sortEventsByStartTime(events)
    } catch (err) {
      console.error(err)
      return [] 
    } finally {
      setEventsLoading(false)
    }
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      (async () => {
        try {
          const allEvents = await updateRoomStatus();
          setEvents(allEvents);   
        } catch (err) {
          console.error(err)
        }
      })();
    }, REFRESH_INTERVAL);
  
    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(() => {
      if (timeLeftRef.current === 0) {
        timeLeftRef.current = REFRESH_INTERVAL
      }
      timeLeftRef.current -= 1000;
      // console.log("Countdown:", timeLeftRef.current);
      setTimeLeft(timeLeftRef.current);
    }, 1000);
  
    return () => clearInterval(intervalID);
  }, []);

  // if (eventsLoading) {
  //   return (<p className={styles.roomName}>{user?.name || (loading ? "" : "Guest")}</p>)
  // }


  return (
    <div className={styles.roomStatusContainer}>
      <div className={isBusy ? styles.busyStatus : styles.openStatus}>
        <p className={styles.roomName}>{user?.name || (loading ? "" : "Guest")}</p>

        <div className={currentEvent ?  styles.visibleDetails : styles.hiddenDetails}>
          <p><span>Meeting: </span>{currentEvent ? currentEvent.subject : ""}</p>
          <p><span>Duration: </span>{currentEvent ? currentEvent.getFormattedTimeRange() : ""}</p>
          <p><span>Status: </span>{currentEvent ? currentEvent.status() : ""}</p>
        </div>

        <header className={styles.roomStatus}>{currentStatus}</header>

      </div>
     
      <div className={styles.infoBox}>
        <div className={styles.dateTime}><DateTimeDisplay/></div>
        <div className={styles.upcomingMeetingsContainer}>

          <BriefEventDetails
            events={events}
            eventsLoading={eventsLoading}
            timeLeft={timeLeft}
          />
          

        </div>
      </div>

    </div>
  )
}

export default RoomStatus