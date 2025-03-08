/* Library I */
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { router as adminRouter } from "./routes/adminRoutes";
import { router as userRouter } from "./routes/userRoutes";

dotenv.config(); // loads in env variables - to be used via the process object
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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});