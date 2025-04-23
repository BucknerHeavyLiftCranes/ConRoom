import styles from "./RoomStatus.module.css"
import DateTimeDisplay from '../../components/DateTimeDisplayModule/DateTimeDisplay'
import BriefEventDetails from "../../components/BriefEventDetails/BriefEventDetails.jsx"
import { useEffect, useRef, useState } from "react"
import { fetchWithAuth, verifyAndExtractResponsePayload } from "../../services/apiService.js"
import { makeRoute } from '../../services/apiService.js'
import { OutlookEventDetails } from "../../models/OutlookEventDetails.js"
import { ResponseError } from "../../../errors/ApiError.js"
import { useUser } from "../../../context/exports/useUser.js"
import ActionButton from "../../components/ActionButtonModule/ActionButton.jsx"
import { StaticEventRequest } from "../../models/StaticEventRequest.js"
// eslint-disable-next-line no-unused-vars
import { EventRequest } from "../../models/EventRequest.js"
// eslint-disable-next-line no-unused-vars
import Logo from "../../components/LogoModule/Logo.jsx"
import FullScreenPopup from "../../components/FullScreenPopupModule/FullScreenPopup.jsx"

/**
 * Page displaying the status of a room and its upcoming meetings.
 */
function RoomStatus() {
  const REFRESH_INTERVAL = 10000 //30000 // 30 seconds
  const DEFAULT_EVENT_LENGTH = 30
  const timeLeftRef = useRef(REFRESH_INTERVAL);
  const { user, loading } = useUser()
  const [ timeLeft, setTimeLeft ] = useState(REFRESH_INTERVAL)
  const [ eventsLoading, setEventsLoading ] = useState(true)
  const [ isBusy, setIsBusy ] = useState(false) // isBusy to change styling
  const [ currentStatus, setCurrentStatus ] = useState("OPEN") // currentStatus to display "BUSY"
  const [ currentEvent, setCurrentEvent ] = useState(null) // currentEvent to display current meeting data
  const [ events, setEvents ] = useState([OutlookEventDetails])
  const [ isDisabled, setIsDisabled ] = useState(true)
  const [ isSettingsOpen, setIsSettingsOpen ] = useState(false)
  const [ timeFormat, setTimeFormat ] = useState(() => {
    // Run only on first render
    const savedTimeFormat = localStorage.getItem('timeFormat');
    // checks if format is 12-hour or 24-hour, defaults to 12-hour if neither
    return savedTimeFormat === '12-hour' || savedTimeFormat === '24-hour' ? savedTimeFormat : '12-hour'; 
  })

  const [ isDarkMode, setIsDarkMode ] = useState(() => {
    // Run only on first render
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true'; // Convert string to boolean
  })

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
      // console.log(eventsInfo)
      /** @type {OutlookEventDetails[]} */
      const events = eventsInfo.map((eventInfo) => OutlookEventDetails.fromObject(eventInfo))
      // console.log(events)
      return events
    } catch (err) {
      console.error(err)
      return []
    }
  }

  /**
   * 
   * @param {OutlookEventDetails[]} events All events returned by Outlook.
   * @returns Events sorted by earliest to latest start date.
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
          console.log(event)
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

      // console.log(events)
      return sortEventsByStartTime(events)
    } catch (err) {
      console.error(err)
      return [] 
    } finally {
      setEventsLoading(false)
    }
  }

  // const staticEvent = new StaticEventRequest("Static Meeting", "America/New_York", {}, [], DEFAULT_MEETING_LENGTH)
  // // console.log(staticEvent)
  //  const eventDetails = staticEvent.toOutlookEventDetails()
  // //  console.log("Conflicts: ", eventDetails.conflictsWith(eventDetails))
  // try {
  //   // console.log(tzc.americaNewYorkFormatter.format(new Date(staticEvent.start.dateTime)))
  //   // console.log(staticEvent.start.dateTime)
  // } catch (err) {
  //   console.error(err)
  // }
  
  /**
   * @param {OutlookEventDetails[]} events all events for a room.
   * @returns {boolean} Whether or not a reservation can be made.
   */
  const isReservable = (events) => { // 🚨🚨🚨 CONSIDER REFETCHING EVENTS IN CASE SOMEONE MAKES ONE IN THE 30 SECOND INTERVAL BEFORE THE NEXT SYNC 🚨🚨🚨
    try {
      if (events.length === 0) {
        return true
      }

      // console.log(events.length)
      // console.log("EVENTS:", events[0])

      const staticEvent = new StaticEventRequest("Static Meeting", "America/New_York", {}, [], DEFAULT_EVENT_LENGTH) // even if completed events are returned, don't affect future ones.
      const staticEventDetails = staticEvent.toOutlookEventDetails()
      for (let event of events) {
        // console.log(event)
        if (event.conflictsWith(staticEventDetails)) {
          return false
        }
      }
      return true  
    } catch (err) {
      console.error(err)
      return false // to be safe, disable button if the function breaks
      
    }
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      (async () => {
        try {
          const allEvents = await updateRoomStatus();
          // console.log(isReservable(allEvents))
          setIsDisabled(!isReservable(allEvents))
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

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  useEffect(() => {
    localStorage.setItem('timeFormat', timeFormat);
  }, [timeFormat]);

  const toggleTimeFormat = () => {
    if (timeFormat === '12-hour') {
      setTimeFormat('24-hour')
    } else {
      setTimeFormat('12-hour')
    }
  }

  const makeStaticEvent = async () => {
    // const staticEvent = new StaticEventRequest()
    console.log("Reservation Made!")

    // const newEvent = await fetchWithAuth(makeRoute("/calendar/create"), {

    // })
  }


  return (
    <div className={isDarkMode ? styles.roomStatusContainerDarkMode : styles.roomStatusContainer}>
      <div className={isBusy ? styles.busyStatus : styles.openStatus}>
        <div className={styles.topLine}>
          <p className={styles.roomName}>{user?.name || (loading ? "" : "Guest")}</p>
          <div className={styles.settingsIcon}>
            <Logo
              source="../../../settings_icon_white.png"
              alt="settings icon"
              width={50}
              clickable={true}
              action={() => {setIsSettingsOpen(true)}}
            />
          </div>
        </div>
        
        {/* <p className={styles.roomName}>{user?.name || (loading ? "" : "Guest")}</p> */}

        <div className={currentEvent ?  styles.visibleDetails : styles.hiddenDetails}>
          <p><span>Meeting: </span>{currentEvent ? currentEvent.subject : ""}</p>
          <p><span>Date: </span>
            {currentEvent ?
              (currentEvent.startDate === currentEvent.endDate ? currentEvent.startDate : `${currentEvent.startDate} - ${currentEvent.endDate}`) 
            : ""}
          </p>
          <p><span>Time: </span>{currentEvent ? currentEvent.getFormattedTimeRange() : ""}</p>
          <p><span>Status: </span>{currentEvent ? currentEvent.status() : ""}</p>
        </div>

        <header className={styles.roomStatus}>{currentStatus}</header>

      </div>
     
      <div className={styles.infoBox}>
        <div className={styles.dateTime}>
          <DateTimeDisplay
            format={timeFormat}
            darkMode={isDarkMode}
          />
          </div>
        <div className={styles.upcomingMeetingsContainer}>

          <BriefEventDetails
            events={events}
            eventsLoading={eventsLoading}
            timeLeft={timeLeft}
            darkMode={isDarkMode}
          />

          <ActionButton
            label={`Reserve (${DEFAULT_EVENT_LENGTH} minutes)`}
            action={makeStaticEvent}
            isDisabled={isDisabled}
          />

          {/* <ActionButton
            label={timeFormat === "12-hour" ? "24 Hour Format": "12 Hour Format"}
            action={toggleTimeFormat}
          />

          <ActionButton
            label={isDarkMode ? "Turn On Light Mode" : "Turn On Dark Mode"}
            action={toggleDarkMode}
          /> */}
          
        </div>
      </div>

      <FullScreenPopup isOpen={isSettingsOpen} onClose={() => {setIsSettingsOpen(false)}}>
        <h2 style={{color: "black"}}>Settings</h2>
        <ActionButton
          label={timeFormat === "12-hour" ? "24 Hour Format": "12 Hour Format"}
          action={toggleTimeFormat}
        />

        <ActionButton
          label={isDarkMode ? "Turn On Light Mode" : "Turn On Dark Mode"}
          action={toggleDarkMode}
        />
      </FullScreenPopup>
    </div>
  )
}

export default RoomStatus