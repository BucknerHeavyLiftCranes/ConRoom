import { ResponseError } from "../../errors/ApiError";
/** shorthand for `import.meta.env` */
// const env = import.meta.env;

/** Object that maps to frontend env variables. */
const env = {
    authUrl: import.meta.env.VITE_AUTH_URL,
    tenant: import.meta.env.VITE_AUTH_TENANT,
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
    responseType: import.meta.env.VITE_AUTH_RESPONSE_TYPE,
    ssoSecret: import.meta.env.VITE_AUTH_SSO_SECRET,
    redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI,
    scope: import.meta.env.VITE_AUTH_SCOPE,
    state: import.meta.env.VITE_AUTH_STATE,
}

/**
 * Construct and return the authorization URL.
 * @returns {string} Authorization URL.
 */
const getAuthURL = () => {
    /** @type {URL} URL object for constructing the authorivation URL */
    const authURL = new URL(env.authUrl);
    authURL.searchParams.append('client_id', env.clientId); 
    authURL.searchParams.append('response_type', env.responseType);
    authURL.searchParams.append('redirect_uri', env.redirectUri);
    authURL.searchParams.append('scope', env.scope);
    authURL.searchParams.append('state', env.state);

    return authURL.toString();
}

/**
 * Redirect window to external login page.
 */
export const loginRedirect = () => {
    window.location.href = getAuthURL()
}


/**
 * send and API POST request to get an access token.
 * @param {string} authCode authorization code to be exchanged for an access token.
 */
export const requestAccessToken = async (authCode) => {
    try {
        const urlParams = new URLSearchParams({
            client_id: env.clientId,
            // scope: 'https://graph.microsoft.com/mail.read',
            code: authCode,
            redirect_uri: env.redirectUri,
            grant_type: 'authorization_code',
            // code_verifier: 'ThisIsntRandomButItNeedsToBe43CharactersLong',
            client_secret: env.ssoSecret
        })

        const response = await fetch(`/${env.tenant}/oauth2/v2.0/token HTTP/1.1`, {
            method: 'POST',
            headers: {
                /** @type {string} request type the API is expecting. */
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlParams.toString(),
        })
    
        if (!response.ok) {
            throw new Error("Error getting access token")
        }

        const tokenData = response.json()
        console.log(tokenData)
    } catch (err) {
        console.error({message: err.message, stack: err.stack})
        
    }
}

/**
 * Validate an API response.
 * @param {Response} response API response
 * @param {string} message error message if response is not ok.
 * @throws {ResponseError} when API returns a bad response, otherwise returns control back to caller function.
 */
export const checkResponse = (response, message) => {
    if (!response.ok) {
        throw new ResponseError(message)
    }
}