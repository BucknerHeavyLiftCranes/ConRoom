/**
 * Details of a new reservation to be created in the system.
 */
export class ReservationRequest {
    constructor(title, room, user, date, start, end){
        /** @type {string} */
        this.title = title;
        /** @type {string} */
        this.room = room;
        /** @type {string} */
        this.user = user;
        /** @type {string} */
        this.date = date;
        /** @type {string} */
        this.start = start;
        /** @type {string} */
        this.end = end;
    }
}