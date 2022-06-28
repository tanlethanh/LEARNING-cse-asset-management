const mongoose = require("mongoose")

// const bcrypt = require('bcrypt')
// const saltRounds = 10

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
        trim: true,
        set: v => {
            if (v === '') {
                return undefined;
            }
            return v;
        }
    },
    studentCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        set: v => {
            if (v === '') {
                return undefined;
            }
            return v;
        }
    },
    phoneNumber: {
        type: String,
        require: true,
        trim: true,
        set: v => {
            if (v === '') {
                return undefined;
            }
            return v;
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        set: v => {
            if (v === '') {
                return undefined;
            }
            return v;
        }
    },
    hash_password: {
        type: String,
        required: true,
        set: v => {
            if (v === '') {
                return undefined;
            }
            return v;
        }
    },
    basket: {
        id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
    },
    orders: [mongoose.Schema.Types.ObjectId]
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)