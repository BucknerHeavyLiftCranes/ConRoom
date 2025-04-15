import expressAsyncHandler from "express-async-handler"
import { ResponseError } from "../../../errors/ApiError.js";

export const getAllEvents = expressAsyncHandler(async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token ?? req.accessToken

        if (!accessToken) {
            return res.status(400).json({ message: 'No access token found in cookies.' });
        }

        const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        const eventDetails = await response.json()

        if (!response.ok) {
            if (response.status === 401) {
                res.status(401);
                throw new Error('Access token expired or unauthorized.');
            }

            const errorDetails = eventDetails;
            console.error("Microsoft Graph API Error:", errorDetails);
            res.status(500)
            throw new ResponseError(`Failed to get events from Microsoft: ${errorDetails}`);
        }


        const events = eventDetails.value;

        if(!events) {
            res.status(401)
            throw new ResponseError("Could not resolve 'events' from response");
        }

        res.status(200).json({events})
    } catch (err) {
        console.log({message: err.message, stack: err.stack});
        res.status(500)
        throw new Error ('Internal server error while retrieving user details');
    }
})