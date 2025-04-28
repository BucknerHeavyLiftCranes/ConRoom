/**
 * @typedef {Object} eventDateTime
 * @property {string} date - Event date (i.e. "02/29/2004").
 * @property {string} time - Event time (i.e. "04:00").
 */

/**
 * Details of an event for a room.
 */
export class OutlookEventDetails { //maybe just use Reservation model instead
    constructor(id, subject, start, end) {
        /** @type {string} reservation id for the meeting. */
        this.id = id
        /** @type {string} subject of the meeting. */
        this.subject = subject;
        /** @type {eventDateTime} meeting start time. */
        this.start = start;
        /** @type {eventDateTime} meeting end time. */
        this.end = end;

        this.startDate = this.formatDate(start) 
        this.endDate = this.formatDate(end) 
    }

    /**
     * Create a new OutlookEventDetails instance from an object with a similar shape.
     * @param {{id: string, subject: string, start:eventDateTime, end: eventDateTime}} 
     * @return {OutlookEventDetails} a OutlookEventDetails instance.
     */
    static fromObject({id, subject, start, end}) {
        return new OutlookEventDetails(
            id, 
            subject, 
            start, 
            end
        );
    }

    /**
     * Calculates an event's duration. 
     * @returns {string} event duration (i.e. 1 hr 30 mins)
     */
    duration() {
        const start = new Date(`1970-01-01T${this.start.time}Z`);
        const end = new Date(`1970-01-01T${this.end.time}Z`);
        let diff = Math.abs(end - start) / 1000; // Difference in seconds
    
        const hours = String(Math.floor(diff / 3600));
        diff %= 3600;
        const minutes = String(Math.floor(diff / 60));

        const hourString = hours > 0 ? (hours == 1 ? `${hours} hr` : `${hours} hrs`) : ""
        const minuteString = minutes > 0 ? (minutes == 1 ? `${minutes} min` : `${minutes} mins`) : ""

    
        // return `${hours}:${minutes}:${seconds}`;
        return hourString === "" ? `${minuteString}` : `${hourString} ${minuteString}`
    }

    /**
     * Convert raw date string to human-readable date.
     * @param {string} date Date string (i.e. 4/7/2025)
     * @returns {string} Human-Readable date string (i.e. Mon 7 April 2025)
     */
    formatDate({ date }) {
      const formattedDate = new Date(date); // Month/day/year format
  
      const options = {
          weekday: 'short', // Get short day name (e.g., "Tue")
          day: '2-digit', // Get two-digit day (e.g., "25")
          month: 'long', // Get full month name (e.g., "March")
          year: 'numeric' // Get full year (e.g., "2025")
      };
  
      return formattedDate.toLocaleDateString('en-GB', options); // Use en-GB to ensure proper formatting
    }
  
  

    /**
     * Convert raw time string to 12-hour time string (with correct period AM or PM)
     * @param {string} time Time string (i.e. 13:00)
     * @returns {string} Readable 12-hour time (i.e. 4 PM)
     */
    formatTime(time) {
      const [hour, minute] = time.split(":").map(Number);
      const period = hour < 12 ? "AM" : "PM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      // return time;
      return `${formattedHour}:${String(minute).padStart(2, "0")} ${period}`;
    }


    getFormattedTimeRange() {
        return `${this.formatTime(this.start.time)} - ${this.formatTime(this.end.time)}`;
    }


   /**
     * Parse a local New York time string (EST/EDT-aware) into a UTC Date.
     * @param {eventDateTime} eventDateTime Date and time of the event.
     * @returns {Date} - UTC Date object
     */
    static parseEventDateTime(eventDateTime) {
        const { date, time } = eventDateTime
        const [month, day, year] = date.split("/").map(Number);
        const [hour, minute] = time.split(":").map(Number);
    
        // Build a Date object as if it's in the target timezone (America/New_York)
        const localString = new Date(year, month - 1, day, hour, minute).toLocaleString("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    
        // Convert that localized string to a UTC Date by parsing it again
        const utcDate = new Date(localString);
    
        return utcDate;
    }
  

  /**
   * Get the current status of the meeting.
   * @returns {string} current event status : `Confirmed`, `In Progress`, or `Completed`
   */
  status() {
    const now = new Date();

    const startDate = OutlookEventDetails.parseEventDateTime(this.start);
    const endDate = OutlookEventDetails.parseEventDateTime(this.end);

    if (now < startDate) return "Confirmed";
    if (now >= startDate && now <= endDate) return "In Progress";
    return "Completed";
  }

  /**
   * Check whether this event overlaps (conflicts) with another event.
   * @param {OutlookEventDetails} otherEvent - Another event to compare with.
   * @returns {boolean} True if the events overlap, false otherwise.
   */
  conflictsWith(otherEvent) {
    const thisStart = new Date(`${this.start.date} ${this.start.time}`);
    const thisEnd = new Date(`${this.end.date} ${this.end.time}`);
    const otherStart = new Date(`${otherEvent.start.date} ${otherEvent.start.time}`);
    const otherEnd = new Date(`${otherEvent.end.date} ${otherEvent.end.time}`);

    return thisStart < otherEnd && thisEnd > otherStart;
  }
}