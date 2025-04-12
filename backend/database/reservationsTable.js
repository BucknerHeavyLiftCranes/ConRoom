import mssql from "mssql"
import { connectToDatabase } from "../config/dbConnection.js"
import DB_COMMANDS  from "../../constants/dbCommands.js"
import  Reservation  from "../api/model/Reservation.js";
import { getRoomById } from "./roomsTable.js";
import { InvalidTimeError } from "../../errors/InvalidTimeError.js";
import { GetRoomError } from "../../errors/RoomError.js";
import { CreateReservationError, DeleteReservationError, GetReservationError, ReservationCanceledError, ReservationInProgressError, UpdateReservationError } from "../../errors/ReservationError.js";
import { ReservationValidationError } from "../../errors/ReservationError.js";
import UndeterminedStatusError from "../../errors/UndeterminedStatusError.js";
import { DatabaseConnectionError } from "../../errors/ConnectionError.js";

/**@type {mssql.ConnectionPool} */
let pool

try{
    if (!pool){
        pool = await connectToDatabase()
    }
}catch (err) {
    console.error({ message: err.message, stack: err.stack });
    throw new DatabaseConnectionError("Failed to connect to database")
}


/**
 * Fetch all reservations.
 * @returns {Promise<Reservation[]>} all reservations in the system.
 */
export const getAllReservations = async () => { 
    try {
        const result = await pool.request().query(DB_COMMANDS.getAllReservations);
        
        if(!result.recordset){
            return []
        }
        const allReservationsData = result.recordset;
        
        /** @type {Reservation[]} */
        const allReservations = []
        allReservationsData.forEach(
            (reservation) => allReservations.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        )
        return allReservations
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve reservations: ${err.message}`);
      }
 };


/**
 * Fetch a specific reservation by its unique id.
 * @param {number} reservationId id of the reservation to fetch.
 * @returns {Promise<Reservation | undefined>} a reservation in the database.
 */
export const getReservationById = async (reservationId) => { 
    try {
        const result = await pool.request()
        .input('reservation_id', mssql.Int, reservationId)
        .query(DB_COMMANDS.getReservationById);

        const reservationData = result.recordset?.[0];

        if (reservationData){
            return Reservation.toModel(reservationData) // convert each database record to a Reservation object
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve reservation: ${err.message}`);
      }
 };


/**
 * Fetch all reservations for a specific room.
 * @param {number} roomId room id of the reservation to fetch.
 * @returns {Promise<Reservation[]>} all reservations for the given room.
 */
export const getReservationsByRoomId = async (roomId) => { 
    try {
        const result = await pool.request()
        .input('room_id', mssql.Int, roomId)
        .query(DB_COMMANDS.getReservationsByRoomId);

        const allReservationsForThisRoomData = result.recordset;
        const allReservationsForThisRoom = []
        allReservationsForThisRoomData.forEach(
            (reservation) => allReservationsForThisRoom.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        )
        return allReservationsForThisRoom
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve reservations for this room: ${err.message}`);
      }
 };


/**
 * Fetch all reservations on a specific date.
 * @returns {Promise<Reservation[]>} all reservations on the given date.
 */
export const getReservationsByDate = async (date) => { 
    try {
        const result = await pool.request()
        .input('date', mssql.Date, date)
        .query(DB_COMMANDS.getReservationsByDate);

        const allReservationsOnThisDateData = result.recordset;
        const allReservationsOnThisDate = []
        allReservationsOnThisDateData.forEach(
            (reservation) => allReservationsOnThisDate.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        )
        return allReservationsOnThisDate
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve reservations on ${date}: ${err.message}`);
      }
 };


/**
 * Fetch all reservations for a room on a specific date.
 * @returns {Promise<Reservation[]>} all reservations for a given room on the given date.
 */
export const getReservationsByRoomAndDate = async (roomId, date) => { 
    try {
        const result = await pool.request()
        .input('room_id', mssql.Int, roomId)
        .input('date', mssql.Date, date)
        .query(DB_COMMANDS.getReservationsByRoomAndDate);

        const allReservationsForThisRoomAndDateData = result.recordset;
        const allReservationsForThisRoomAndDate = []
        allReservationsForThisRoomAndDateData.forEach(
            (reservation) => allReservationsForThisRoomAndDate.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        )
        return allReservationsForThisRoomAndDate
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve reservations on ${date} for this room on: ${err.message}`);
      }
};


/**
 * Fetch all active reservations for a room on a specific date.
 * @returns {Promise<Reservation[]>} all active reservations for a given room on the given date.
 */
export const getActiveReservationsByRoomAndDate = async (roomId, date) => { 
    try {
        const result = await pool.request()
        .input('room_id', mssql.Int, roomId)
        .input('date', mssql.Date, date)
        .query(DB_COMMANDS.getActiveReservationsByRoomAndDate);

        const allActiveReservationsForThisRoomAndDateData = result.recordset;
        const allActiveReservationsForThisRoomAndDate = []
        allActiveReservationsForThisRoomAndDateData.forEach(
            (reservation) => allActiveReservationsForThisRoomAndDate.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        )
        return allActiveReservationsForThisRoomAndDate
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve active reservations on ${date} for this room: ${err.message}`);
      }
};


/**
 * Fetch all of a user's reservations.
 * @returns {Promise<Reservation[]>} all reservations for a given user.
 */
export const getAllUserReservations = async (userEmail) => { 
    try {
        const result = await pool.request()
        .input('user_email', mssql.VarChar(255), userEmail)
        .query(DB_COMMANDS.getReservationsByUserEmail);

        const allUserReservationsData = result.recordset;
        const allUserReservations = []
        allUserReservationsData.forEach(
            (reservation) => allUserReservations.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        ) 
        return allUserReservations
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve user's reservations: ${err.message}`);
      }
 };

/**
 * Fetch all of active reservations.
 * @returns {Promise<Reservation[]>} all active reservations.
 */ 
export const getAllActiveReservations = async () => {
    try {
        const result = await pool.request().query(DB_COMMANDS.getAllActiveReservations);

        const allActiveReservationsData = result.recordset;
        const allActiveReservations = []
        allActiveReservationsData.forEach(
            (reservation) => allActiveReservations.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        ) 
        return allActiveReservations
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve active reservations: ${err.message}`);
      }
 }


/**
 * Fetch all of canceled reservations.
 * @returns {Promise<Reservation[]>} all canceled reservations.
 */ 
 export const getAllCanceledReservations = async () => {
    try {
        const result = await pool.request().query(DB_COMMANDS.getAllCanceledReservations);

        const allCanceledReservationsData = result.recordset;
        const allCanceledReservations = []
        allCanceledReservationsData.forEach(
            (reservation) => allCanceledReservations.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        ) 
        return allCanceledReservations
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve canceled reservations: ${err.message}`);
      }
 }


/**
 * Fetch all reservations in a specific status.
 * @param {string} status the desired status.
 * @returns {Promise<Reservation[]>} all reservations for the given status.
 */
export const getReservationsByStatus = async (status) => { 
    try {
        const validStatus = ["Confirmed", "In Progress", "Completed", "Canceled"]
        if(!(validStatus.includes(validStatus))){
            throw new UndeterminedStatusError(`Status '${status}' cannot be determined. 
                Valid statuses are: \n${validStatus.join(", ")}`)
        }

        const allReservations = await getAllReservations()

        const allReservationsForThisStatus = 
        allReservations.filter((reservation) => reservation.status === status)
    
        return allReservationsForThisStatus
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetReservationError(`Failed to retrieve reservations with status '${status}': ${err.message}`);
      }
 };


/**
 * Create a new reservation.
 * @param {Reservation} reservationData details of the reservation to be created.
 * @returns {Promise<Reservation>} newly created reservation.
 */
export const createReservation = async (reservationData) => { 
    try {
        await validateReservation(reservationData)

        const reservationDetails = reservationData.fromModel()
        // console.log(`Reservation details = `, reservationDetails)

        const result = await pool.request()
        .input('title', mssql.VarChar(255), reservationDetails.title)
        .input('room_id', mssql.Int, reservationDetails.roomId)
        .input('user_email', mssql.VarChar(255), reservationDetails.userEmail)
        .input('date', mssql.Date, reservationDetails.date)
        .input('start_time', mssql.VarChar(10), reservationDetails.start)
        .input('end_time', mssql.VarChar(10), reservationDetails.end)
        .query(DB_COMMANDS.createNewReservation);


        console.log("==================================================================")
        console.log(`Reservation created successfully: ${result.rowsAffected} row(s) added.`);
        console.log("==================================================================")

        const newReservationData = result.recordset?.[0]
        if (!newReservationData){
            throw new GetReservationError("Failed to retrieve new reservation data")
        
        }
        const newReservation = Reservation.toModel(newReservationData)

        return newReservation;
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new CreateReservationError(`Failed to retrieve reservation: ${err.message}`);
      }
 };


/**
 * Update a reservation.
 * @param {Reservation} reservationData updated reservation details.
 * @returns {Promise<Reservation>} updated reservation.
 */
export const updateReservation = async (reservationData) => { 
    try {

        const reservationExists = await getReservationById(reservationData.reservationId)
        
        if(reservationExists){
            await validateReservation(reservationData)
        }else{
            throw new GetReservationError("This reservation doesn't exist")
        }

        const updatedReservationDetails = reservationData.fromModel()

        const result = await pool.request()
        .input('reservation_id', mssql.Int, updatedReservationDetails.reservationId)
        .input('title', mssql.VarChar(255), updatedReservationDetails.title)
        .input('room_id', mssql.Int, updatedReservationDetails.roomId)
        .input('user_email', mssql.VarChar(255), updatedReservationDetails.userEmail)
        .input('date', mssql.Date, updatedReservationDetails.date)
        .input('start_time', mssql.VarChar(10), updatedReservationDetails.start)
        .input('end_time', mssql.VarChar(10), updatedReservationDetails.end)
        .input('canceled', mssql.Bit, updatedReservationDetails.canceled)
        .query(DB_COMMANDS.updateReservation);

        console.log("==================================================================")
        console.log(`Reservation updated successfully: ${result.rowsAffected} row(s) added.`);
        console.log("==================================================================")

        const updatedReservationData = result.recordset?.[0]
        if (!updatedReservationData){
            throw new GetReservationError("Failed to retrieve updated reservation data")
        
        }
        const updatedReservation = Reservation.toModel(updatedReservationData)

        return updatedReservation;
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new UpdateReservationError(`Failed to update reservation: ${err.message}`);
      }
 };


/**
 * Delete a reservation.
 * @param {number} reservationId id of the reservation to delete.
 * @returns {Promise<{ 
    *   reservationId?: number, 
    *   title: string, 
    *   roomId: number, 
    *   roomName: string, 
    *   userEmail: string, 
    *   date: string, 
    *   start: string, 
    *   end: string, 
    *   canceled: boolean, 
    *   status: string 
    * 
 * }>}
 * details of the deleted reservation
 */
export const deleteReservation = async (reservationId) => { 
    try {
        const reservationToDelete = await getReservationById(reservationId)
    
        if (!reservationToDelete){
            throw new GetReservationError(`This reservation doesn't exist`);
        }

        const deletedMeeting = await reservationToDelete.toMeetingDetails()

        if (reservationToDelete.status === "In Progress") {
            throw new ReservationInProgressError("This meeting has already started")
        }

        const result = await pool.request()
        .input('reservation_id', mssql.Int, reservationId)
        .query(DB_COMMANDS.deleteReservation);

        console.log("==================================================================")
        console.log(`Reservation deleted successfully: ${result.rowsAffected} row(s) deleted.`);
        console.log("==================================================================")

        return deletedMeeting
      } catch (err) {
        console.error({ message: err.message, stack: err.stack });
        throw new DeleteReservationError(`Failed to delete reservation': ${err.message}`);
      }
 };


/**
 * Cancel or uncancel a reservation.
 * @param {Reservation} reservation reservation to cancel or uncancel.
 * @returns {Promise<Reservation>} canceled/uncanceled reservation.
 */
export const toggleReservationCanceledStatus = async (reservation) => { 
    try {

        // const reservationExists = await getReservationById(reservation.reservationId)
        // if(!reservationExists){
        //     throw GetReservationError("This reservation doesn't exists")
        // } // MAY BE REDUNDANT SINCE updateReservation ALREADY CHECKS THIS

        reservation.toggleCanceledStatus()

        const canceledReservation = await updateReservation(reservation)
        const canceledStatus = canceledReservation.status.toLowerCase()

        console.log("==============================================")
        console.log(`Reservation ${canceledStatus} successfully.`);
        console.log("==============================================")
        return canceledReservation;

      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new ReservationCanceledError(`Failed to cancel reservation': ${err.message}`);
      }
 };


/**
 * Validate a reservation before create it in into the database.
 * @param {Reservation} reservation reservation to validate.
 * @throws {InvalidTimeError} If the reservation has an invalid time or conflicts with another reservation.
 * @throws {NoRoomError} if the intended room for a reservation does not exist.
 * @throws {RoomValidationError} If an unexpected validation error occurs.
 */
export const validateReservation = async (reservation) => {      
    try{
        // 1. Validate meeting duration
        if (!reservation.hasValidDuration()){
            throw new InvalidTimeError(`This reservation has an invalid meeting time: ${reservation.start} - ${reservation.end}`);
        }

        // 2. Ensure reservation is not in the past
        if (!reservation.hasNotPassed()){
            throw new InvalidTimeError(`The date and time for this reservation has already passed.`);
        }
        
        // 3. Fetch room details & validate open hours
        const reservationRoom = await getRoomById(reservation.roomId)
            // 4. The room exists
            if(reservationRoom){
                if (!reservationRoom.isOpen(reservation.start, reservation.end)){
                    throw new InvalidTimeError(`Room (${reservationRoom.roomName}) will be closed during this time.`);
                }
            }else{
                throw new GetRoomError(`The room for this reservation doesn't exist.`)
            }

        // 5. Check for conflicts with existing active reservations
        let otherActiveReservations = await getActiveReservationsByRoomAndDate(
                                                reservation.roomId, 
                                                reservation.date
                                            )

        if (reservation.reservationId){ // reservation exists (we are updating it)
            otherActiveReservations = otherActiveReservations.filter(
                (otherReservation) => otherReservation.reservationId !== reservation.reservationId
            )
        }


        const conflictingReservation = otherActiveReservations.find(
            (otherReservation) => reservation.conflictsWith(otherReservation)
        );
        
        if (conflictingReservation) {
            throw new InvalidTimeError(
                `This reservation conflicts with '${conflictingReservation.title}'
                from ${conflictingReservation.start} to ${conflictingReservation.end}`
            );
        }
    }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new ReservationValidationError(`Failed to validate reservation: ${err.message}`);
    }
}