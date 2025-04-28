class ApiError extends Error {
    constructor(message) {
        super(message)
        this.name = "ApiError"
    }
}

/**
 * Thrown when API returns a bad response.
 */
export class ResponseError extends ApiError {
    constructor(message) {
        super(message)
        this.name = "ApiError"
    }
}