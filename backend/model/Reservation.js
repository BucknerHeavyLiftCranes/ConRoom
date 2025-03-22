import UndeterminedStatusError from "../../errors/UndeterminedStatusError.js"

export class Reservation{
    constructor({
        reservationId, 
        title, 
        roomId, 
        userEmail, 
        date, 
        startTime, 
        endTime, 
        status}){
        this.reservationId = reservationId,
        this.title = title,
        this.roomId = roomId,
        this.userEmail = userEmail,
        this.date = date,
        this.startTime = this.extractTime(startTime),
        this.endTime = this.extractTime(endTime),
        this.status = this.validateStatus(status)
    }

    /**
     * Check if the reservation's start and end time is valid (its start time is before its end).
     * @returns {boolean} whether or not the reservation has valid a valid duration.
     */ 
    hasValidDuration() {
        return this.startTime < this.endTime // will return false of this.startTime >= this.endTime
    }

    /**
     * Check if a reservation conflicts with another on the same day.
     * @param {Reservation} otherReservation possibly conflicting reservation.
     * @returns {boolean} whether this reservation conflicts with the other one.
     */
    conflictsWith(otherReservation){
        if(this.date !== otherReservation.date || this.roomId !== otherReservation.roomId){
            return false
        }

        return !(this.endTime <= otherReservation.startTime || this.startTime >= otherReservation.endTime);
    }

    /**
     * Converts a database record or API object into a Reservation instance.
     * @param {Object} reservationData - object containing details about the reservation.
     * @param {number} reservationData.reservationId - Unique ID of the reservation.
     * @param {string} reservationData.title - Title or description of the reservation.
     * @param {number} reservationData.roomId - ID of the room associated with the reservation.
     * @param {string} reservationData.userEmail - Email of the user who made the reservation.
     * @param {string} reservationData.date - Date of the reservation (format: "YYYY-MM-DD").
     * @param {string} reservationData.startTime - Start time of the reservation (format: "HH:MM:SS").
     * @param {string} reservationData.endTime - End time of the reservation (format: "HH:MM:SS").
     * @param {string} reservationData.status - Status of the reservation (e.g., "confirmed", "pending", "cancelled").
     * @returns {Reservation} A Reservation object.
     */
    static toModel(reservationData) {
        return new Reservation(
          reservationData.reservationId,  // Accessing properties directly from reservationData object
          reservationData.title,
          reservationData.roomId,
          reservationData.userEmail,
          reservationData.date,
          reservationData.startTime,
          reservationData.endTime,
          reservationData.status
        );
    }

    /**
    * Converts a Reservation instance back to a plain object (for API responses or DB insertion).
    * @returns an object containing the reservation data.
    */
    fromModel() {
        return {
            reservationId: this.reservationId,
            title: this.title,
            roomId: this.roomId,
            userEmail: this.userEmail,
            date: this.date,
            startTime: this.startTime,
            endTime: this.endTime,
            status: this.status
        };
    }

    /**
     * Convert dateTime string to Time string.
     * @param {string} dateTime Date object with the time to be spliced and extracted.
     * @returns {string} time portion of the Date object.
     */
    extractTime(dateTime) {
        const timeRegex = /^\d{2}:\d{2}:\d{2}$/; // Matches HH:MM:SS
        if(timeRegex.test(dateTime)){ // if dateTime is already in a valid format, just return it
            return dateTime
        }
        // If dateTime is a valid string, extract the time part
        if (dateTime) {
          return new Date(dateTime).toTimeString().split(' ')[0]; // Returns 'HH:mm:ss'
        }

        return '00:00:00'; // Default if the dateTime is invalid or missing
    }


    validateStatus(status){
        switch (status) {
            case "Confirmed":
                return "Confirmed";
            case "In Progress":
                return "In Progress";
            case "Completed":
                return "Completed";
            case "Cancelled":
                return "Cancelled";
            default:
                throw new UndeterminedStatusError("This reservation has an invalid status")
        }
    }
}