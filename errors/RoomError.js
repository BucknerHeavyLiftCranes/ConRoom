/**
 * Generic room error (better to throw one of its subclasses).
 */
export class RoomError extends Error {
    constructor(message) {
        super(message)
        this.name = "RoomError"
    }
}

/**
 * Thrown when a Room object contains invalid data.
 */
export class RoomValidationError extends  RoomError{
    constructor(message) {
        super(message)
        this.name = "RoomValidationError"
    }
}


/**
 * Thrown when the database fails to return a room record.
 */
export class GetRoomError extends  RoomError {
    constructor(message) {
        super(message)
        this.name = "GetRoomError"
    }
}


/**
 * Thrown when a user attempts to create a room that already exists.
 */
export class DuplicateRoomError extends RoomError {
    constructor(message) {
        super(message)
        this.name = "DuplicateRoomError"
    }
}

/**
 * Thrown if a new room fails to be created in the database.
 */
export class CreateRoomError extends RoomError {
    constructor(message) {
        super(message)
        this.name = "CreateRoomError"
    }
}

/**
 * Thrown if a room fails to be updated in the database.
 */
export class UpdateRoomError extends RoomError {
    constructor(message) {
        super(message)
        this.name = "UpdateRoomError"
    }
}

/**
 * Thrown if a room fails to be deleted from the database.
 */
export class DeleteRoomError extends RoomError {
    constructor(message) {
        super(message)
        this.name = "DeleteRoomError"
    }
}