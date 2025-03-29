/**
 * Details of a reservation for a room.
 */
export class MeetingDetails { //maybe just use Reservation model instead
    constructor(id, title, room, date, startTime, endTime, status) {
      /** @type {number | undefined} */
      this.id = id ? id : undefined
      /** @type {string} */
      this.title = title;
      /** @type {string} */
      this.room = room;
      /** @type {string} */
      this.date = this.formatDate(date)
      /** @type {string} */
      this.startTime = startTime;
      /** @type {string} */
      this.endTime = endTime;
      /** @type {string} */
      this.timeSpan = this.getFormattedTimeRange()
      /** @type {string} */
      this.duration = this.calculateDuration();
      /** @type {string} */
      this.status = status;
    }


    calculateDuration() {
      const start = new Date(`1970-01-01T${this.startTime}Z`);
      const end = new Date(`1970-01-01T${this.endTime}Z`);
      let diff = Math.abs(end - start) / 1000; // Difference in seconds
  
      const hours = String(Math.floor(diff / 3600));
      diff %= 3600;
      const minutes = String(Math.floor(diff / 60));
      const seconds = String(diff % 60);

      const hourString = hours > 0 ? (hours == 1 ? `${hours} hr` : `${hours} hrs`) : ""
      const minuteString = minutes > 0 ? (minutes == 1 ? `${minutes} min` : `${minutes} mins`) : ""
      const secondString = seconds > 0 ? (seconds == 1 ? `${seconds} hr` : `${seconds} secs`) : ""

      // console.log(`${hourString} ${minuteString} ${secondString}`)
  
      // return `${hours}:${minutes}:${seconds}`;
      return `${hourString} ${minuteString} ${secondString}`
    }

    // formatDate(date){
    //   // console.log(new Date(date).toISOString())
    //   // return new Intl.DateTimeFormat("en-US", {
    //   //   timeZone: "America/New_York",
    //   //   year: "numeric",
    //   //   month: "2-digit",
    //   //   day: "2-digit",
    //   // }).format(new Date(date));
    //   // return new Date(date).toISOString().split("T")[0]
    //   const localDate = new Date(`${date}T12:00:00`); // Set a neutral midday time to avoid shifts
    //   const dayOfWeek = localDate.toLocaleDateString("en-US", { weekday: "long" }).slice(0, 3)
    //   console.log(dayOfWeek)
    //   return `${dayOfWeek} ${new Intl.DateTimeFormat("en-US", {
    //       timeZone: "America/New_York",
    //       year: "numeric",
    //       month: "2-digit",
    //       day: "2-digit",
    //   }).format(localDate).replaceAll("/", "-")}`;
    // }

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
        return `${this.formatTime(this.startTime)} - ${this.formatTime(this.endTime)}`;
    }
}