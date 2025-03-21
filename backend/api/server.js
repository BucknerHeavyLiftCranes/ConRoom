/* Library Imports */
import cors from "cors"
// import dotenv from "dotenv"
import express from "express"
import { router as adminRouter } from "./routes/adminRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { setupDatabase } from "../database/dbSetup.js";
import { getAllRooms, updateRoom } from "../database/roomsTable.js";
import { Room } from "../model/Room.js";

// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object // container already loads env vars so this is not needed

try {
    await setupDatabase()
} catch (err) {
    console.error({ message: err.message, stack: err.stack });
}

try {
    const roomToUpdate = new Room(
        1,
        'Scrum Room B',
        'Main Building',
        102,
        10,
        0, 
        'A small, quiet conference room made for brief yet important meetings.',
        '10:00:00',
        '15:00:00'
    )
    
    await updateRoom(roomToUpdate.roomId, roomToUpdate)
} catch (err) {
    console.error({ message: err.message, stack: err.stack });
}


try {
    console.log(await getAllRooms())
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