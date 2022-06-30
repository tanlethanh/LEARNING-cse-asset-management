const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const createError = require('http-errors')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid')
const setupMongoose = require('./helpers/connect_mongoose.js')
const createAdmin = require('./helpers/createAdmin')
const isAuthenticated = require('./helpers/isAuth')
require('dotenv').config()


// use middleware
const app = express()
app.use(cors(
    { credentials: true, origin: 'http://localhost:3000' }
))
app.use(morgan())
app.use(helmet())
// app.use(express.json())
app.use(express.json({ limit: "30mb", extended: true }));


// set up session
const sess = {
    genid: function (req) {
        console.log('Generated!')
        return uuidv4() // use UUIDs for session IDs
    },
    secret: 'asset manager secret',
    cookie: {
        maxAge: 60000 * 60
    },
    saveUninitialized: true,
    resave: false,
    rolling: true, // maxAge depends on last response
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

// set up mongoose and create admin
setupMongoose()
createAdmin()

// set up route
const authRoute = require('./routers/router.auth')
const itemsRoute = require('./routers/router.item')
const usersRoute = require('./routers/router.user')
const ordersRoute = require('./routers/router.order')

app.get('/api/', isAuthenticated, async (req, res, next) => {
    console.log(req.session.userId)
    res.json(req.session.userId)
})
app.use('/api/auth', authRoute)
app.use('/api/item', itemsRoute)
app.use('/api/user', usersRoute)
app.use('/api/order', ordersRoute)


// error handling
app.use((req, res, next) => {
    console.log("error handling main")
    next(createError(404, 'Not Found'))
})

app.use((err, req, res, next) => {
    res
        .status(err.status || 500)
        .json({
            status: err.status,
            message: err.message
        })
})

// exit program - close connection database
process.on('SIGINT', () => async () => {
    await mongoose.connection.close()
    process.exit(0)
})

// Starting server
const port = process.env.PORT || 8266
app.listen(port, function (err) {
    if (err) {
        console.log(err)
    }
    else {
        console.log(`App is listening on port ${port}`)
    }
})