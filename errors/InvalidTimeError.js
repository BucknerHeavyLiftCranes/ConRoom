/**
 * Thrown if an object's start or end time is not valid.
 */
export default class InvalidTimeError extends Error {
    constructor(message) {
        super(message)
        this.name = "InvalidTimeError"
    }
}