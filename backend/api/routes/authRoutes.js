import express from "express"
import { 
      loginFlow,
      roomLoginFlow, 
      authFlow, 
      createAccessToken, 
      validateSession, 
      logoutFlow } from "../controllers/authController.js"
import validateAccessToken from "../middleware/validateAccessToken.js"

export const router = express.Router()

router.get("/", authFlow)

router.get("/login", loginFlow)

router.get("/roomLogin", roomLoginFlow)

router.get('/token', createAccessToken)

router.get('/validate', validateAccessToken, validateSession)

router.get('/logout', logoutFlow)