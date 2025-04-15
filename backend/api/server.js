/* eslint-disable no-unused-vars */
/* Library Imports */
import cors from "cors"
import cookieParser from "cookie-parser";
// import dotenv from "dotenv"
import express from "express"
import { router as authRouter } from "./routes/authRoutes.js";
import { router as adminRouter } from "./routes/adminRoutes.js";
import { router as calendarRouter } from "./routes/calendarRoutes.js";
import { router as roomRouter } from "./routes/roomRoutes.js";
import { router as reservationRouter } from "./routes/reservationRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { clearDatabase, dropAdminsTable, dropReservationsTable, setupDatabase } from "../database/dbSetup.js";
import { getAllRooms, createRoom, updateRoom, deleteRoom, getRoomByNameAndEmail, getRoomById } from "../database/roomsTable.js";
import { createReservation, deleteReservation, getAllReservations, getReservationById, toggleReservationCanceledStatus, updateReservation } from "../database/reservationsTable.js";
import  Room  from "./model/Room.js";
import Reservation from "./model/Reservation.js";
import { fakeRooms } from "../../tests/fakeRooms.js";
import { fakeReservations } from "../../tests/fakeReservations.js";
import { log } from "console";
import Admin from "./model/Admin.js";
import { createAdmin, createOrUpdateAdmin, deleteAdmin, getAdminByEmail, getAdminById, getAdminByRefreshToken, getAllAdmins, updateAdminRefreshToken } from "../database/adminsTable.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5174', // where frontend is hosted
    credentials: true
})); // 🚨 Too open, add limits before putting in production

/** Custom Middleware */
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/rooms", roomRouter);
app.use(errorHandler)

// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object // container already loads env vars so this is not needed

// try {
    // await setupDatabase() // UNCOMMENT THIS LATER 🚨🚨🚨
//     // await clearDatabase()
//     // await dropReservationsTable()
    // await dropAdminsTable()
    
// } catch (err) {
//     console.error({ message: err.message, stack: err.stack });
// }

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
}

/* Testing Reservations Table CRUD Operations */
{
// Create a reservation
// let fakeReservation
// try {
//     for (fakeReservation of fakeReservations){
//         await createReservation(fakeReservation)
//     }   

//     // const newReservation = new Reservation({
//     //     title: "Monthly Inspection",
//     //     roomId: 3,
//     //     userEmail: "G@abc.com", 
//     //     date: "2025-12-10",
//     //     start: '08:00',
//     //     end: '15:00'
//     // })
//     // await createReservation(newReservation)
// } catch (err) {
//     // console.log(`Reservation '${fakeReservation.title}' could NOT be made.`)
//     console.error({ message: err.message, stack: err.stack });
// }

// Update reservation
// try {
//         const reservationToUpdate = (await getReservationById()).fromModel()
//         const updatedReservation = new Reservation({...reservationToUpdate, date: "2025-03-27", start:"07:30:00", end: "17:00:00"})
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

/* Testing Admins Table CRUD Operations */
{

async function createNewAdmin () {
    try {
        const adminDetails = {
            id: "abc123",
            name: "Thomas Jeffrey",
            email: "Tjeff@abc.com",
            refreshToken: "12345abcde"
        }

        const adminToAdd = Admin.fromObject(adminDetails)

        const newAdmin = await createAdmin(adminToAdd)
        console.log(newAdmin)

    } catch (err) {
        console.log({message: err.message, stack: err.stack})
    }
}

// await createNewAdmin()

// await logAdmins()
async function logAdmins() {
    try {
        const allAdmins = await getAllAdmins()
        console.log(allAdmins)
    } catch (err) {
        console.log({message: err.message, stack: err.stack})
    }
}

// logAdmins()

async function logAdminByEachColumn() {
    try {

        const adminDetails = {
            id: "abc123",
            name: "Thomas Jeffrey",
            email: "Tjeff@abc.com",
            refreshToken: "12345abcde"
        }
    
        const admin = Admin.fromObject(adminDetails)

        const adminById = await getAdminById(admin.id)
        const adminByEmail = await getAdminByEmail(admin.email)
        const adminByRefreshToken = await getAdminByRefreshToken(admin.refreshToken)
        console.log(adminById)
        console.log(adminByEmail)
        console.log(adminByRefreshToken)
    } catch (err) {
        console.log({message: err.message, stack: err.stack})
    }
}

// await logAdminByEachColumn()

async function updateCurrentAdminRefreshToken () {
    try {
        const adminDetails = {
            id: "abc123",
            name: "Thomas Jeffrey",
            email: "Tjeff@abc.com",
            refreshToken: "23456bcdef"
        }

        const admin = Admin.fromObject(adminDetails)

        const updatedAdmin = await updateAdminRefreshToken(admin.id, admin.refreshToken)
        console.log(updatedAdmin)

    } catch (err) {
        console.log({message: err.message, stack: err.stack})
    }
}

// await updateCurrentAdminRefreshToken()

async function createOrUpdateCurrentAdminRefreshToken () {
    try {
        const adminDetails = {
            id: "def456",
            name: "Lydia Hoffsky",
            email: "Lhoff@abc.com",
            refreshToken: "SUPER_SECRET_TOKEN"
        }

        const admin = Admin.fromObject(adminDetails)

        const updatedAdmin = await createOrUpdateAdmin(admin)
        console.log(updatedAdmin)

    } catch (err) {
        console.log({message: err.message, stack: err.stack})
    }
}

// await createOrUpdateCurrentAdminRefreshToken()

async function deleteAdminById () {
    try {
        const adminDetails = {
            id: "def456",
            name: "Lydia Hoffsky",
            email: "Lhoff@abc.com",
            refreshToken: "SUPER_SECRET_TOKEN"
        }

        const admin = Admin.fromObject(adminDetails)

        const deletedAdmin = await deleteAdmin(admin.id)
        console.log(deletedAdmin)

    } catch (err) {
        console.log({message: err.message, stack: err.stack})
    }
}

// await deleteAdminById()


}

// app.get("/", (req, res) => {
//     res.status(200).json({
//         message: "Welcome to the official Buckner Conference Room Scheduler API",
//         routes: {
//             rooms: "/api/rooms", // takes you to the getAllRooms page
//             reservations: "/api/reservations" // takes you to the getAllReservations page
//         }
//     })
// })

// console.log("TEST_VAR:", process.env.TEST_VAR);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log("==================================")
    console.log(`Server is running on port ${PORT}`);
    console.log("==================================")
});