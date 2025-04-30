import styles from "./RoomStatus.module.css"
import DateTimeDisplay from '../../components/DateTimeDisplayModule/DateTimeDisplay'
import BriefEventDetails from "../../components/BriefEventDetails/BriefEventDetails.jsx"
import { useEffect, useRef, useState } from "react"
import { fetchWithAuth, validateAndExtractResponsePayload } from "../../services/apiService.js"
import { makeRoute } from '../../services/apiService.js'
import { OutlookEventDetails } from "../../models/OutlookEventDetails.js"
import { ResponseError } from "../../../errors/ApiError.js"
import { useUser } from "../../../context/exports/useUser.js"
import ActionButton from "../../components/ActionButtonModule/ActionButton.jsx"
import { StaticEventRequest } from "../../models/StaticEventRequest.js"
import Logo from "../../components/LogoModule/Logo.jsx"
import FullScreenPopup from "../../components/FullScreenPopupModule/FullScreenPopup.jsx"
import NewEventForm from "../../components/NewEventForm/NewEventForm.jsx"

/**
 * Page displaying the status of a room and its upcoming meetings.
 */
function RoomStatus() {
  // Outlook calendar sync interval.
  const SYNC_INTERVAL = 10000 //30000 // 30 seconds

  // length of a static meeting (in minutes).
  const DEFAULT_EVENT_LENGTH = 30

  // Room open hour
  const OPEN_HOUR = 8

  // Room close hour
  const CLOSE_HOUR = 9

  // track time left until events recieved from Outlook.
  const timeLeftRef = useRef(SYNC_INTERVAL / 1000);

  // track logged-in user info.
  const { user, loading } = useUser() 

  // track (in real time) time left until events recieved from Outlook.
  const [ timeLeft, setTimeLeft ] = useState(SYNC_INTERVAL / 1000) 

  // track if events have been received from Outlook.
  const [ eventsLoading, setEventsLoading ] = useState(true)

  // track if room is in use to change styling.
  const [ isBusy, setIsBusy ] = useState(false) 

  // currentStatus to display "IN USE".
  const [ currentStatus, setCurrentStatus ] = useState("OPEN")

  // currentEvent to display current meeting data.
  const [ currentEvent, setCurrentEvent ] = useState(null) 

  // track the events received from Outlook calendar.
  const [ events, setEvents ] = useState([OutlookEventDetails])

  // track if reservation button can be clicked.
  const [ isDisabled, setIsDisabled ] = useState(true)

  // track if settings panel has been opened.
  const [ isSettingsOpen, setIsSettingsOpen ] = useState(false) 

  // track if settings panel has been opened.
  const [ isEventFormOpen, setIsEventFormOpen ] = useState(false) 

  // track (in real time) the closed status of a room
  // const isRoomClosedRef = useRef(isInvalidBusinessHours()) 🚨 UNCOMMENT THIS FOR THE ABILITY TO CLOSE ROOMS 🚨

  // track if room is closed (a.k.a outside of business hours).
  // const [ isRoomClosed, setIsRoomClosed ] = useState(isRoomClosedRef.current) 🚨 UNCOMMENT THIS FOR THE ABILITY TO CLOSE ROOMS 🚨

  // track user's time format preference.
  const [ timeFormat, setTimeFormat ] = useState(() => {
    // Run only on first render
    const savedTimeFormat = localStorage.getItem('timeFormat');
    // checks if format is 12-hour or 24-hour, defaults to 12-hour if neither
    return savedTimeFormat === '12-hour' || savedTimeFormat === '24-hour' ? savedTimeFormat : '12-hour'; 
  })

  // track user's theme preference.
  const [ isDarkMode, setIsDarkMode ] = useState(() => {
    // Run only on first render
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true'; // Convert string to boolean
  })

  /**
   * Fetch all calendar events from Outlook.
   * @returns {Promise<OutlookEventDetails[]>} All events
   */
  const getAllEvents = async () => {
    try{
      const response = await fetchWithAuth(makeRoute("calendar/all"));

      /** @type {any[]} */
      const eventsInfo = (await validateAndExtractResponsePayload(response, "Failed to get current user's information."))

      if(!eventsInfo) {
        throw new ResponseError("Could not fetch events")
      }

      if (eventsInfo.length === 0) {
        return []
      }
      /** @type {OutlookEventDetails[]} */
      const events = eventsInfo.map((eventInfo) => OutlookEventDetails.fromObject(eventInfo))
      return events
    } catch (err) {
      console.error(err.message)
      return []
    }
  }


  /**
   * Check if room is outside of business hours (closed).
   * @returns {boolean} True, if room is closed. Else, false.
   */
  // eslint-disable-next-line no-unused-vars
  function isInvalidBusinessHours() {
    const now = new Date()

    const openTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), OPEN_HOUR, 0, 0)
    const closeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), CLOSE_HOUR, 0, 0)
    // console.log(currentTime)
    // i.e. !(13 > 9 &&  13 < 17) = !true = false
    return !(now > openTime && now < closeTime)
  }


  /**
   * Determine if a static reservation can be made.
   * @param {OutlookEventDetails[]} events All events for a room.
   * @returns {boolean} Whether or not a reservation can be made.
   */
  const isReservable = (events) => { // 🚨🚨🚨 CONSIDER REFETCHING EVENTS IN CASE SOMEONE MAKES ONE IN THE 30 SECOND INTERVAL BEFORE THE NEXT SYNC 🚨🚨🚨
    try {
      if (events.length === 0) {
        return true
      }

      const staticEvent = new StaticEventRequest("Static Meeting", {}, [], DEFAULT_EVENT_LENGTH) // even if completed events are returned, don't affect future ones.
      const staticEventDetails = staticEvent.toOutlookEventDetails()

      for (let event of events) {
        if (event.conflictsWith(staticEventDetails)) {
          return false
        }
      }
      return true  
    } catch (err) {
      console.error(err.message)
      return false // to be safe, disable button if the function breaks
      
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
   * Update the status of the page.
   */
  const updateRoomStatus = async () => {
    try {
      const events = await getAllEvents() // where the magic happens (syncing with Outlook)

      if (events.length === 0) {
          setIsBusy(false)
          setCurrentStatus("OPEN")
          setCurrentEvent(null)
          return []
      }

      // if (isRoomClosedRef.current) {
      //   setIsBusy(false)
      //   setCurrentStatus("CLOSED")
      //   setCurrentEvent(null)
      // } else {
        for (let event of events) {
          if (event.status() == "In Progress") { // assuming code works as intended, there can only ever be one 'In Progress' meeting.
            setIsBusy(true)
            setCurrentStatus("IN USE")
            setCurrentEvent(event)
            break;
          } else {
            setIsBusy(false)
            setCurrentStatus("OPEN")
            setCurrentEvent(null)
          }
        }
      // }

      return sortEventsByStartTime(events)
    } catch (err) {
      console.error(err.message)
      return [] 
    } finally {
      setEventsLoading(false)
    }
  }


  // console.log("Room Open:", isRoomOpen())

  useEffect(() => {
    const intervalID = setInterval(() => {
      (async () => {
        try {
          // isRoomClosedRef.current = isInvalidBusinessHours()
          const allEvents = await updateRoomStatus();
          setIsDisabled(!isReservable(allEvents)) //setIsDisabled(!isReservable(allEvents) || isInvalidBusinessHours()) // if there's an upcoming meeting or room is closed
          setEvents(allEvents); 
          // setIsRoomClosed(isRoomClosedRef.current)
        } catch (err) {
          console.error(err.message)
        }
      })();
    }, SYNC_INTERVAL);
  
    return () => clearInterval(intervalID);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Create sync countdown for when the webpage first loads. */
  useEffect(() => {
    const intervalID = setInterval(() => {
      if (timeLeftRef.current === 0) {
        timeLeftRef.current = (SYNC_INTERVAL / 1000)
      }
      timeLeftRef.current -= 1;
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

  /**
   * Create a new event in Outlook calendar
   * @param {string} organizer name of the event creator.
   * @param {string[]} attendees emails of all the attendees.
   */
  const makeStaticEvent = async (organizer, attendees) => {
    try {
      /** @type {any[]} list of attendees for the meeting (including the organizer) */
      const attendeesEmails = attendees.map( (attendee) => {
        return {
          emailAddress: {
            address: attendee,
          },
          // type: 'required'
        }
      })

      const staticEvent = new StaticEventRequest(organizer, {displayName: user.name}, attendeesEmails, DEFAULT_EVENT_LENGTH)
      const response = await fetchWithAuth(makeRoute("calendar/create"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(staticEvent)
      })
  
      await validateAndExtractResponsePayload(response, "Failed to add new meeting") // nothing is done with the data but reponse must still be validated.
      setIsDisabled(true)
      setIsEventFormOpen(false)
    } catch (err) {
        console.error(err.message)
    }
  }



  return (
    <div className={isDarkMode ? styles.roomStatusContainerDarkMode : styles.roomStatusContainer}>
      <div className={eventsLoading ? styles.loadingStatus : 
        (/*isRoomClosed ? styles.closedStatus : */
          (isBusy ? styles.busyStatus : styles.openStatus))}>
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
          <p className={styles.decreaseUnderspace}><span>Subject: </span>{currentEvent ? currentEvent.subject : ""}</p>
          <p className={styles.decreaseUnderspace}><span>Date: </span>
            {currentEvent ?
              (currentEvent.startDate === currentEvent.endDate ? currentEvent.startDate : `${currentEvent.startDate} - ${currentEvent.endDate}`) 
            : ""}
          </p>
          <p className={styles.decreaseUnderspace}><span>Time: </span>{currentEvent ? currentEvent.getFormattedTimeRange() : ""}</p>
          <p className={styles.decreaseUnderspace}><span>Status: </span>{currentEvent ? currentEvent.status() : ""}</p>
        </div>

        <header className={styles.roomStatus}>{eventsLoading ? timeLeft : currentStatus}</header>

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
        
        </div>

        <div style={{margin: "auto"}} className={styles.reserveButton}>
          <ActionButton
            label={`Reserve (${DEFAULT_EVENT_LENGTH} minutes)`}
            action={() => {setIsEventFormOpen(true)}}
            isDisabled={isDisabled}
            overrideStyles="biggerButton"
          />
        </div>
      </div>

      <FullScreenPopup 
        isOpen={isSettingsOpen} 
        onClose={() => {setIsSettingsOpen(false)}}
        label="Settings"
        darkMode={isDarkMode}
        >
        <div className={styles.buttonControls}>
          <ActionButton
            label={`Turn on ${isDarkMode ? "Light" : "Dark"} Mode`}
            action={toggleDarkMode}
            overrideStyles="biggerButton"
          />

          <ActionButton
            label={`${timeFormat === "12-hour" ? "24": "12"} Hour Format`}
            action={toggleTimeFormat}
            overrideStyles="biggerButton"
          />

          <ActionButton
            label={"Logout"}
            action={() => {window.location.href = "/logout"}}
            overrideStyles="biggerButton"
          />
        </div>
      </FullScreenPopup>

      <FullScreenPopup 
        isOpen={isEventFormOpen} 
        onClose={() => {setIsEventFormOpen(false)}}
        darkMode={isDarkMode}
      >
        <NewEventForm
          onConfirm={makeStaticEvent}
          darkMode={isDarkMode}
        />
      </FullScreenPopup>
    </div>
  )
}

export default RoomStatus