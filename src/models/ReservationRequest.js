import { CreateReservationRequestError } from "../../errors/ReservationError";

/**
 * Details of a new reservation to be created in the system.
 */
export class ReservationRequest {
    constructor(
        /** @type {string} */
        title, 
        /** @type {string} */
        room, 
        /** @type {string} */
        user, 
        /** @type {string} */
        date,
        /** @type {string} */
        start, 
        /** @type {string} */
        end){
            
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
        /** @type {string} */
        this.canceled = false;

        this.validateReservationRequest()
    }


    /**
     * Check if the reservation's start and end time is valid (its start time is before its end).
     * @returns {boolean} whether or not the reservation has valid a valid duration.
     */ 
    hasValidDuration() {
        return this.start < this.end // will return false of this.start >= this.end
    }


    /**
     * Check if the reservation's date and time is valid (not in the past).
     * @returns {boolean} whether or not the reservation has valid a valid date and time.
     */ 
    hasNotPassed() {
        // Convert reservation date & time into a Date object
        const reservationDateTime = new Date(`${this.date}T${this.start}Z`);

        // Convert to EST (Eastern Time)
        const estTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const now = new Date(estTime);

        // Convert both timestamps to seconds
        const reservationSeconds = Math.floor(reservationDateTime.getTime() / 1000);
        const nowSeconds = Math.floor(now.getTime() / 1000);

        return reservationSeconds > nowSeconds;
    }


    /**
     * Confirm reservation request before sending it to the backend.
     */
    validateReservationRequest() {
        if(!(this.hasValidDuration() && this.hasNotPassed())) {
            throw new CreateReservationRequestError("The is not a valid reservation")
        }
    }
}
