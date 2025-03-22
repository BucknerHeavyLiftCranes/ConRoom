import { connectToDatabase } from "../config/dbConnection.js"
import { DB_COMMANDS } from "../../constants/dbCommands.js"


let pool

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
    } catch (err) {
      throw new Error(`BUCKNER DATABASE CREATION ERROR: ${err}`)
    }
}

/**
 * Create Users table in the database.
 */
// async function createUsersTable() {
//     try {
//       // Create a request and execute the SQL command stored in DB_COMMANDS.createUsersTable
//       await pool.request().query(DB_COMMANDS.createUsersTable);
//     } catch (err) {
//       throw new Error(`USERS TABLE CREATION ERROR: ${err}`)
//     }
// }

/**
 * Create Rooms table in the database.
 */
async function createRoomsTable() {
    try {
        // Create a request and execute the SQL command stored in DB_COMMANDS.createRoomsTable
        await pool.request().query(DB_COMMANDS.createRoomsTable);
    } catch (err) {
      throw new Error(`ROOMS TABLE CREATION ERROR: ${err}`)
    }
}

/**
 * Create Reservations table in the database (with the appropriate indexes).
 */
async function createReservationsTable() {
    try {
      /* Create reservations table */
      await pool.request().query(DB_COMMANDS.createReservationsTable);

      /* Create reservations table indexes */
      await pool.request().query(DB_COMMANDS.createIndexReservationsDate);
      await pool.request().query(DB_COMMANDS.createIndexReservationsRoomTime);
      await pool.request().query(DB_COMMANDS.createIndexReservationsUser);
      await pool.request().query(DB_COMMANDS.createIndexReservationsStatus);
    } catch (err) {
      throw new Error(`RESERVATIONS TABLE CREATION ERROR: ${err}`)
    }
}

/**
 * Initialize the database and setup all the tables.
 */
export async function setupDatabase(){
    try {
        await createBucknerConroomDatabase()
        await createRoomsTable()
        await createReservationsTable()
    } catch (err) {
        console.error({ message: err.message, stack: err.stack });   
    }
}

/**
 * Reset the database - drop the tables (for debugging purposes).
 */
export async function clearDatabase(){
  try {
      await pool.request().query(DB_COMMANDS.dropReservationsTable);
      await pool.request().query(DB_COMMANDS.dropRoomsTable);
      console.log("Database cleared!")
  } catch (err) {
      console.error({ message: err.message, stack: err.stack });   
  }
}




// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object