/* Library I */
import cors from "cors"
// import dotenv from "dotenv"
import express from "express"
import { connectToDatabase } from "../config/dbConnection.js";
import { router as adminRouter } from "./routes/adminRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

// dotenv.config({ path: './backend/.env' }); // loads in env variables - to be used via the process object // container already loads env vars so this is not needed
// dotenv.config();
let pool = await connectToDatabase()
try { 
    // await pool.request().query('CREATE DATABASE [Buckner_Conroom]');
    // console.log(pool);
    const result = await pool.request().query("SELECT name FROM sys.databases WHERE name = 'Buckner_Conroom'");
    console.log(result.recordset);
    
} catch (err) {
    console.log(`DATABASE ERROR: ${err}`);
}

const app = express();
app.use(cors())
app.use(errorHandler)
app.use("/api/users", userRouter);
app.use("/api/admins", adminRouter);
app.use(express.json());


console.log("TEST_VAR:", process.env.TEST_VAR);


const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.json({Database: `${pool.config.database}`,
        port: PORT 
    })
    // res.json({message: `Hello World`,
    //     port: PORT 
    // })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});