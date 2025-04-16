import { EventRequest } from "./EventRequest";

/**
 * @typedef {Object} emailAddress
 * @property {string} name - Display name of the email sender or recipient.
 * @property {string} address - Actual email address (e.g., user@abc.com).
 * @property {string} type 
 */

/**
 * @typedef {Object} dateTimeAndZone
 * @property {string} dateTime - event date and time (in ISO format).
 * @property {string} timezone - Event timezone (i.e. `UTC`).
 */

/**
 * @typedef {Object} location
 * @property {string} displayName - Display name of the location (online or in-person).
 */

export class StaticEventRequest extends EventRequest{
    constructor(
        /** @type {string} */
        subject, 
        // /** @type {emailAddress} */
        // organizer,
        /** @type {string} */
        start, 
        /** @type {location} */
        location = {},
        /** @type {emailAddress[]} */
        attendees = [],
        /** @type {number} */
        meetingLength){
            
        const end = StaticEventRequest.calculateEndTime(start, meetingLength)
        
        super(subject, start, end, location, attendees)
    }

    /**
     * Calculate event's end time.
     * @param {string} start - event start time
     * @param {number} meetingLength -  event length (in minutes)
     * @returns {string} End time of the meeting (in ISO Format).
     */
    static calculateEndTime(start, meetingLength) {

    }
}