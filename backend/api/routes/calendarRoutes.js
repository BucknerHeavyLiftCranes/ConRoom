import express from "express"
import validateAccessToken from "../middleware/validateAccessToken.js"
import { getAllEvents } from "../controllers/calendarController.js"


export const router = express.Router()

router.get("/all", validateAccessToken, getAllEvents)



// https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=2025-04-15T01:45:13.194Z&enddatetime=2025-04-22T01:45:13.194Z