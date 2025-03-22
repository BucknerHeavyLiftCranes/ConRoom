import mssql from "mssql"
import { connectToDatabase } from "../config/dbConnection.js"
import { DB_COMMANDS } from "../../constants/dbCommands.js"
import  Reservation  from "../model/Reservation.js";

let pool

try{
    if(!pool){
        pool = await connectToDatabase()
    }
}catch (err) {
    console.log(`Failed to connect to database: ${err}`)
}

/**
 * Fetch all reservations from the database.
 * @returns {Promise<Reservation[]>} an array of all reservations in the database.
 */
export const getAllReservations = async () => { 
    try {
        const result = await pool.request().query(DB_COMMANDS.getAllReservations);
        const allReservationsData = result.recordset;
        const allReservations = []
        allReservationsData.forEach((reservation) => allReservations.push(Reservation.toModel(reservation))) // convert each database record to a Reservation object
        return allReservations
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to retrieve reservations: ${err.message}`);
      }
 };