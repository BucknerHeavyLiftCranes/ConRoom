/* Library Imports */
import cors from "cors"
// import dotenv from "dotenv"
import express from "express"
import { router as adminRouter } from "./routes/adminRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { /*clearDatabase,*/ setupDatabase } from "../database/dbSetup.js";
import { getAllRooms, /*createRoom, updateRoom, deleteRoom, getRoomByNameAndEmail*/ } from "../database/roomsTable.js";
// import { Room } from "../model/Room.js";

// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object // container already loads env vars so this is not needed

try {
    await setupDatabase()
    // await clearDatabase()
} catch (err) {
    console.error({ message: err.message, stack: err.stack });
}


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
//     const newRoom = new Room(
//         undefined,
//         'Twinnings',
//         'TwinningsRoom@bucknerheavylift.com',
//         2,
//         0, 
//         'Small room designed for pair scrum meetings (includes dual monitors)',
//         '10:00:00',
//         '15:00:00'
//     )
    
//     await createRoom(newRoom)
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }


// try {
//     const roomToUpdate = new Room(
//         3,
//         'Mindscape',
//         'MindscapeRoom@bucknerheavylift.com',
//         1000,
//         1, 
//         'Large hall for conferences, equipped with projectors, full speaker system, and dual monitor podium setup',
//         '08:00:00',
//         '20:00:00'
//     )
    
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


try {
    const allRooms = await getAllRooms()
    if(allRooms.length !== 0){
        console.log(allRooms)
    }else{
        console.log("There are no rooms in this database")
    }
} catch (err) {
    console.error({ message: err.message, stack: err.stack });
}

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