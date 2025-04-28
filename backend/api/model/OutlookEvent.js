/**
 * @typedef {Object} emailAddress
 * @property {string} name - Display name of the email sender or recipient.
 * @property {string} address - Actual email address (e.g., user@abc.com).
 */

/**
 * @typedef {Object} eventDateTime
 * @property {string} date - Event date.
 * @property {string} time - Event time.
 */

import { tzc } from "../../../constants/constants.js";

/**
 * @typedef {Object} location
 * @property {string} displayName - Display name of the location (online or in-person).
 * @property {string} locationType 
 * @property {string} uniqueId
 * @property {string} uniqueIdType
 */


/**
 * Respresents an event from Outlook calendar.
 * @class
 */
export default class OutlookEvent {
    constructor(
        /** @type {string} - unique meeting id. */
        id, 
        /** @type {string} - title of the meeting. */
        subject,
        /** @type {emailAddress[]} list of people invited to the event. */ 
        attendees, 
        /** @type {string} - event start time. */
        start, 
        /** @type {string} - event end time. */
        end, 
        /** @type {emailAddress} - name and email of the event creator. */
        organizer,
        /** @type {location} - details about meeting location. */
        location,
        /** @type {string} - links to the meeting on Outlook. */
        webLink
    ) {
        this.id = id, 
        this.subject = subject, 
        this.attendees = attendees, 
        this.start = this.formatDateTime(start.dateTime), 
        this.end = this.formatDateTime(end.dateTime), 
        this.organizer = organizer,
        this.location = location,
        this.webLink = webLink
    }

    /**
     * Create a new OutlookEvent instance from an object.
     * @param {any} obj Raw object contain details about the event.
     * @returns {OutlookEvent} a new OutlookEvent instance.
     */
    static fromObject({
        id, 
        subject,
        attendees, 
        start, 
        end, 
        organizer,
        location,
        webLink}
    
    ) {
        /** @type {emailAddress[]}  filtered array containing just attendee object emailAddress property. */
        const antendeeEmails = attendees.map( (attendee) => attendee.emailAddress);

        return new OutlookEvent(
            id, 
            subject, 
            attendees = antendeeEmails,
            start, 
            end, 
            organizer,
            location,
            webLink
        )
    }

    /**
     * Format the event date based on its timezone (defaults to `UTC`)
     * @param {string} date Event date.
     * @returns 
     */
    formatDateTime(date){
        // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const dateAsDateObject = new Date(date)
        // console.log("tzc time zone:", Intl.DateTimeFormat().resolvedOptions().timeZone)
        return {
            date: tzc.format(dateAsDateObject).split(",")[0],
            time: tzc.format(dateAsDateObject).split(",")[1].trim().slice(0, 5)
        }
    }
}

/**
 * Relevent data keys from Outlook -> attributes of OutlookEvent
 * id -> id
 * subject -> subject
 * attendees -> attendees ({emailAddress} ... props not necessary)
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