import express from "express"
import { loginFlow, authFlow, getAccessToken, logoutFlow } from "../controllers/authController.js"

export const router = express.Router()

router.get("/login", loginFlow)

router.get("/", authFlow)

router.get('/token', getAccessToken)

router.get('/logout', logoutFlow)