import { connectToDatabase } from "../config/dbConnection.js"
import { DB_COMMANDS } from "../../constants/constants.js"


let pool

try{
    pool = await connectToDatabase()
}catch (err) {
    console.log(`DATABASE ERROR: ${err}`)
}

async function createBucknerConroomDatabase() {
    try {
      // Create a request and execute the SQL command stored in DB_COMMANDS.createUsersTable
      await pool.request().query(DB_COMMANDS.createBucknerConroomDatabase);
      console.log("Buckner_Conroom Database created successfully.");
    } catch (err) {
      throw new Error(`BUCKNER DATABASE CREATION ERROR: ${err}`)
    }
}



async function createUsersTable() {
    try {
      // Create a request and execute the SQL command stored in DB_COMMANDS.createUsersTable
      await pool.request().query(DB_COMMANDS.createUsersTable);
      console.log("User table created successfully.");
    } catch (err) {
      throw new Error(`USER TABLE CREATION ERROR: ${err}`)
    }
}

export async function databaseSetup(){
    try {
        createBucknerConroomDatabase()
        createUsersTable()
    } catch (err) {
        console.log(err)   
    }
}




// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object
