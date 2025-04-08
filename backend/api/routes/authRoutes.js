import express from "express"
import { loginFlow, authFlow, getAccessToken } from "../controllers/authController.js"

export const router = express.Router()

router.get("/login", loginFlow)

router.get("/", authFlow)

router.get('/token', getAccessToken)