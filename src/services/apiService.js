import { ResponseError } from "../../errors/ApiError";

/**
 * Validate an API response and return its payload.
 * @param {Response} response API response.
 * @param {string} message error message thrown if response is not ok.
 * @throws {ResponseError} when API returns a bad response.
 * @returns {Promise<any>} the data from the response.
 */
export const extractPayload = async (response, message = "Failed to extract payload from response") => {
    if (!response.ok) {
        throw new ResponseError(message)
    }
    
    return await response.json()
}