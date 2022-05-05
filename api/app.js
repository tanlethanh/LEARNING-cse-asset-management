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

// Using routes
app.use("/authentication" , authenRoutes)




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