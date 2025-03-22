import mssql from "mssql"
import { connectToDatabase } from "../config/dbConnection.js"
import { DB_COMMANDS } from "../../constants/dbCommands.js"
import { Reservation } from "../model/Reservation";

let pool

try{
    if(!pool){
        pool = await connectToDatabase()
    }
}catch (err) {
    console.log(`Failed to connect to database: ${err}`)
}