/**
 * Object representating a meeting room.
 */
export class Room {
    constructor(roomId, roomName, building, roomNumber, seats, projector, summary, openHour, closeHour) {
      this.roomId = roomId;
      this.roomName = roomName;
      this.building = building;
      this.roomNumber = roomNumber;
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
    isAvailable(meetingStartTime, meetingEndTime) {
        return meetingStartTime >= this.openHour && meetingEndTime <= this.closeHour;
      }


    /**
    * Converts a database record or API response object into a Room instance.
    * @param roomData record from the database.
    * @returns {Room} a Room object.
    */
    static toModel(roomData) {
        return new Room(
          roomData.roomId,
          roomData.roomName,
          roomData.building,
          roomData.roomNumber,
          roomData.seats,
          roomData.projector,
          roomData.summary,
          roomData.openHour,
          roomData.closeHour
        );
      }

   /**
    * Converts a Room instance back to a plain object (for API responses or DB insertion).
    * @returns an object containing the room data.
    */
    static fromModel() {
        return {
            roomId: this.roomId,
            roomName: this.roomName,
            building: this.building,
            roomNumber: this.roomNumber,
            seats: this.seats,
            projector: this.projector ? 1 : 0, // Convert boolean to BIT (0 or 1) for MSSQL
            summary: this.summary,
            openHour: this.openHour,
            closeHour: this.closeHour
        };
    }

    /**
     * @param {string} dateTime Date object with the time to be spliced and extracted.
     * @returns {string} time portion of the Date object.
     */
    extractTime(dateTime) {
        // If dateTime is a valid string, extract the time part
        if (dateTime) {
          return new Date(dateTime).toTimeString().split(' ')[0]; // Returns 'HH:mm:ss'
        }
        return '00:00:00'; // Default if the dateTime is invalid or missing
    }
}