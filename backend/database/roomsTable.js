import mssql from "mssql"
import { connectToDatabase } from "../config/dbConnection.js"
import DB_COMMANDS  from "../../constants/dbCommands.js"
import  Room  from "../api/model/Room.js"
import { InvalidTimeError } from "../../errors/InvalidTimeError.js"
import { 
        GetRoomError, 
        CreateRoomError, 
        DuplicateRoomError, 
        UpdateRoomError, 
        DeleteRoomError, 
        RoomValidationError
    } from "../../errors/RoomError.js"
import { DatabaseConnectionError } from "../../errors/ConnectionError.js"

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
 * Fetch all rooms from the database.
 * @returns {Promise<Room[]>} an array of all rooms in the database.
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
          throw new GetRoomError(`Failed to retrieve rooms: ${err.message}`);
      }
 };

 
/**
 * Fetch a specific room from the database by its unique id.
 * @param {number} roomId unique id of the room.
 * @returns {Promise<Room | undefined>} a room in the database.
 */
 export const getRoomById = async (roomId) => { 
    try {
        const result = await pool.request()
        .input('room_id', mssql.Int, roomId)
        .query(DB_COMMANDS.getRoomById);

        const roomData = result.recordset?.[0];

        if (roomData){
            return Room.toModel(roomData) // convert each database record to a Room object
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetRoomError(`Failed to retrieve room: ${err.message}`);
      }
 };


/**
 * Fetch a specific room from the database by its room name.
 * @param {string} roomName name of the room.
 * @returns {Promise<Room | undefined>} a room in the database.
 */
export const getRoomByName = async (roomName) => { 
    try {
        const result = await pool.request()
        .input('room_name', mssql.VarChar(255), roomName)
        .query(DB_COMMANDS.getRoomByName);

        const roomData = result.recordset?.[0];

        if (roomData){
            return Room.toModel(roomData) // convert each database record to a Room object
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetRoomError(`Failed to retrieve room: ${err.message}`);
      }
 };


 /**
 * Fetch a specific room from the database by its room email.
 * @param {string} roomEmail unique email of the room.
 * @returns {Promise<Room | undefined>} a room in the database.
 */
export const getRoomByEmail = async (roomEmail) => { 
    try {
        const result = await pool.request()
        .input('room_email', mssql.VarChar(255), roomEmail)
        .query(DB_COMMANDS.getRoomByEmail);

        const roomData = result.recordset?.[0];

        if (roomData){
            return Room.toModel(roomData) // convert each database record to a Room object
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetRoomError(`Failed to retrieve room: ${err.message}`);
      }
 };


/**
 * Fetch a specific room from the database by its name and email.
 * @param {string} roomName unique name of the room.
 * @param {string} roomEmail unique email of the room.
 * @returns {Promise<Room | undefined>} a room in the database.
 */
 export const getRoomByNameAndEmail = async (roomName, roomEmail) => { 
    try {
        const result = await pool.request()
        .input('room_name', mssql.VarChar(255), roomName)
        .input('room_email', mssql.VarChar(255), roomEmail)
        .query(DB_COMMANDS.getRoomByNameAndEmail);

        const roomData = result.recordset?.[0];

        if (roomData){
            return Room.toModel(roomData) // convert a database record to a Room instance
        }else{
            return undefined
        }
      } catch (err) {
          console.error({ message: err.message, stack: err.stack });
          throw new GetRoomError(`Failed to retrieve room: ${err.message}`);
      }
 };


/**
 * Create a new room in the database.
 * @param {Room} roomData the details of the new room.
 * @returns {promise<Room>} the newly created room (converted to a Room object).
 */
export const createRoom = async (roomData) => {
    await validateRoom(roomData)

    const roomDetails = roomData.fromModel()
  
    try{
        const result = await pool.request()
        .input('room_name', mssql.VarChar(255), roomDetails.roomName)
        .input('room_email', mssql.VarChar(255), roomDetails.roomEmail)
        .input('room_status', mssql.Bit, roomDetails.roomStatus)
        .input('seats', mssql.SmallInt, roomDetails.seats)
        .input('projector', mssql.Bit, roomDetails.projector)
        .input('summary', mssql.VarChar(255), roomDetails.summary)
        .input('open_hour', mssql.VarChar(10), roomDetails.openHour)
        .input('close_hour', mssql.VarChar(10), roomDetails.closeHour)
        .query(DB_COMMANDS.createNewRoom)
        
        const newRoomData = result.recordset?.[0]
        if (!newRoomData){
            throw new GetRoomError("Failed to retrieve new room data")
        }

        console.log("==================================================================")
        console.log(`Room created successfully: ${result.rowsAffected} row(s) added.`);
        console.log("==================================================================")


        const newRoom = Room.toModel(newRoomData)

        return newRoom;
    }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new CreateRoomError(`Failed to create new room: ${err.message}`);
    }
};

/**
 * 
 * @param {number} roomId id of the room to update.
 * @param {Room} roomData the details of the updated room.
 * @returns {Promise<Room>} the updated room.
 */
export const updateRoom = async (roomData) => { 
    try{
        const roomExists = await getRoomById(roomData.roomId)

        if(roomExists){
            await validateRoom(roomData)
        }

        const roomDetails = roomData.fromModel()

        const result = await pool.request()
        .input('room_id', mssql.Int, roomDetails.roomId)
        .input('room_name', mssql.VarChar(255), roomDetails.roomName)
        .input('room_email', mssql.VarChar(255), roomDetails.roomEmail)
        .input('room_status', mssql.Bit, roomDetails.roomStatus)
        .input('seats', mssql.SmallInt, roomDetails.seats)
        .input('projector', mssql.Bit, roomDetails.projector)
        .input('summary', mssql.VarChar(500), roomDetails.summary)
        .input('open_hour', mssql.VarChar(10), roomDetails.openHour)
        .input('close_hour', mssql.VarChar(10), roomDetails.closeHour)
        .query(DB_COMMANDS.updateRoom)


        const updatedRoomData = result.recordset?.[0]
        if (!updatedRoomData){
            throw new GetRoomError("Failed to retrieve updated room data")
        }

        console.log("==================================================================")
        console.log(`Room updated successfully: ${result.rowsAffected} row(s) updated.`);
        console.log("==================================================================")

        const updatedRoom = Room.toModel(updatedRoomData)

        return updatedRoom;
    }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new UpdateRoomError(`Failed to update room: ${err.message}`);
    }


 };


/**
 * Delete a room from the database.
 * @param {number} roomId id of the room to delete.
 * @returns {Promise<Room>} the deleted room.
 */
export const deleteRoom = async (roomId) => { 
try{
    const deletedRoom = await getRoomById(roomId)

    if (!deletedRoom){
        throw new GetRoomError(`This room doesn't exist`);
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
    throw new DeleteRoomError(`Failed to delete room: ${err.message}`);
    }
};


/**
 * Validate a room before creating it in the database.
 * @param {Room} room room to be validated.
 * @throws {InvalidTimeError} if the room doesn not have valid open hours.
 * @throws {DuplicateRoomError} if the room already exists.
 * @throws {Error} if an unexpected validation error occurs.
 */
const validateRoom = async (room) => {
    try{
        if (!room.hasValidHours()){
            throw new InvalidTimeError("This room's opening and closing hours are invalid")
        }

        const duplicateRoomName = await getRoomByName(room.roomName)
        const duplicateRoomEmail = await getRoomByEmail(room.roomEmail)

        if (duplicateRoomName && duplicateRoomName.roomId != room.roomId){ 
            if(duplicateRoomName.roomName.toLowerCase() === room.roomName.toLowerCase()){
                throw new DuplicateRoomError("A room with this name already exists")
            }
        }

        if (duplicateRoomEmail && duplicateRoomEmail.roomId != room.roomId){ 
            if(duplicateRoomEmail.roomEmail.toLowerCase() === room.roomEmail.toLowerCase()){
                throw new DuplicateRoomError("A room with this email already exists")
            }
        }
    }catch(err){
        console.error({ message: err.message, stack: err.stack });
        throw new RoomValidationError(`Failed to validate room: ${err.message}`);
    }
}