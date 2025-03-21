/**
 * Object representating a meeting room.
 */
export class Room {
    constructor(room_id, room_name, building, room_number, seats, projector, summary, open_hour, close_hour) {
      this.room_id = room_id;
      this.room_name = room_name;
      this.building = building;
      this.room_number = room_number;
      this.seats = seats;
      this.projector = Boolean(projector); // Ensure it's a boolean
      this.summary = summary;
      this.open_hour = this.extractTime(open_hour); // Keep as string or convert to Date if needed
      this.close_hour = this.extractTime(close_hour);
    }

    /**
     * Check if the room is available between the given meeting duration.
     * @param {string} meetingStartTime meeting start time.
     * @param {string} meetingEndTime meeting end time
     * @returns {boolean} whether the room is or isn't available.
     */
    isAvailable(meetingStartTime, meetingEndTime) {
        return meetingStartTime >= this.open_hour && meetingEndTime <= this.close_hour;
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
          roomData.building,
          roomData.room_number,
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
    static fromModel() {
        return {
            room_id: this.room_id,
            room_name: this.room_name,
            building: this.building,
            room_number: this.room_number,
            seats: this.seats,
            projector: this.projector ? 1 : 0, // Convert boolean to BIT (0 or 1) for MSSQL
            summary: this.summary,
            open_hour: this.open_hour,
            close_hour: this.close_hour
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