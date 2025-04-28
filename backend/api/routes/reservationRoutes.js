import express from "express"

export const router = express.Router()

import { handleGetAllReservation, handleDeleteReservation } from "../controllers/reservationController.js"

router.get("/", handleGetAllReservation)


router.route("/:id")
      .get()
      .delete(handleDeleteReservation)