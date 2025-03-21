import mssql from "mssql"
import { connectToDatabase } from "../config/dbConnection.js"
import { DB_COMMANDS } from "../../constants/dbCommands.js"
import { Room } from "../model/Room.js"

let pool

try{
    pool = await connectToDatabase()
}catch (err) {
    console.log(`Failed to connect to database: ${err}`)
}

/**
 * Fetch all rooms from the database.
 * @returns {Promise<Array<Room>>} an array of all rooms in the database.
 */
export const getAllRooms = async () => { 
    try {
        const result = await pool.request().query(DB_COMMANDS.getAllRooms);
        const allRoomsData = result.recordset;
        const allRooms = []
        allRoomsData.forEach((room) => allRooms.push(Room.toModel(room))) // convert each database record to a Room object
        return allRooms
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to retrieve rooms: ${err.message}`);
          
      }
 };

 
/**
 * Fetch a specific room from the database.
 * @returns {Promise<Room> | undefined} a room in the database.
 */
 export const getRoomById = async (roomId) => { 
    try {
        const result = await pool.request()
        .input('room_id', mssql.Int, roomId)
        .query(DB_COMMANDS.getRoomById);

        const roomData = result.recordset?.[0];

        if(roomData){
            return Room.toModel(roomData) // convert each database record to a Room object
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new Error(`Failed to retrieve room: ${err.message}`);
      }
 };


/**
 * Create a new room in the database.
 * @param {Room} roomData the details of the new room.
 * @returns {Room} the newly created room (converted to a Room object).
 */
export const createRoom = async (roomData) => {
    const roomDetails = roomData.fromModel()
  
    try{
      const result = await pool.request()
      .input('room_name', mssql.VarChar(255), roomDetails.roomName)
      .input('building', mssql.VarChar(255), roomDetails.building)
      .input('room_number', mssql.SmallInt, roomDetails.roomNumber)
      .input('seats', mssql.SmallInt, roomDetails.seats)
      .input('projector', mssql.Bit, roomDetails.projector)
      .input('summary', mssql.VarChar(255), roomDetails.summary)
      .input('open_hour', mssql.VarChar, roomDetails.openHour)
      .input('close_hour', mssql.VarChar, roomDetails.closeHour)
      .query(DB_COMMANDS.createNewRoom)
      
      console.log("==================================================================")
      console.log(`Room created successfully: ${result.rowsAffected} row(s) added.`);
      console.log("==================================================================")

      
      const newRoomData = result.recordset?.[0]
      if(!newRoomData){
        throw new Error("Failed to retrieve new room data")
      }
      const newRoom = Room.toModel(newRoomData)

      return newRoom;
    }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new Error(`Failed to create new room: ${err.message}`);
    }
};

/**
 * 
 * @param {number} roomId id of the room to update.
 * @param {Room} roomData the details of the updated room.
 * @returns {Promise<Room>} the updated room.
 */
export const updateRoom = async (roomId, roomData) => { 
    const roomToUpdate = await getRoomById(roomId)

    if(!roomToUpdate){
        throw new Error(`This room doesn't exist`);
    }

    const roomDetails = roomData.fromModel()
  
    try{
      const result = await pool.request()
      .input('room_id', mssql.Int, roomId)
      .input('room_name', mssql.VarChar(255), roomDetails.roomName)
      .input('building', mssql.VarChar(255), roomDetails.building)
      .input('room_number', mssql.SmallInt, roomDetails.roomNumber)
      .input('seats', mssql.SmallInt, roomDetails.seats)
      .input('projector', mssql.Bit, roomDetails.projector)
      .input('summary', mssql.VarChar(255), roomDetails.summary)
      .input('open_hour', mssql.VarChar, roomDetails.openHour)
      .input('close_hour', mssql.VarChar, roomDetails.closeHour)
      .query(DB_COMMANDS.updateRoom)
      
      console.log("==================================================================")
      console.log(`Room updated successfully: ${result.rowsAffected} row(s) updated.`);
      console.log("==================================================================")

      
      const updatedRoomData = result.recordset?.[0]
      if(!updatedRoomData){
        throw new Error("Failed to retrieve updated room data")
      }
      const updatedRoom = Room.toModel(updatedRoomData)

      return updatedRoom;
    }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new Error(`Failed to update room: ${err.message}`);
    }


 };


/**
 * Delete a room from the database.
 * @param {number} roomId id of the room to delete.
 * @returns {Room} the deleted room.
 */
export const deleteRoom = async (roomId) => { 
try{
    const deletedRoom = await getRoomById(roomId)

    if(!deleteRoom){
        throw new Error(`This room doesn't exist`);
    }
    const result = await pool.request()
    .input('room_id', mssql.Int, roomId)
    .query(DB_COMMANDS.deleteRoom)
    
    console.log("==================================================================")
    console.log(`Room deleted successfully: ${result.rowsAffected} row(s) deleted.`);
    console.log("==================================================================")
    return deletedRoom;
    }catch(err){
    console.error({ message: err.message, stack: err.stack });
    throw new Error(`Failed to delete room: ${err.message}`);
    }
};
