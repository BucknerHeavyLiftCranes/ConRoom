import express from "express"
import { loginFlow, authFlow, createAccessToken, authenticateUser, logoutFlow } from "../controllers/authController.js"

export const router = express.Router()

router.get("/login", loginFlow)

router.get("/", authFlow)

router.get('/token', createAccessToken)

router.get('/me', authenticateUser)

router.get('/logout', logoutFlow)