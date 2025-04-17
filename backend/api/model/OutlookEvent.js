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

import { timeZones, tzc } from "../../../constants/constants.js";

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
        /** @type {string} - time zone of event start time. */
        originalStartTimeZone, 
        /** @type {string} - event end time. */
        end, 
        /** @type {string} - time zone of event end time. */
        originalEndTimeZone,
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
        this.start = this.formatDateTime(start.dateTime, originalStartTimeZone), 
        this.originalStartTimeZone = originalStartTimeZone, 
        this.end = this.formatDateTime(end.dateTime, originalEndTimeZone), 
        this.originalEndTimeZone = originalEndTimeZone,
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
        originalStartTimeZone, 
        end, 
        originalEndTimeZone,
        organizer,
        location,
        webLink}
    
    ) {
        /** @type {emailAddress[]}  filtered array containing just attendee object emailAddress property. */
        const antendeeEmails = attendees.map( (attendee) => attendee.emailAddress);

        // console.log(`${subject} timezone: ${OutlookEvent.getShortTimezone(originalStartTimeZone)}`)

        return new OutlookEvent(
            id, 
            subject, 
            attendees = antendeeEmails,
            start, 
            originalStartTimeZone, 
            end, 
            originalEndTimeZone,
            organizer,
            location,
            webLink
        )
    }

    /**
     * Format the event date based on its timezone (defaults to `UTC`)
     * @param {string} date Event date.
     * @param {string} timezone Event time zone.
     * @returns 
     */
    formatDateTime(date, timezone){
        const dateAsDateObject = new Date(date)
        switch(timezone) {
            case "Eastern Standard Time":
                return {
                    date: tzc.estFormatter.format(dateAsDateObject).split(",")[0],
                    time: tzc.estFormatter.format(dateAsDateObject).split(",")[1].trim().slice(0, 5)
                }
            default:
                return {
                    date: tzc.utcFormatter.format(dateAsDateObject).split(",")[0],
                    time: tzc.utcFormatter.format(dateAsDateObject).split(",")[1].trim().slice(0, 5)
                }
        }
    }

    /**
     * Get the short timezone abbreviation for a given full timezone name.
     * @param {string} fullZone - The full timezone name (e.g. "Eastern Standard Time").
     * @returns {string|null} The short abbreviation (e.g. "est") or null if not found.
     */
    static getShortTimezone(fullZone) {
        // Build reverse mapping: full name ➝ short
        const fullToShort = Object.entries(timeZones).reduce((acc, [short, full]) => {
        acc[full.toLowerCase()] = short;
        return acc;
        }, {});
        return fullToShort[fullZone.toLowerCase()] || null;
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