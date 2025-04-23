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
        /** @type {string} */
        timezone,
        /** @type {location} */
        location = {},
        /** @type {emailAddress[]} */
        attendees = [],
        /** @type {number} */
        meetingLength){
            
        /** @type {dateTimeAndZone} */
        const start = {
            dateTime: EventRequest.toISO({ timezone: timezone }), 
            timezone: timezone
        }
        const endDateTime = StaticEventRequest.calculateEndDateTime(start, meetingLength)

        /** @type {dateTimeAndZone} */
        const end = {
            dateTime: endDateTime, 
            timezone: timezone
        }
        
        super(subject, start, end, location, attendees)
        this._rawStart = start.dateTime
        this._rawEnd = end.dateTime
    }

    /**
     * Calculate meeting's end time.
     * @param {dateTimeAndZone} start - meeting start time
     * @param {number} meetingLength -  meeting length (in minutes)
     * @returns {string} End time of the meeting (in HH:MM).
     */
    static calculateEndDateTime(start, meetingLength) {
        // const [hours, minutes] = start.split(":").map(Number);
        const now = new Date(start.dateTime)
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const endTime = new Date();
        endTime.setHours(hours, minutes, 0, 0);
        endTime.setMinutes(endTime.getMinutes() + meetingLength); // Add meeting length

        const endDateTime = new Date(
            Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), endTime.getHours(), endTime.getMinutes(), endTime.getSeconds())
        );

        return EventRequest.toISO({ date: endDateTime })
        
        //endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }); // "HH:mm"
    }

    toOutlookEventDetails() {
        const start = {
            date: tzc.americaNewYorkFormatter.format(new Date(this._rawStart)).split(",")[0],
            time: tzc.americaNewYorkFormatter.format(new Date(this._rawStart)).split(",")[1].trim().slice(0, 5)
        }

        const end = {
            date: tzc.americaNewYorkFormatter.format(new Date(this._rawEnd)).split(",")[0],
            time: tzc.americaNewYorkFormatter.format(new Date(this._rawEnd)).split(",")[1].trim().slice(0, 5)
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