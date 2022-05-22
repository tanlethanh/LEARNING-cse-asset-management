const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    enable: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean
    },
    fullName: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    studentCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hash_password: {
        type: String,
        required: true
    },
    basket: {
        id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
    },
    waitingList: [
        {
            id: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            date: Date
        }
    ],
    borrowingList: [
        {
            id_item: mongoose.Schema.Types.ObjectId,
            id_admin: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            wantReturn: {
                type: Boolean,
                default: false
            },
            date: Date
        }
    ],
    returnedList: [
        {
            id_item: mongoose.Schema.Types.ObjectId,
            id_admin: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            date: Date
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)