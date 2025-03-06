/* IMPORTS */
import dotenv from "dotenv"
import express from "express"


dotenv.config(); // let's us use the process object to read env variables
const app = express();

app.use(express.json())

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({message: "Hello World",
        port: PORT 
    })
})


app.listen(PORT);