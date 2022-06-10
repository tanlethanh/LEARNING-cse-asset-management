const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    nameItem: {
        type: String,
        require: true
    },
    nameUser: {
        type: String,
        require: true
    },
    categoryItem: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    idItem: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    status: {
        type: String,
        default: "pending",
        require: true
    },
    returnDate: {
        type: Date,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Order", orderSchema)