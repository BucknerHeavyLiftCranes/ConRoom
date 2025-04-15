/**
 * Respresents an event from Outlook calendar.
 */
export default class OutlookEvent {

}

/**
 * Relevent data keys from Outlook -> prop of Event
 * id -> id
 * subject -> subject
 * attendees -> attendees
 * start -> start
 *  originalStartTimeZone - may be good for formatting
 * end -> end
 *  originalEndTimeZone - may be good for formatting
 * organizer ({name, email}) -> organizer ({name, email})
 * location -> location
 * webLink -> webLink (may not include this one)
 * 
 * functions:
 * status() - get current status of the meeting
 */