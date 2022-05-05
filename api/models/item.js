const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    quantity: {
        type: Number,
        min: 1,
    },
    category: [String],
    image: {
        data: Buffer,
        contentType: String
    },
    desciption: {
        type: String,
        default: "None"
    },
    borrowerList: [
        {
            id: {
                type: mongoose.ObjectID,
                require: true
            },
            quantity: {
                type: Number,
                require: true
            },
            date: {
                type: Date,
                require: true
            }
        }
    ]
})

module.exports = mongoose.model("Item", itemSchema)
