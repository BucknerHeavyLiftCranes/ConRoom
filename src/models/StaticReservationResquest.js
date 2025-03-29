import { ReservationRequest } from "./ReservationRequest";

/**
 * Details of a new reservation (on the CURRENT day for a SET time) to be created in the system.
 */
export class StaticReservationResquest extends ReservationRequest{
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
            
        const date = StaticReservationResquest.getCurrentDate() // needs to always be the current day
        const end = StaticReservationResquest.calculateEndTime(start, meetingLength)
        
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
        const startTime = new Date();
        startTime.setHours(hours, minutes, 0, 0);
        startTime.setMinutes(startTime.getMinutes() + meetingLength); // Add meeting length

        return startTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }); // "HH:mm"
    }
}