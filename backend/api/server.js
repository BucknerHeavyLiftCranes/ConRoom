/* Library I */
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { connectToDatabase } from "../config/dbConnection.js";
import { router as adminRouter } from "./routes/adminRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

// connectToDatabase()

dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object
const app = express();
app.use(cors())
app.use(errorHandler)
app.use("/api/users", userRouter);
app.use("/api/admins", adminRouter);



app.use(express.json());

const PORT = process.env.PORT || 3000;
console.log(process.env.PORT)

app.get("/", (req, res) => {
    res.json({message: "Hello World",
        port: PORT 
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});