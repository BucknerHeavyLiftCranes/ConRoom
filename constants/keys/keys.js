// /** @type {string} path to server root (should use more specific paths). */
// export const rootKey = `http://localhost:5173`

/** @type {string} path to resevations API. */
// export const reservationKey = `http://localhost:5173/api/reservations`

// /** @type {string} path to server rooms API. */
// export const roomKey = `http://localhost:5173/api/rooms`

// /** @type {string} path to server authentication API. */
// export const authKey = `http://localhost:5173/api/auth`

// /** @type {string} path to server administrator API. */
// export const adminKey = `http://localhost:5173/api/admin`

// /** @type {string} path to server calendar API. */
// export const calendarKey = `http://localhost:5173/api/calendar`


/**
 * Construct route to any API.
 * @param {string} endpoint name of unique route
 * @returns absolute API path
 */
export const makeRoute = (endpoint) => {
    return `http://localhost:5173/api/${endpoint}`
}