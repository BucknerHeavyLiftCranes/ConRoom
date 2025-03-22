/**
 * Thrown if an objects start or end time is not valid.
 */
export class InvalidTimeError extends Error {
    constructor(message) {
        super(message)
        this.name = "InvalidTimeError"
    }
}