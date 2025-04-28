import { tzc } from "../../constants/constants";
import { EventRequest } from "./EventRequest";
import { OutlookEventDetails } from "./OutlookEventDetails";

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
        // /** @type {dateTimeAndZone} */
        // start, 
        /** @type {location} */
        location = {},
        /** @type {emailAddress[]} */
        attendees = [],
        /** @type {number} */
        meetingLength){
            
        /** @type {dateTimeAndZone} */
        const start = {
            dateTime: EventRequest.toISO(), 
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // time zone of the current device
        }
        const endDateTime = StaticEventRequest.calculateEndDateTime(start, meetingLength)

        /** @type {dateTimeAndZone} */
        const end = {
            dateTime: endDateTime, 
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // time zone of the current device
        }
        
        super(subject, start, end, location, attendees)
    }

    /**
     * Calculate meeting's end time.
     * @param {dateTimeAndZone} start - meeting start time
     * @param {number} meetingLength -  meeting length (in minutes)
     * @returns {string} End date and time of the meeting.
     */
    static calculateEndDateTime(start, meetingLength) {
        // const [hours, minutes] = start.split(":").map(Number);
        const now = new Date(start.dateTime)
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const endDateTime = new Date();
        endDateTime.setHours(hours, minutes, 0, 0);
        endDateTime.setMinutes(endDateTime.getMinutes() + meetingLength); // Add meeting length

        // console.log("END DATETIME:", endDateTime)
        // console.log("ISO END DATETIME:", EventRequest.toISO(endDateTime))

        // const endDateTime = new Date(
        //     Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), endTime.getHours(), endTime.getMinutes(), endTime.getSeconds())
        // );

        // const endDateTime = 

        return EventRequest.toISO(endDateTime) //EventRequest.toISO(endDateTime)
        
        //endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }); // "HH:mm"
    }

    toOutlookEventDetails() {
        const start = {
            date: tzc.format(new Date(this.start.dateTime)).split(",")[0],
            time: tzc.format(new Date(this.start.dateTime)).split(",")[1].trim().slice(0, 5)
        }

        const end = {
            date: tzc.format(new Date(this.end.dateTime)).split(",")[0],
            time: tzc.format(new Date(this.end.dateTime)).split(",")[1].trim().slice(0, 5)
        }

        // return {start, end}
        
        return new OutlookEventDetails(
            null,
            this.subject,
            start,
            end
        )
    }
}