import expressAsyncHandler from "express-async-handler"; // no need for try-catch
import {deleteReservation, getAllReservations } from "../../database/reservationsTable.js"
import { DeleteReservationError } from "../../../errors/ReservationError.js";

/* NOTE: TWEAK ERROR RESPONSES FROM 'reservationsTable.js' 
SO RELEVANT ERROR INFO IS SENT OVER THE API */

/**
 * Handles API request to fetch reservations.
 */
export const handleGetAllReservation = expressAsyncHandler(async (req, res) => {
    const allReservations = await getAllReservations()

    if (allReservations == []){
        res.status(204).json([])
    }

    const allMeetings = await Promise.all(allReservations.map((meeting) => meeting.toMeetingDetails()));

    res.status(200).json(allMeetings)
})


/**
 * Handles API request to delete a reservation.
 */
export const handleDeleteReservation = expressAsyncHandler(async (req, res) => {
    const reservationId = Number(req.params.id)
    const  deletedMeeting = await deleteReservation(reservationId)

    if (!deletedMeeting){
        res.status(404)
        throw DeleteReservationError("Error getting details for deleted reservation")
    }


    res.status(200).json(deletedMeeting)
})