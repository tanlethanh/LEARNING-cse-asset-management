const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(express.json()) // fixbug: get json body from postman

// connect to database
mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log("DB connected")
    })
    .catch(() => {
        console.log("Unable to connect to DB")
    })


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
    console.log("Successfully!")
})


// Import routes
const authenRoutes = require("./routes/authentication")
const adminRoutes = require("./routes/admin")
const memberRoutes = require("./routes/member")
const mainRoutes = require("./routes/main") 

// Using routes
app.use("/api/main", mainRoutes)
app.use("/api/authentication" , authenRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/member", memberRoutes)

// Starting server
const port = process.env.PORT || 3000
app.listen(port, function (err) {
    if (err) {
        console.log(err)
    }
    else {
        console.log(`App is listening on port ${port}`)
    }
})