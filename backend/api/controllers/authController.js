/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

import expressAsyncHandler from "express-async-handler"; // no need for try-catch
import ms from "ms";
import { createOrUpdateAdmin, updateAdminRefreshToken } from "../../database/adminsTable.js";
import Admin from "../model/Admin.js";
import { ResponseError } from "../../../errors/ApiError.js";

// Global variables for authorization
/** @type {string | undefined} authorization code to be exchanged for access token. */
// let authCode = null
/** @type {string | undefined} access token given in exchange for authorization code. */
// let accessToken = null

/** @type {string | undefined} id token used to access secure user data. */
// let idToken = null


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
    loginPageUrl: process.env.LOGIN_PAGE_URL,
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

    if (req.query.state != null) {
        if (req.query.state !== env.state) {
            res.status(401)
            throw new Error ("You are not authorized to access this site.")
          }
    }else{
        res.status(400)
            throw new Error ("state is null")
    }
    
    const authCode = req.query.code
    const accessToken = req.cookies.access_token
    
    //checks to see if code is set. Throws error if not
    if (authCode == null){
        console.log('Error fetching code from SSO')
        res.status(500)
        throw new Error('Error fetching code from SSO')
    
    // if code is valid but no token, redirect to token endpoint
    } else if (authCode != null && accessToken == null){ 
        console.log('Redirecting to token endpoint')
        res.redirect(`/api/auth/token?code=${authCode}`)
    
    //if code and token are valid, sends decoded user info
    }else if (authCode != null && accessToken != null){
        console.log('Redirecting to frontend')

        res.redirect(env.frontendUrl); // let frontend handle redirect

        // res.status(200).json({message: "Logged In"})
    }else{
        res.status(500)
        throw new Error('Undetermined Error')
    }
})


/**
 * @private
 * Exchange authorization code for access and refresh tokens.
 * Fetch user info from Microsoft, create/update admin in DB,
 * set session cookies, and redirect to /auth for finalization.
 * @route /api/auth/token
 * @method GET
 */
export const createAccessToken = expressAsyncHandler(async (req, res) => {
    const env = getEnv()
    
    console.log("Getting Access Token")

    const authCode = req.query.code
    
    if (authCode == null){
        res.status(500)
        throw new Error('Authentication code is null')
    }else{ // fetch access token
        const urlParams = new URLSearchParams({
            client_id: env.clientId,
            scope: env.scope,
            code: authCode,
            redirect_uri: env.redirectUri,
            grant_type: 'authorization_code',
            client_secret: env.clientSecret,
        })

        const tokenResponse = await fetch(`https://login.microsoftonline.com/${env.tenant}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: {
                /** @type {string} request type the API is expecting. */
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlParams.toString(),
        })

        if (!tokenResponse.ok) {
            res.status(400)
            throw new Error("Failed to fetch access token");
        }

        const tokenData = await tokenResponse.json()

        /** @type {string} */
        const accessToken = tokenData.access_token

        /** @type {string} */
        const refreshToken = tokenData.refresh_token

        /** @type {number} */
        const accessTokenExperationTime = tokenData.expires_in

        /** @type {boolean} */
        const shouldResetUserId =  Boolean(refreshToken)

        if (!accessToken) {
            res.status(400)
            throw new Error('No access token received from Microsoft');
        }

        if (!refreshToken) {
            res.status(400)
            throw new Error('No refresh token received from Microsoft');
        }


        // Fetch user data from Microsoft and create a new admin in the database
        const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
        });

        const userInfo = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
            res.status(userInfoResponse.status)
            throw new Error(`Failed to fetch user profile from Microsoft: ${JSON.stringify(userInfo)}`);
        }
    
        const { id, displayName, mail } = userInfo;

        const email = mail || userInfo.userPrincipalName; // `mail` can sometimes be null — fallback on `userPrincipalName`
        const name = displayName || "Unknown User"; // `displayName` can sometimes be null — fallback on `Unknown User`
        
        if (!email) {
            throw new Error('Unable to determine admin email from Microsoft account');
        }

        const admin = Admin.fromObject({
            id,
            name,
            email,
            refreshToken
        });

        const savedAdmin = await createOrUpdateAdmin(admin);
        console.log(savedAdmin) // 🚨🚨🚨 DELETE LATER 🚨🚨🚨

        // create new cookies for access token and user id
        setAuthCookies(res, accessToken, savedAdmin.id, accessTokenExperationTime, shouldResetUserId)

        // redirect back to finish authentication
        res.redirect(`/api/auth?code=${authCode}&state=${env.state}`)
    }
})


/**
 * Refresh Microsoft access token using a stored refresh token.
 * @param {string} userId id of the user
 * @param {string} refreshToken token needed to refresh access token.
 * @throws {`ResponseError`} thrown if request for new access token fails.
 * @returns {Promise<{ accessToken: string, idToken: string, refreshToken?: string, expiresIn: number }>} new access token (and possible new refresh token - must account for either response).
 * @throws {ResponseError} If refresh fails or response is malformed.
 */
export const refreshAccessToken = async (userId, refreshToken) => {
    try {
        const env = getEnv();
        const urlParams = new URLSearchParams({
            client_id: env.clientId,
            scope: env.scope,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_secret: env.clientSecret,
        })

        const response = await fetch(`https://login.microsoftonline.com/${env.tenant}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: urlParams.toString()
        });
        
        const responseData = await response.json() // { access_token, refresh_token, expires_in, id_token }

        if (!response.ok) {
                throw new ResponseError(`Error ${response.status}: ${JSON.stringify(responseData)}`);
        }

        if (!responseData.access_token) {
            throw new ResponseError('Access token missing from refresh response');
        }

        if (!responseData.id_token) {
            throw new ResponseError('ID token missing from refresh response');
        }

        // accessToken = responseData.access_token
        // idToken = responseData.id_token

        if (responseData.refresh_token) {
            console.log(`Refresh token rotated for user ${userId}`);
        }

        return {
            accessToken: responseData.access_token,
            idToken: responseData.id_token,
            refreshToken: responseData.refresh_token, // optional
            expiresIn: responseData.expires_in
        };
    } catch (err) {
        console.log({ message: err.message, stack: err.stack })
        throw new Error(err)
    }
};


/**
 * @private
 * Determine user's logged in status.
 * @route /api/auth/me
 */
export const validateSession = expressAsyncHandler(async (req, res) => {
    const AvailableAccessToken = req.cookies.access_token;

    if (!AvailableAccessToken){
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

    const userId = req.cookies.user_id

    if (userId) {
        await updateAdminRefreshToken(userId, null);
        console.log(`Cleared refresh token for user ${userId}`);
    }else{
        res.status(400)
        .json({ message: "No active session to log out from." })
    }

    clearAuthCookies(res)

    console.log("Redirected to Microsoft logout");
    res.redirect(`https://login.microsoftonline.com/${env.tenant}/oauth2/v2.0/logout`)

    // redirects user back to login page (must be approved first).
        // res.redirect(`https://login.microsoftonline.com/${env.tenant}/oauth2/v2.0/logout?post_logout_redirect_uri=${env.loginPageUrl}`) 
})

/**
 * Set cookies for app session management.
 * @param {Response} res express API response object.
 * @param {string} accessToken user's access token.
 * @param {string} userId user's id.
 * @param {number} expiresInSeconds access token expiration time (in seconds).
 * @param {boolean} shouldResetUserId reset user_Id cookie (only if we get a new refresh token).
 */
export const setAuthCookies = (res, accessToken, userId, expiresInSeconds, shouldResetUserId) => {
    const baseCookieOptions = {
        httpOnly: true, // Browser (JavaScript) can't access it, only http requests.
        secure: true, // env.mode === 'production', // IF 'sameSite' IS NONE, 'secure' MUST BE TRUE.
        sameSite: 'None', // or 'Lax' depending on flow, 'Strict' only if app and server run on the same host.
    };

    const accessTokenCookieOptions = {
        ...baseCookieOptions, 
        maxAge: expiresInSeconds * 1000 // Controls how long browser keeps you logged in .
    }
    

    const userIdCookieOptions = {
        ...baseCookieOptions, 
        maxAge: ms("90d") // Lifetime of refresh token. Ensures we can refresh access token until session truly ends (ms gives time in milliseconds).
    }

    // Set the browser cookies for secure frontend-backend integration and communication.
    if (accessToken) {
        res.cookie('access_token', accessToken, accessTokenCookieOptions)
    }else{
        res.json(400)
        throw new Error (`No access token was given`)
    }
    if (shouldResetUserId){
        if (userId){
            res.cookie('user_id', userId, userIdCookieOptions)
        }else{
            res.json(400)
            throw new Error (`No user id was given`)
        }
    }
}

/**
 * Clear app's cookies upon session invalidation.
 * @param {Response} res express API response object.
 */
export const clearAuthCookies = (res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
            secure: true, // env.mode === 'production', // IF sameSite IS NONE, THIS MUST BE TRUE //
            sameSite: 'None', // or 'Lax' depending on flow, 'Strict' only if app and server run on the same host
    });

    res.clearCookie('user_id', {
        httpOnly: true,
            secure: true, // env.mode === 'production', // IF sameSite IS NONE, THIS MUST BE TRUE //
            sameSite: 'None', // or 'Lax' depending on flow, 'Strict' only if app and server run on the same host
    });
}