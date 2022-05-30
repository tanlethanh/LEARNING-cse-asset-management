const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    enable: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
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
    orders: [mongoose.Schema.Types.ObjectId]
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)