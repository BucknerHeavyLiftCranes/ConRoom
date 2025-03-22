/**
 * Object representating a meeting room.
 */
export class Room {
    constructor(roomId = undefined, roomName, roomEmail, seats, projector, summary, openHour, closeHour) {
      this.roomId = roomId
      this.roomName = roomName;
      this.roomEmail = roomEmail;
      this.seats = seats;
      this.projector = Boolean(projector); // Ensure it's a boolean
      this.summary = summary;
      this.openHour = this.extractTime(openHour); // Keep as string or convert to Date if needed
      this.closeHour = this.extractTime(closeHour);
    }

    /**
     * Check if the room is available between the given meeting duration.
     * @param {string} meetingStartTime meeting start time.
     * @param {string} meetingEndTime meeting end time
     * @returns {boolean} whether the room is or isn't available.
     */
    isOpen(meetingStartTime, meetingEndTime) {
        return meetingStartTime >= this.openHour && meetingEndTime <= this.closeHour;
      }

    /**
     * Check if the room's open hours are valid (its open hour is before its close hour).
     * @returns {boolean} whether or not the room has valid open hours.
     */ 
    hasValidHours() {
        return this.openHour < this.closeHour // will return false of this.openHour >= this.closeHour
    }


    /**
    * Converts a database record or API response object into a Room instance.
    * @param roomData record from the database.
    * @returns {Room} a Room object.
    */
    static toModel(roomData) {
        return new Room(
          roomData.room_id,
          roomData.room_name,
          roomData.room_email,
          roomData.seats,
          roomData.projector,
          roomData.summary,
          roomData.open_hour,
          roomData.close_hour
        );
      }

   /**
    * Converts a Room instance back to a plain object (for API responses or DB insertion).
    * @returns an object containing the room data.
    */
    fromModel() {
        return {
            roomId: this.roomId,
            roomName: this.roomName,
            roomEmail: this.roomEmail,
            seats: this.seats,
            projector: this.projector ? 1 : 0, // Convert boolean to BIT (0 or 1) for MSSQL
            summary: this.summary,
            openHour: this.openHour,// this.convertToISO(this.openHour),
            closeHour: this.closeHour// this.convertToISO(this.closeHour)
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

    /**
     * Convert Time string to dateTime string.
     * @param {string} timeString string representation of time (HH:MM:SS)
     * @returns {string} ISO formatted time string
     */
    convertToISO(timeString) {
        console.log(timeString)
        if (!timeString || !/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
            throw new Error(`Invalid time format. Expected HH:MM:SS, but got ${timeString}`);
        }
        
        const date = new Date(`1970-01-01T${timeString}Z`);
        return date.toISOString();
    }
}

