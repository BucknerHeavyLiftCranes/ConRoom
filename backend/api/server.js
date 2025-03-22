/* Library Imports */
import cors from "cors"
// import dotenv from "dotenv"
import express from "express"
import { router as adminRouter } from "./routes/adminRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { clearDatabase, setupDatabase } from "../database/dbSetup.js";
import { getAllRooms, createRoom, updateRoom, deleteRoom, getRoomByNameAndEmail } from "../database/roomsTable.js";
import { getAllReservations } from "../database/reservationsTable.js";
import  Room  from "../model/Room.js";
import Reservation from "../model/Reservation.js";

// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object // container already loads env vars so this is not needed

try {
    // await setupDatabase()
    // await clearDatabase()
} catch (err) {
    console.error({ message: err.message, stack: err.stack });
}

/* Testing Rooms Table CRUD Operations */
{
// try {
//     const roomToCheck = new Room(
//         undefined,
//         'Linhawks',
//         'LinhawksRoom@bucknerheavylift.com',
//         500,
//         1, 
//         'Large hall for conferences, equipped with projectors, full speaker system, and dual monitor podium setup',
//         '08:00:00',
//         '20:00:00'
//     )
    
//     const room = await getRoomByNameAndEmail(roomToCheck.roomName, roomToCheck.roomEmail)
//     if(!room){
//         console.log("There is no room in the database with this name and email.")
//     }else{
//         console.log(room)
//     }
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }


// try {
//     const newRoom = new Room({
//         roomName: 'Mindscape',
//         roomEmail: 'MindscapeRoom@bucknerheavylift.com',
//         seats: 500,
//         projector: 1, 
//         summary: 'Large lecture hall designed for symposiums and presentaions',
//         openHour: '08:00:00',
//         closeHour: '16:00:00'
//     })
    
//     await createRoom(newRoom)
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }


// try {
//     const roomToUpdate = new Room({
//         roomId: 1,
//         roomName: 'Twinnings',
//         roomEmail: 'TwinningsRoom@bucknerheavylift.com',
//         roomStatus: 1,
//         seats: 2,
//         projector: 0, 
//         summary: 'Small room designed for pair scrum meetings (includes dual monitors)',
//         openHour: '10:00:00',
//         closeHour: '17:00:00'
//     })

//     console.log("roomStatus: ", roomToUpdate.roomStatus)
    
//     await updateRoom(roomToUpdate.roomId, roomToUpdate)
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }


// try {
//     const roomToDelete = new Room(
//         2,
//         'Linhawks',
//         'LinhawksRoom@bucknerheavylift.com',
//         1000,
//         1, 
//         'Large hall for conferences, equipped with projectors, full speaker system, and dual monitor podium setup',
//         '09:00:00',
//         '22:00:00'
//     )
    
//     await deleteRoom(roomToDelete.roomId)
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }


// try {
//     const allRooms = await getAllRooms()
//     if(allRooms.length !== 0){
//         console.log(allRooms)
//     }else{
//         console.log("There are no rooms in this database")
//     }
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }
}

/* Testing Reservations Table CRUD Operations */
// try {
//     const allReservations = await getAllReservations()
//     if(allReservations.length !== 0){
//         console.log(allReservations)
//     }else{
//         console.log("There are no reservations in this database")
//     }
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }



const app = express();
app.use(cors())
app.use(errorHandler)
app.use("/api/users", userRouter);
app.use("/api/admins", adminRouter);
app.use(express.json());

// console.log("TEST_VAR:", process.env.TEST_VAR);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({status: `User logged in`,
        port: PORT 
    })
})


app.listen(PORT, () => {
    console.log("==================================")
    console.log(`Server is running on port ${PORT}`);
    console.log("==================================")
});