/* Library Imports */
import cors from "cors"
// import dotenv from "dotenv"
import express from "express"
import { router as adminRouter } from "./routes/adminRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { clearDatabase, dropReservationsTable, setupDatabase } from "../database/dbSetup.js";
import { getAllRooms, createRoom, updateRoom, deleteRoom, getRoomByNameAndEmail, getRoomById } from "../database/roomsTable.js";
import { createReservation, deleteReservation, getAllReservations, getReservationById, toggleReservationCanceledStatus, updateReservation } from "../database/reservationsTable.js";
import  Room  from "../model/Room.js";
import Reservation from "../model/Reservation.js";
import { fakeRooms } from "../../tests/fakeRooms.js";
import { fakeReservations } from "../../tests/fakeReservations.js";
import { log } from "console";

// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object // container already loads env vars so this is not needed

try {
    // await setupDatabase()
    // await clearDatabase()
    // await dropReservationsTable()
    
} catch (err) {
    console.error({ message: err.message, stack: err.stack });
}

/* Testing Rooms Table CRUD Operations */
{
// Create a room
// let fakeRoom
// try {
//     for (fakeRoom of fakeRooms){
//         await createRoom(fakeRoom)
//     }   

//     await logRooms()
// } catch (err) {
//     console.log(`Room '${fakeRoom.roomName}' could NOT be made.`)
//     console.error({ message: err.message, stack: err.stack });
// }


// try {
//     const roomToUpdate = new Room({...fakeRooms[1], roomId: 2, openHour: "00:00:00", closeHour: "23:59:59"})

    
//     await updateRoom(roomToUpdate)
//     await logRooms()
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }



// try {
//     const roomToDelete = new Room({...fakeRooms[3], roomId: 4})
    
//     const deletedRoom = await deleteRoom(roomToDelete.roomId)
//     console.log("DELETED ROOM:", deletedRoom)
//     await logRooms()
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }


// try {
//     const allRooms = await getAllRooms()
//     if (allRooms.length !== 0){
//         console.log(allRooms)
//     }else{
//         console.log("There are no rooms in this database")
//     }
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }
}

/* Testing Reservations Table CRUD Operations */
{
// Create a reservation
// let fakeReservation
// try {
//     // for (fakeReservation of fakeReservations){
//     //     await createReservation(fakeReservation)
//     // }   

    // const newReservation = new Reservation({
    //     title: "Weekly Coach Meting",
    //     roomId: 3,
    //     userEmail: "WWW@abc.com", 
    //     date: "2025-04-01",
    //     startTime: '13:15:00',
    //     endTime: '14:15:00'
    // })
    // await createReservation(newReservation)
    // await logReservations()
// } catch (err) {
//     // console.log(`Reservation '${fakeReservation.title}' could NOT be made.`)
//     console.error({ message: err.message, stack: err.stack });
// }

// Update reservation
// try {
//         const reservationToUpdate = (await getReservationById()).fromModel()
//         const updatedReservation = new Reservation({...reservationToUpdate, date: "2025-03-27", startTime:"07:30:00", endTime: "17:00:00"})
//         // console.log(updatedReservation)

//         await updateReservation(updatedReservation)
//         // await logReservations()
        
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }


// Get the room for a reservation
// try {
//     const reservation = await getReservationById(4)
//     const reservationRoom = await reservation.getRoom()
//     log(reservationRoom)
    
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }

// Delete a reservation
// try {
//     const deletedReservation = await getReservationById(8)

//     await deleteReservation(deletedReservation.reservationId)
//     await logReservations()
    
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }

// Cancel a reservation
// try {
//     const reservationToCancelOrUncancel = await getReservationById(3)

//     await toggleReservationCanceledStatus(reservationToCancelOrUncancel)
//     await logReservations()
    
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }
}



async function logRooms() {
    try {
        const allRooms = await getAllRooms()
        if (allRooms.length !== 0){
            console.log(allRooms)
        }else{
            console.log("There are no rooms in this database")
        }
    } catch (err) {
        console.error({ message: err.message, stack: err.stack });
    }
}

async function logReservations() {
    try {
        const allReservations = await getAllReservations()
        if (allReservations.length !== 0){
            console.log(allReservations)
        }else{
            console.log("There are no reservations in this database")
        }
    } catch (err) {
        console.error({ message: err.message, stack: err.stack });
    }
}

// await logRooms()
// await logReservations()

// const allReservations = await getAllReservations()
const meetingDetails = []
// for (let r of allReservations){
//     meetingDetails.push(await r.toMeetingDetails())
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
    res.json(meetingDetails)
})


app.listen(PORT, () => {
    console.log("==================================")
    console.log(`Server is running on port ${PORT}`);
    console.log("==================================")
});