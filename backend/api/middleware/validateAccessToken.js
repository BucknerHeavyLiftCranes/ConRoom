import expressAsyncHandler from 'express-async-handler'
import { clearAuthCookies, refreshAccessToken, setAuthCookies } from '../controllers/authController.js';
import { getAdminById, updateAdminRefreshToken } from '../../database/adminsTable.js';

/**
 * Validate access token and refresh it if necessary (silent authentication - persists website access).
 */
const validateAccessToken = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.cookies.user_id;
        const accessToken = req.cookies.access_token;
    
        // ✅ Access token is still valid — let them through
        if (accessToken) {
        return next();
        }
    
        // ❌ Can't do anything if userId is missing
        if (!userId) {
            clearAuthCookies(res)
            // return res.status(401).json({ message: "No user session. Please log in." });
            return req.accepts('html')
            ? res.status(401).send('<script>window.location.href="/";</script>')
            : res.status(401).setHeader("X-Reauth-Required", "true").json({ message: "No user session. Please log in." });
        }
    
        // ✅ Get user from DB
        const currentAdmin = await getAdminById(userId);
    
        if (!currentAdmin || !currentAdmin.refreshToken) {
            clearAuthCookies(res);
            // return res.status(401).json({ message: "Session invalid. Please log in." });
            return req.accepts('html')
            ? res.status(401).send('<script>window.location.href="/";</script>')
            : res.status(401).setHeader("X-Reauth-Required", "true").json({ message: "Session invalid. Please log in." });
        }
    
        // 🔁 Attempt to refresh
        const tokenData = await refreshAccessToken(userId, currentAdmin.refreshToken);
    
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn } = tokenData;
    
        // ✅ Update refresh token in DB if Microsoft rotated it
        if (newRefreshToken && newRefreshToken !== currentAdmin.refreshToken) {
            await updateAdminRefreshToken(userId, newRefreshToken);
        }
    
        // 🍪 Set fresh cookies
        setAuthCookies(res, newAccessToken, userId, expiresIn, Boolean(newRefreshToken));
        req.accessToken = newAccessToken
        // ✅ Proceed to route
        next();
        
    } catch (err) {
        console.error("Token refresh failed:", err.message);
        clearAuthCookies(res);
        return req.accepts('html')
            ? res.status(401).send('<script>window.location.href="/";</script>')
            : res.status(401).setHeader("X-Reauth-Required", "true").json({ message: "Session expired. Please log in again." });

    }
});

export default validateAccessToken
  