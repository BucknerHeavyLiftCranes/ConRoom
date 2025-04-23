import { tzc } from "../../constants/constants"
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
     * @param {Object} obj
     * @param {Date} [obj.date] date to convert to (defaults to today)
     * @param {string} [obj.timezone] time zone that the date should be converted to (defaults to UTC)
     * @returns
     */
    static toISO({ timezone, date = new Date() }) { 
        date.setSeconds(0) // ensure that start is always at the beginning of the minute (i.e., `05:00`)
        let parts = null 

        try {
            if (timezone) {
                if (timezone === "America/New_York") {
                    parts = tzc.americaNewYorkFormatter.formatToParts(date).reduce((acc, part) => {
                        if (part.type !== 'literal') acc[part.type] = part.value;
                            return acc;
                        }, {}
                    );
                } else {
                    throw new Error(`Invalid timezone given: ${timezone}`)
                }
            } else {
                parts = tzc.utcFormatter.formatToParts(date).reduce((acc, part) => {
                    if (part.type !== 'literal') acc[part.type] = part.value;
                        return acc;
                    }, {}
                );
            }   
        } catch (err) {
            console.log(err)
            parts = tzc.utcFormatter.formatToParts(date).reduce((acc, part) => {
                if (part.type !== 'literal') acc[part.type] = part.value;
                    return acc;
                }, {}
            );
            
        }
    
        const { year, month, day, hour, minute, second } = parts;
    
        // Figure out the EST/EDT offset (in ±HH:MM format)
        const estDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const offsetMinutes = -(estDate.getTimezoneOffset());
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