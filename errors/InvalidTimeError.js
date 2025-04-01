/**
 * Thrown if an object's start or end time is not valid.
 */
export class InvalidTimeError extends Error {
    constructor(message) {
        super(message)
        this.name = "InvalidTimeError"
    }
}

/**
 * Thrown when the format of an object's start or end time is not valid (HH:MM).
 */
export class InvalidTimeFormatError extends InvalidTimeError {
    constructor(message) {
        super(message)
        this.name = "InvalidTimeFormatError"
    }
}