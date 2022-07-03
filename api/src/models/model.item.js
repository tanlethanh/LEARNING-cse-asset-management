const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    available: {
        type: Number,
        require: true,
        min: 1,
    },
    quantity: {
        type: Number,
        require: true,
        min: 1,
    },
    category: String,
    image: {
        type: String
    },
    description: {
        type: String,
        default: "None"
    },
    borrowerList: [
        {
            idUser: {
                type: mongoose.Schema.Types.ObjectId,
                require: true
            },
            idOrder: {
                type: mongoose.Schema.Types.ObjectId,
                require: true
            },
            quantity: {
                type: Number,
                require: true
            },
            date: {
                type: Date,
                require: true
            },
            status: {
                type: String,
                default: "pending",
                enum: ["pending", "done"],
                require: true
            }
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model("Item", itemSchema)
