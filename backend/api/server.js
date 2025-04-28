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

// console.log("TEST_VAR:", process.env.TEST_VAR);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log("==================================")
    console.log(`Server is running on port ${PORT}`);
    console.log("==================================")
});