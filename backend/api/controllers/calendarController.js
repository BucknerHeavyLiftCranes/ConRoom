import expressAsyncHandler from "express-async-handler"
import { ResponseError } from "../../../errors/ApiError.js";
import OutlookEvent from "../model/OutlookEvent.js";

export const getAllEvents = expressAsyncHandler(async (req, res) => {
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
            throw new ResponseError(`Failed to get events from Microsoft: ${JSON.stringify(errorDetails)}`);
        }

        /**@type {any[]} all events in the response*/
        const rawEvents = eventDetails.value;

        if(!rawEvents) {
            res.status(401)
            throw new ResponseError("Could not resolve 'events' from response");
        }

        // const rawEventsArray = []
        // rawEvents.forEach( (rawEvent) => {
        //     rawEventsArray.push({
        //         subject: rawEvent.subject,
        //         start: rawEvent.start,
        //         end: rawEvent.end,
        //         timezone: rawEvent.originalStartTimeZone
        //     })
        // })

        // console.log("================================Raw Event objects from Outlook======================================================")
        // console.log("RAW EVENTS:", rawEventsArray)
        // console.log("====================================================================================================================")

        /**@type {OutlookEvent[]} all events in the response*/
        const filteredEvents = rawEvents.map( (rawEvent) => OutlookEvent.fromObject(rawEvent))
        // const filteredEventsArray = []
        // filteredEvents.forEach( (filteredEvent) => {
        //     filteredEventsArray.push({
        //         subject: filteredEvent.subject,
        //         start: filteredEvent.start,
        //         end: filteredEvent.end,
        //     })
        // })

        // console.log("================================Filtered Event objects via OutlookEvent class=======================================")
        // console.log("FILETERED EVENTS:", filteredEventsArray)
        // console.log("====================================================================================================================")

        res.status(200).json(filteredEvents)
    } catch (err) {
        console.log({message: err.message, stack: err.stack});
        res.status(500)
        throw new Error ('Internal server error while retrieving user details');
    }
})


/**
 * @private
 * Create a new event in Microsoft Outlook calendar.
 * @route /api/calendar/create
 * @method POST
 */
export const createEvent = expressAsyncHandler(async (req, res) => {
    try {
        if (!req.body){
            res.status(400).json({error: "No body given"})
        }

        const newEvent = req.body
        const accessToken = req.cookies.access_token ?? req.accessToken

        if(!accessToken) {
            return res.status(400).json({ message: 'No access token found in cookies.' }); // should redirect to logout?
        }

        const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(newEvent)
        });

        const newEventDetails = await response.json()

        if (!response.ok) {
            if (response.status === 401) {
                res.status(401);
                throw new Error('Access token expired or unauthorized.');
            }

            const errorDetails = newEventDetails
            res.status(response.status)
            throw new Error(`Failed to create new event in Outlook: ${JSON.stringify(errorDetails)}`);
        }

        const newOutlookEvent = OutlookEvent.fromObject(newEvent)

        res.status(201).json(newOutlookEvent)


    } catch (err) {
        console.error(err.message)
        res.status(400).json({message: err.message, stack: err.stack})
    }
    
})