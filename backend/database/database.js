import mssql from "mssql"
import { connectToDatabase } from "../config/dbConnection.js"
import { DB_COMMANDS } from "../../constants/constants.js"


let pool

mssql.ConnectionPool

try{
    pool = await connectToDatabase()
}catch (err) {
    console.log(`DATABASE ERROR: ${err}`)
}

/**
 * Create application database.
 */
async function createBucknerConroomDatabase() {
    try {
      // Create a request and execute the SQL command stored in DB_COMMANDS.createUsersTable
      await pool.request().query(DB_COMMANDS.createBucknerConroomDatabase);
      console.log("Buckner_Conroom Database created successfully.");
    } catch (err) {
      throw new Error(`BUCKNER DATABASE CREATION ERROR: ${err}`)
    }
}

/**
 * Create Users table in the database.
 */
async function createUsersTable() {
    try {
      // Create a request and execute the SQL command stored in DB_COMMANDS.createUsersTable
      await pool.request().query(DB_COMMANDS.createUsersTable);
      console.log("Users table created successfully.");
    } catch (err) {
      throw new Error(`USERS TABLE CREATION ERROR: ${err}`)
    }
}

/**
 * Create Rooms table in the database.
 */
async function createRoomsTable() {
    try {
        // Create a request and execute the SQL command stored in DB_COMMANDS.createRoomsTable
        await pool.request().query(DB_COMMANDS.createRoomsTable);
        console.log("Rooms table created successfully.");
    } catch (err) {
      throw new Error(`ROOMS TABLE CREATION ERROR: ${err}`)
    }
}

/**
 * Create Reservations table in the database (with the appropriate indexes).
 */
async function createReservationsTable() {
    try {
      // Create a request and execute the SQL command stored in DB_COMMANDS.createReservationsTable
        await pool.request().query(DB_COMMANDS.createReservationsTable);
        await pool.request().query(DB_COMMANDS.createIndexReservationsDate);
        await pool.request().query(DB_COMMANDS.createIndexReservationsRoomTime);
        await pool.request().query(DB_COMMANDS.createIndexReservationsUser);
        await pool.request().query(DB_COMMANDS.createIndexReservationsStatus);
        console.log("Reservations table created successfully.");
    } catch (err) {
      throw new Error(`RESERVATIONS TABLE CREATION ERROR: ${err}`)
    }
}

/**
 * Initialize database and setup all the tables.
 */
export async function databaseSetup(){
    try {
        createBucknerConroomDatabase()
        createUsersTable()
        createRoomsTable()
        createReservationsTable()

        /* Delete Tables (for debugging) */
        // await pool.request().query(DB_COMMANDS.dropReservationsTable);
        // await pool.request().query(DB_COMMANDS.dropUsersTable);
        // await pool.request().query(DB_COMMANDS.dropRoomsTable);
    } catch (err) {
        console.log(err)   
    }
}

export const testRoomsTableDataInsert = async (roomData) => {
  const { room_name, building, room_number, seats, projector, summary, open_hour, close_hour } = roomData;
  console.log("DEBUG: open_hour ->", open_hour);
  console.log("DEBUG: close_hour ->", close_hour);

  try{
    const result = await pool.request()
    .input('room_name', mssql.VarChar(255), room_name)
    .input('building', mssql.VarChar(255), building)
    .input('room_number', mssql.SmallInt, room_number)
    .input('seats', mssql.SmallInt, seats)
    .input('projector', mssql.Bit, projector)
    .input('summary', mssql.VarChar(255), summary)
    .input('open_hour', mssql.VarChar, open_hour)
    .input('close_hour', mssql.VarChar, close_hour)
    .query(`
      IF NOT EXISTS (SELECT 1 FROM rooms WHERE room_name = @room_name OR room_number = @room_number)
      BEGIN
          INSERT INTO rooms (room_name, building, room_number, seats, projector, summary, open_hour, close_hour) 
          VALUES (@room_name, @building, @room_number, @seats, @projector, @summary, @open_hour, @close_hour);
      END;
    `)
    
    const rowsAffected = result.rowsAffected == 0 ? 0 : result.rowsAffected
    console.log("==================================================================")
    console.log(`Room inserted successfully: ${rowsAffected} row(s) added.`);
    console.log("==================================================================")
    return result;
  }catch(err){
    console.log(`ROOM DATA INSERTION ERROR: ${err}`)
  }
}

export const viewRoomsTable = async () => {
  try {
    const result = await pool.request().query(DB_COMMANDS.viewRoomsTable);

    console.log(result.recordset); // Logs the result from the query
    return result.recordset;
  } catch (err) {
    console.log(`ROOMS TABLE VIEW ERROR: ${err}`);
  }
}




// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object