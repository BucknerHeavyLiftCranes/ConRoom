/**
 * Details of a reservation for a room.
 */
export class MeetingDetails { //maybe just use Reservation model instead
    constructor(id, title, room, date, start, end, status) {
      /** @type {number} reservation id for the meeting. */
      this.id = id ? id : undefined
      /** @type {string} title of the meeting. */
      this.title = title;
      /** @type {string} name of the meeting room. */
      this.room = room;
      /** @type {string} meeting date*/
      this.date = this.formatDate(date)
      /** @type {string} meeting start time. */
      this.start = start;
      /** @type {string} meeting end time. */
      this.end = end;
      /** @type {string} */
      this.status = status;
    }

    /**
     * Create a new MeetingDetails instance from an object with a similar shape.
     * @param {Object} obj object containing meeting detials
     * @return {MeetingDetails} a Meeting Details instance.
     */
    static fromObject(obj) {
      return new MeetingDetails(
        obj.reservationId, 
        obj.title, 
        obj.roomName, 
        obj.date, 
        obj.start, 
        obj.end, 
        obj.status);
  }


    calculateDuration() {
      const start = new Date(`1970-01-01T${this.start}Z`);
      const end = new Date(`1970-01-01T${this.end}Z`);
      let diff = Math.abs(end - start) / 1000; // Difference in seconds
  
      const hours = String(Math.floor(diff / 3600));
      diff %= 3600;
      const minutes = String(Math.floor(diff / 60));

      const hourString = hours > 0 ? (hours == 1 ? `${hours} hr` : `${hours} hrs`) : ""
      const minuteString = minutes > 0 ? (minutes == 1 ? `${minutes} min` : `${minutes} mins`) : ""

      // console.log(`${hourString} ${minuteString} ${secondString}`)
  
      // return `${hours}:${minutes}:${seconds}`;
      return `${hourString} ${minuteString}`
    }


    formatDate(inputDate) {
      const [year, month, day] = inputDate.split("-"); // date is stored as YYYY-MM-DD hence, destructure in reverse
      const date = new Date(`${month}/${day}/${year}`); // Month/day/year format
  
      const options = {
          weekday: 'short', // Get short day name (e.g., "Tue")
          day: '2-digit', // Get two-digit day (e.g., "25")
          month: 'long', // Get full month name (e.g., "March")
          year: 'numeric' // Get full year (e.g., "2025")
      };
  
      return date.toLocaleDateString('en-GB', options); // Use en-GB to ensure proper formatting
    }
  
  

    formatTime(time) {
      const [hour, minute] = time.split(":").map(Number);
      const period = hour < 12 ? "AM" : "PM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      // return time;
      return `${formattedHour}:${String(minute).padStart(2, "0")} ${period}`;
    }


    getFormattedTimeRange() {
        return `${this.formatTime(this.start)} - ${this.formatTime(this.end)}`;
    }
}