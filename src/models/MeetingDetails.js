export class MeetingDetails { //maybe just use Reservation model instead
    constructor(id, title, room, time, duration, status) {
      this.id = id
      this.title = title;
      this.room = room;
      this.time = time;
      this.duration = duration;
      this.status = status;
    }
}