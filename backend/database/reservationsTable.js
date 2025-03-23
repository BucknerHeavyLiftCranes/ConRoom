import mssql from "mssql"
import { connectToDatabase } from "../config/dbConnection.js"
import DB_COMMANDS  from "../../constants/dbCommands.js"
import  Reservation  from "../model/Reservation.js";
import { getRoomById } from "./roomsTable.js";
import InvalidTimeError from "../../errors/InvalidTimeError.js";
import { NoRoomError } from "../../errors/RoomError.js";

let pool

try{
    if (!pool){
        pool = await connectToDatabase()
    }
}catch (err) {
    console.log(`Failed to connect to database: ${err}`)
}

/**
 * Fetch all reservations.
 * @returns {Promise<Reservation[]>} all reservations in the system.
 */
export const getAllReservations = async () => { 
    try {
        const result = await pool.request().query(DB_COMMANDS.getAllReservations);
        const allReservationsData = result.recordset;
        const allReservations = []
        allReservationsData.forEach(
            (reservation) => allReservations.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        )
        return allReservations
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to retrieve reservations: ${err.message}`);
      }
 };

/**
 * Fetch a specific reservation by its unique id.
 * @returns {Promise<Reservation> | undefined} a room in the database.
 */
export const getReservationById = async (reservationId) => { 
    try {
        const result = await pool.request()
        .input('reservation_id', mssql.Int, reservationId)
        .query(DB_COMMANDS.getReservationById);

        const reservationData = result.recordset?.[0];

        if (reservationData){
            return Reservation.toModel(reservationData) // convert each database record to a Room object
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to retrieve reservation: ${err.message}`);
      }
 };

/**
 * Fetch all reservations for a specific room by the room id.
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
          throw new Error(`Failed to retrieve reservations for this room: ${err.message}`);
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
          throw new Error(`Failed to retrieve reservations on ${date}: ${err.message}`);
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

        const allReservationsForThisRoomOnThisDateData = result.recordset;
        const allReservationsForThisRoomOnThisDate = []
        allReservationsForThisRoomOnThisDateData.forEach(
            (reservation) => allReservationsForThisRoomOnThisDate.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        )
        return allReservationsForThisRoomOnThisDate
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to retrieve reservations on ${date} for this room on: ${err.message}`);
      }
 };

/**
 * Fetch all reservations for a room on a specific date.
 * @returns {Promise<Reservation[]>} all reservations for a given room on the given date.
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
          throw new Error(`Failed to retrieve user's reservations: ${err.message}`);
      }
 };

/**
 * Fetch all reservations in a specific status.
 * @returns {Promise<Reservation[]>} all reservations for the given status.
 */
export const getReservationsByStatus = async (status) => { 
    try {
        const result = await pool.request()
        .input('status', mssql.VarChar(20), status)
        .query(DB_COMMANDS.getReservationsByStatus);

        const allReservationsForThisRoomOnThisDateData = result.recordset;
        const allReservationsForThisRoomOnThisDate = []
        allReservationsForThisRoomOnThisDateData.forEach(
            (reservation) => allReservationsForThisRoomOnThisDate.push(Reservation.toModel(reservation)) // convert each database record to a Reservation object
        )
        return allReservationsForThisRoomOnThisDate
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to retrieve reservations with status '${status}': ${err.message}`);
      }
 };


/**
 * Create a new reservation.
 * @returns {Promise<Reservation>} newly created reservation.
 */
export const createReservation = async (reservationData) => { 
    try {
        validateReservation(reservationData)

        const reservationDetails = reservationData.fromModel()

        const result = await pool.request()
        .input('title', mssql.VarChar(255), reservationDetails.title)
        .input('room_id', mssql.Int, reservationDetails.roomId)
        .input('user_email', mssql.VarChar(255), reservationDetails.userEmail)
        .input('date', mssql.Date, reservationDetails.date)
        .input('start_time', mssql.Time, reservationDetails.startTime)
        .input('end_time', mssql.Time, reservationDetails.endTime)
        .input('status', mssql.VarChar(20), reservationDetails.status)
        .query(DB_COMMANDS.createNewReservation);


        console.log("==================================================================")
        console.log(`Reservation created successfully: ${result.rowsAffected} row(s) added.`);
        console.log("==================================================================")

        const newReservationData = result.recordset?.[0]
        if (!newReservationData){
            throw new Error("Failed to retrieve new room data")
        }
        const newReservation = Reservation.toModel(newReservationData)

        return newReservation;
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to retrieve reservations: ${err.message}`);
      }
 };

/**
 * Fetch all reservations in a specific status.
 * @returns {Promise<Reservation[]>} all reservations for the given status.
 */
export const deleteReservations = async (reservationId) => { 
    try {
        const deletedReservation = await getReservationById(reservationId)
    
        if (!deletedReservation){
            throw new Error(`This reservation doesn't exist`);
        }
        const result = await pool.request()
        .input('reservation_id', mssql.Int, reservationId)
        .query(DB_COMMANDS.deleteReservation);

        console.log("==================================================================")
        console.log(`Reservation deleted successfully: ${result.rowsAffected} row(s) deleted.`);
        console.log("==================================================================")
        return deletedReservation;

      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to delete reservation': ${err.message}`);
      }
 };

/**
 * @param {Reservation} reservation reservation to validate.
 * @throws {InvalidTimeError} If the reservation has an invalid time or conflicts with another reservation.
 * @throws {NoRoomError} if the intended room for a reservation does not exist
 * @throws {Error} If an unexpected validation error occurs.
 * @returns {Promise<boolean>} `true` if the reservation is valid; throws an error if otherwise.
 */
export const validateReservation = async (reservation) => { 
/* Checks before creating a new reservation (from easiest to hardest):
    1. That its start and end times are valid ✅
    2. That its date is valid ✅
    3. It does not go outside a room's open hours ✅
    4. The room exists ✅ 
    5. It does not conflict with another reservation ✅
*/      

try{
    // 1. Validate meeting duration
    if (!reservation.hasValidDuration()){
        throw new InvalidTimeError(`This reservation has an invalid meeting time`);
    }

    // 2. Ensure reservation is not in the past
    if (!reservation.hasValidDateAndTime()){
        throw new InvalidTimeError(`This date and time for this reservation has already passed.`);
    }
    
    // 3. Fetch room details & validate open hours
    const reservationRoom = await getRoomById(reservation.roomId)
        // 4. The room exists ✅ 
        if(reservationRoom){
            if (!reservationRoom.isOpen(reservation.startTime, reservation.endTime)){
                throw new InvalidTimeError(`Room ${reservationRoom.roomName} will be closed during this resevation`);
            }
        }else{
            throw new NoRoomError(`This room for this reservation doesn't exist.`)
        }

    // 5. Check for conflicts with existing reservations
    const otherReservations = await getReservationsByRoomAndDate(reservation.roomId, reservation.date)
    for (let otherReservation of otherReservations){
        if (reservation.conflictsWith(otherReservation)){
            throw new InvalidTimeError(`This reservation conflicts with ${otherReservation.title}`); // maybe change to otherReservation.title
        }
    }

    return true
}catch(err){
    console.error({ message: err.message, stack: err.stack });
    if (err instanceof InvalidTimeError){
        throw err
    }
    throw new Error(`Failed to validate reservation: ${err.message}`);
}
}