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
     * @param {{subject: string, start: dateTimeAndZone, end: dateTimeAndZone}} object Object of matching shape.
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