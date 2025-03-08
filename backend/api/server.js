/* Library I */
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import userRouter from "./routes/userRoutes";
import adminRouter from "./routes/adminRoutes";


dotenv.config(); // let's us use the process object to read env variables
const app = express();
app.use(cors())
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);



app.use(express.json())

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({message: "Hello World",
        port: PORT 
    })
})


app.listen(PORT);