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

/**
 * Time Zone Converters for all the time zones.
 * @namespace tzc
 */
export const tzc = new Intl.DateTimeFormat('en-US', {
        timeZone: "America/New_York", //Intl.DateTimeFormat().resolvedOptions().timeZone, // time zone of the current device
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
  