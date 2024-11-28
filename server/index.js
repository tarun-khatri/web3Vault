const express = require('express')
const app= express()
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./db/connect.js")
const {MONGO_URL, PORT} = require("./config/serverConfig.js")
const authenticationRoute = require("./routes/authenticationRoute.js")
const uploadImageRoute = require("./routes/uploadImageRoute.js")
const getImageRoute = require("./routes/getImageRoute.js")

app.use(cors())
app.use(express.json())

app.use("/api", authenticationRoute)
app.use("/api", uploadImageRoute)
app.use("/api", getImageRoute)


async function serverStart() {
    
    await connectDB(MONGO_URL)

    app.listen(PORT, ()=>{
        console.log("Server is running")
    })
}

serverStart()


