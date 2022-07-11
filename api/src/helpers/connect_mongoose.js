const mongoose = require('mongoose');

setupMongoose = () => {
    // mongoose connection and disconnection
    mongoose
        .connect(process.env.DATABASE_URI || "mongodb://localhost:27017/assetDB", { serverSelectionTimeoutMS: 5000 })
        .then(() => {
            console.log('DB connection established')
        })
        .catch(err => {
            console.error('DB connection error: ', err)
        })

    mongoose.connection.on('connection', () => {
        console.log('Mongodb connected successfully')
    })

    mongoose.connection.on('error', () => {
        console.error(error.message)
    })

    mongoose.connection.on('disconnected', () => {
        console.log('Mongodb disconnected')
    })
}

module.exports = setupMongoose