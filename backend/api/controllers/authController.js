import expressAsyncHandler from "express-async-handler"; // no need for try-catch
import jwt from "jsonwebtoken"

/** Object that maps to backend env MS SSO config variables. */

// Local variables for authorization
/** @type {string | undefined} authorization code to be exchanged for access token. */
let authCode = null
/** @type {string | undefined} access token given in exchange for authorization code. */
let accessToken = null
/** @type {string | undefined} id token used to access secure user data. */
let idToken = null

/**
 * Set the access token.
 */
const setAccessToken = (token) => {
    accessToken = token
}

/**
 * Get the access token (for use in other files that need token for secure API calls).
 * @returns accessToken for making secure API calls
 */
export const getAccessToken = () => {
    return accessToken
}


/**
 * Set the id token.
 */
const setIdToken = (token) => {
    idToken = token
}

/**
 * Get the id token (for getting new access tokens - to be called in other files that need to make new access tokens).
 * @returns idToken for accessing user data
 */
export const getRefreshToken = () => {
    return idToken
}

export const getUserData = () => {
    return jwt.decode(idToken)
}


/**
 * Load in env variables use in Microsoft SSO.
 * @returns object containing Microsoft SSO environment variables.
 */
const getEnv = () => ({
    authUrl: process.env.AUTH_URL,
    tenant: process.env.AUTH_SSO_TENANT,
    clientId: process.env.AUTH_CLIENT_ID,
    responseType: process.env.AUTH_RESPONSE_TYPE,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    redirectUri: process.env.AUTH_REDIRECT_URI,
    scope: process.env.AUTH_SCOPE,
    state: process.env.AUTH_STATE,
    frontendUrl: process.env.FRONTEND_URL,
    mode: process.env.MODE
  });

//Perform Microsoft SSO Authentication to log a user in and return a secure access token for authorized site access.

/**
 * @public
 * Construct authorization URL and start login process.
 * @route /api/auth/login
 */
export const loginFlow = expressAsyncHandler(async (req, res) => {
    console.log("Logging In")
    const env = getEnv()

    const authURL = new URL(env.authUrl);
    authURL.searchParams.append('client_id', env.clientId); 
    authURL.searchParams.append('response_type', env.responseType);
    authURL.searchParams.append('redirect_uri', env.redirectUri); // /api/auth -> which triggers the rest of the login flow
    authURL.searchParams.append('scope', env.scope);
    authURL.searchParams.append('state', env.state);

    res.redirect(authURL.toString())
})


/**
 * @private
 * Request access token (if necessary), put it in a cookie, and redirect to home page.
 * @route /api/auth
 */
export const authFlow = expressAsyncHandler(async (req, res) => {
    console.log("Authorization Started")
    const env = getEnv()

    if(req.query.state != null) {
        if (req.query.state !== env.state) {
            res.status(401)
            throw new Error ("You are not authorized to access this site.")
          }
    }else{
        res.status(400)
            throw new Error ("state is null")
    }


    //stores code received from sso
    if(req.query.code != null){
        authCode = req.query.code
    }
    //checks to see if code is set. Throws error if not
    if(authCode == null){
        console.log('Error fetching code from SSO')
        res.status(500)
        throw new Error('Error fetching code from SSO')
    
    // if code is valid but no token, redirect to token endpoint
    } else if(authCode != null && accessToken == null){ 
        console.log('Redirecting to token endpoint')
        res.redirect('/api/auth/token')
    
    //if code and token are valid, sends decoded user info
    }else if(authCode != null && accessToken != null){
        const one_day = 24 * 60 * 60 * 1000 // 1 day
        const two_minutes =  60 * 1000 * 2 // 1 minute

        // console.log("Access Token:", accessToken)
        // console.log("Id Token:", idToken)


        console.log('Storing token in cookie & Redirecting to frontend')

        // Set the browser cookies for secure frontend backend integration and redirect to home page.
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: true, //IF sameSite IS NONE, THIS MUST BE TRUE env.mode === 'production',
            sameSite: 'None', // or 'Lax' depending on flow, 'Strict' only if app and server run on the same host
            maxAge: two_minutes // controls how long browser keeps you logged in
        }).redirect(env.frontendUrl); // let frontend handle redirect

        // res.status(200).json({message: "Logged In"})
    }else{
        res.status(500)
        throw new Error('Undetermined Error')
    }
})


/**
 * @private
 * Exchange authorization code for access token (if it doesn't already exist).
 * @route /api/auth/token
 */
export const createAccessToken = expressAsyncHandler(async (req, res) => {
    const env = getEnv()
    
    console.log("Getting Access Token")
    
    if(authCode == null){
        res.status(500)
        throw new Error('Authentication code is null')
    }else{ // fetch access token
        const urlParams = new URLSearchParams({
            tenant: env.tenant,
            client_id: env.clientId,
            code: authCode,
            redirect_uri: env.redirectUri,
            grant_type: 'authorization_code',
            client_secret: env.clientSecret
        })

        const response = await fetch(`https://login.microsoftonline.com/${env.tenant}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: {
                /** @type {string} request type the API is expecting. */
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlParams.toString(),
        })

        if (!response.ok) {
            res.status(400)
            throw new Error("Failed to fetch access token");
        }

        const tokenData = await response.json()
        console.log(tokenData)

        setAccessToken(tokenData.access_token)
        setIdToken(tokenData.id_token)
        res.redirect(`/api/auth?state=${env.state}`)
    }
})


export const authenticateUser = expressAsyncHandler(async (req, res) => {
    const token = req.cookies.access_token;
    if (!token){
         res.status(401).json({ authenticated: false });
    }else{
        // Optionally verify token here (JWT decode etc.)
        res.status(200).json({ authenticated: true });
    }
})


/**
 * @private
 * Log current user (room or admin) out and set key variables to null.
 * @route /api/auth/logout
 */
export const logoutFlow = expressAsyncHandler(async (req, res) => {
    const env = getEnv()
    console.log("Logging Out")
    authCode = null
    setAccessToken(null)
    setIdToken(null)
    res.clearCookie('access_token', {
        httpOnly: true,
            secure: true, // env.mode === 'production', // IF sameSite IS NONE, THIS MUST BE TRUE //
            sameSite: 'None', // or 'Lax' depending on flow, 'Strict' only if app and server run on the same host
    });

    res.redirect(`https://login.microsoftonline.com/${env.tenant}/oauth2/v2.0/logout`)
})