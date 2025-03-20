/* Library Imports */
import cors from "cors"
// import dotenv from "dotenv"
import express from "express"
import { router as adminRouter } from "./routes/adminRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { databaseSetup, testRoomsTableDataInsert, viewRoomsTable } from "../database/database.js";

// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object // container already loads env vars so this is not needed

try {
    await databaseSetup()
} catch (err) {
    console.log(err)
}


// try{
//     const newRoom = {
//         room_name: 'Conference Room B',
//         building: 'Main Building',
//         room_number: 102,
//         seats: 10,
//         projector: 0, // true (Bit)
//         summary: 'A small, quiet conference room made for brief yet important meetings.',
//         open_hour: "08:00:00",
//         close_hour: "17:00:00"
//       };
//     await testRoomsTableDataInsert(newRoom)

// }catch (err) {
//     console.log(err)
// }

// try {
//     await viewRoomsTable()
// } catch (err) {
//     console.log(err)
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