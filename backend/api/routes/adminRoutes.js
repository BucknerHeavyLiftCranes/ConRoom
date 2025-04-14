import express from "express"
import {getUserDetails} from "../controllers/adminController.js"
import validateAccessToken from "../middleware/validateAccessToken.js"

export const router = express.Router()

router.get("/current", validateAccessToken, getUserDetails)