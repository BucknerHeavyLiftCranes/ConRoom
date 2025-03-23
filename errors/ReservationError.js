/**
 * Generic reservation error (better to throw one of its subclasses).
 */
export class ReservationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ReservationError"
    }
}

/**
 * Thrown when a Reservation object contains invalid data.
 */
export class ReservationValidationError extends  ReservationError{
    constructor(message) {
        super(message)
        this.name = "ReservationValidationError"
    }
}

/**
 * Thrown when the database fails to return a reservation record.
 */
export class GetReservationError extends  ReservationError {
    constructor(message) {
        super(message)
        this.name = "GetReservationError"
    }
}

/**
 * Thrown when a user attempts to create a reservation that already exists.
 */
export class DuplicateReservationError extends ReservationError {
    constructor(message) {
        super(message)
        this.name = "ReservationFetchError"
    }
}

/**
 * Thrown if a new reservation fails to be created in the database.
 */
export class CreateReservationError extends ReservationError {
    constructor(message) {
        super(message)
        this.name = "CreateReservationError"
    }
}

/**
 * Thrown if a reservation fails to be updated in the database.
 */
export class UpdateReservationError extends ReservationError {
    constructor(message) {
        super(message)
        this.name = "UpdateReservationError"
    }
}

/**
 * Thrown if a reservation fails to be deleted from the database.
 */
export class DeleteReservationError extends ReservationError {
    constructor(message) {
        super(message)
        this.name = "DeleteReservationError"
    }
}