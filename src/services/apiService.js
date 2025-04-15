import { ResponseError } from "../../errors/ApiError";

/**
 * Validate an API response and return its payload.
 * @param {Response} response API response.
 * @param {string} message error message thrown if response is not ok.
 * @throws {ResponseError} when API returns a bad response.
 * @returns {Promise<any>} the data from the response.
 */
export const verifyAndExtractResponsePayload = async (
    response, 
    message = "Failed to extract payload from response"
) => {
    try {
        if (!response) {
            return undefined;
        }

        const payload = await response.json();

        if (!response.ok) {
            throw new ResponseError(`${message}: ${JSON.stringify(payload)}`);
        }

        return payload;     
    } catch (err) {
        console.error({ message: err.message, stack: err.stack });
    }
}

/**
 * A wrapper around fetch function that handles session expiration smoothily.
 * Redirects to login if user is unauthenticated and/or token is expired.
 * @param {string} url The endpoint to fetch.
 * @param {object} [options={}] Fetch options (method, headers, etc.)
 * @returns {Promise<Response>} The fetch response.
 */
export const fetchWithAuth = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            credentials: 'include', // Important for cookies!
            headers: { Accept: "application/json", ...(options.headers || {}) },
            ...options
          });
        
          if (response.status === 401 && response.headers.get("X-Reauth-Required") === "true") {
            // Redirect user to login page
            window.location.href = "/";
            return null; // Negate risk of code below running
          }
        
          return response;
    } catch (err) {
        console.error({ message: err.message, stack: err.stack });
    }
  };
  