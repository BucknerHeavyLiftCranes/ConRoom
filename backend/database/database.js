import { connectToDatabase } from "../config/dbConnection.js"
import { DB_COMMANDS } from "../../constants/constants.js"


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
        // Create a request and execute the SQL command stored in DB_COMMANDS.createUsersTable
        await pool.request().query(DB_COMMANDS.createRoomsTable);
        console.log("Rooms table created successfully.");
    } catch (err) {
      throw new Error(`ROOMS TABLE CREATION ERROR: ${err}`)
    }
}

/**
 * Create Reservations table in the database (with appropriate indexes).
 */
async function createReservationsTable() {
    try {
      // Create a request and execute the SQL command stored in DB_COMMANDS.createUsersTable
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




// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object
