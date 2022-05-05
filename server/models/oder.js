const mongoose = require("mongoose")

const oderSchema = new mongoose.Schema({
    index: {
        type: Number
    },
    idItem: {
        type: mongoose.Schema.Types.ObjectId 
    },
    quantity: {
        type: Number,
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        default: "pending"
    }
    
})

module.exports = mongoose.model("Oder", oderSchema)