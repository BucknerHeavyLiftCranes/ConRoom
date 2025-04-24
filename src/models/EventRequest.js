import { tzc } from "../../constants/constants.js"
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

export class EventRequest {
    constructor(
        /** @type {string} */
        subject,
        // /** @type {emailAddress} */
        // organizer,
         /** @type {dateTimeAndZone} */
        start,
         /** @type {dateTimeAndZone} */
        end,
        /** @type {location} */
        location = {},
        /** @type {emailAddress[]} */
        attendees = []

    ) {
        this.subject = subject
        this.start = start
        this.end = end
        this.location = location
        this.attendees = attendees
    }

    /**
     * Return a new EventRequest instance from an object matching its shape.
     * @param {{subject: string, start: dateTimeAndZone, end: dateTimeAndZone}}
     * @returns {EventRequest} An EventRequest instance.
     */
    static fromObject({ 
        subject, 
        start, 
        end }
    ){
        return new EventRequest(
            subject,
            start,
            end
        )
    }

    /**
     * @param {Date} date Date to be converted to (defaults to today).
     * @returns Event date and time as an ISO-like string.
     */
    static toISO(date = new Date()) { 
        const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        date.setSeconds(0) // ensure that start is always at the beginning of the minute (i.e., `05:00`)
        const parts = tzc.formatToParts(date).reduce((acc, part) => {
            if (part.type !== 'literal') acc[part.type] = part.value;
                return acc;
            }, {}
        );
    
        const { year, month, day, hour, minute, second } = parts;
    
        // Figure out the EST/EDT offset (in ±HH:MM format)
        const localDate = new Date(date.toLocaleString('en-US', { timeZone: systemTimeZone }));
        const offsetMinutes = -(localDate.getTimezoneOffset());
        const sign = offsetMinutes >= 0 ? '+' : '-';
        const absMinutes = Math.abs(offsetMinutes);
        const offset = `${sign}${String(Math.floor(absMinutes / 60)).padStart(2, '0')}:${String(absMinutes % 60).padStart(2, '0')}`;
    
        return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
    }
}


// {
//     "subject": "My event",
//     "start": {
//         "dateTime": "2025-04-16T05:05:39.935Z",
//         "timeZone": "UTC"
//     },
//     "end": {
//         "dateTime": "2025-04-23T05:05:39.935Z",
//         "timeZone": "UTC"
//     }
// }