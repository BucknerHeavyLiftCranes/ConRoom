/**
 * Enum of various HTTP status codes for error checking.
 */
export const HTTP_STATUS_CODES = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401, // User does not have credentials to access resource (i.e. someone not logged in).
    FORBIDDEN: 403, // User has credentials but lacks permission to access reosurce (i.e. a user who is not an admin).
    NOT_FOUND: 404,
    REQUEST_CONFLICT: 409,
    SERVER_ERROR: 500
}

// const STATUS_MAP = {
//     1: "Confirmed",
//     2: "In Progress",
//     3: "Completed",
//     4: "Canceled",
// }