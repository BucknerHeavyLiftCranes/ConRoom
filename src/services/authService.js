

/** shorthand for `import.meta.env` */
const env = import.meta.env;

/**
 * Construct and return the authorization URL.
 * @returns {string} Authorization URL.
 */
const getAuthURL = () => {
    /** @type {URL} URL object for constructing the authorivation URL */
    const authURL = new URL(env.VITE_AUTH_URL);
    authURL.searchParams.append('client_id', env.VITE_AUTH_CLIENT_ID); 
    authURL.searchParams.append('response_type', env.VITE_AUTH_RESPONSE_TYPE);
    authURL.searchParams.append('redirect_uri', env.VITE_AUTH_REDIRECT_URI);
    authURL.searchParams.append('scope', env.VITE_AUTH_SCOPE);
    authURL.searchParams.append('state', env.VITE_AUTH_STATE);

    return authURL.toString();
}

/**
 * Redirect window to external login page.
 */
export const loginRedirect = () => {
    window.location.href = getAuthURL()
}


