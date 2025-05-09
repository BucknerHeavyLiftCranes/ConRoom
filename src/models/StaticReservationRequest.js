import { ReservationRequest } from "./ReservationRequest";

/**
 * Details of a new reservation (on the CURRENT day for a SET time) to be created in the system.
 */
export class StaticReservationRequest extends ReservationRequest{
    constructor(
        /** @type {string} */
        title, 
        /** @type {string} */
        room, 
        /** @type {string} */
        user, 
        /** @type {string} */
        start, 
        /** @type {number} */
        meetingLength){
            
        const date = StaticReservationRequest.getCurrentDate() // needs to always be the current day
        const end = StaticReservationRequest.calculateEndTime(start, meetingLength)
        
        super(title, room, user, date, start, end)
    }


    /**
     * Set date to be current day (in EST).
     * @returns {string} current day (in EST).
     */
    static getCurrentDate(){
        const estDate = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" }); // "YYYY-MM-DD"
        return estDate;

    }


    /**
     * Calculate meeting's end time.
     * @param {string} start - meeting start time
     * @param {number} meetingLength -  meeting length (in minutes)
     * @returns {string} End time of the meeting (in HH:MM).
     */
    static calculateEndTime(start, meetingLength) {
        const [hours, minutes] = start.split(":").map(Number);
        const endTime = new Date();
        endTime.setHours(hours, minutes, 0, 0);
        endTime.setMinutes(endTime.getMinutes() + meetingLength); // Add meeting length

        return endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }); // "HH:mm"
    }
}