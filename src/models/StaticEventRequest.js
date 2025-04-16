import { EventRequest } from "./EventRequest";

export class StaticEventRequest extends EventRequest{
    constructor(
        /** @type {string} */
        subject, 
        /** @type {string} */
        start, 
        /** @type {number} */
        meetingLength){
            
        const end = StaticEventRequest.calculateEndTime(start, meetingLength)
        
        super(subject, start, end)
    }

    /**
     * Calculate event's end time.
     * @param {string} start - event start time
     * @param {number} meetingLength -  event length (in minutes)
     * @returns {string} End time of the meeting (in ISO Format).
     */
    static calculateEndTime(start, meetingLength) {

    }
}