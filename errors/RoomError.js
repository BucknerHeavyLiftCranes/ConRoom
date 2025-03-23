/**
 * Generic room error (better to throw one of its child errors).
 */
export class RoomError extends Error {
    constructor(message) {
        super(message)
        this.name = "RoomError"
    }
}

/**
 * Thrown if a room does not exist.
 */
export class NoRoomError extends RoomError {
    constructor(message) {
        super(message)
        this.name = "NoRoomError"
    }
}