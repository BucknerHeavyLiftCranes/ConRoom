import expressAsyncHandler from "express-async-handler"; // no need for try-catch



/**
 * @private
 * get user's details from Microsoft
 * @route api/admin/current
 */
export const getUserDetails = expressAsyncHandler(async (req, res) => {
    try {
        const accessToken = req.cookies.access_token ?? req.accessToken

        if (!accessToken) {
            return res.status(400).json({ message: 'No access token found in cookies.' });
        }

        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            }
        });

        const userDetails = await response.json()

        if (!response.ok) {
            if (response.status === 401) {
                res.status(401);
                throw new Error('Access token expired or unauthorized.');
            }

            const errorDetails = userDetails;
            console.error("Microsoft Graph API Error:", errorDetails);
            res.status(500)
            throw new Error('Failed to get user details from Microsoft');
        }


        const { id, displayName, mail } = userDetails;
        
        const email = mail || userDetails.userPrincipalName; // `mail` can sometimes be null — fallback on `userPrincipalName`
        const name = displayName || "Unknown User"; // `displayName` can sometimes be null — fallback on `Unknown User`
        
        if (!email) {
            throw new Error('Unable to determine admin email from Microsoft account');
        }

        res.status(200).json({
            id,
            name,
            email
        })
    } catch (err) {
        console.log({message: err.message, stack: err.stack});
        res.status(500)
        throw new Error ('Internal server error while retrieving user details');
    }
})