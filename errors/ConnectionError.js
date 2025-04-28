/**
 * Thrown when a connection fails.
 */
export class ConnectionError extends Error {
    constructor(message) {
        super(message)
        this.name = "InvalidTimeError"
    }
}

/**
 * Thrown when a connection to the database fails.
 */
export class DatabaseConnectionError extends ConnectionError {
    constructor(message) {
        super(message)
        this.name = "DatabaseConnectionError"
    }
}