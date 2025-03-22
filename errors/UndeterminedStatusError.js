/**
 * Thrown if an object's status can't be determined.
 */
export default class UndeterminedStatusError extends Error {
    constructor(message) {
        super(message)
        this.name = "UndeterminedStatusError"
    }
}