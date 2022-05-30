const mongoose = require('mongoose')
const User = require('../models/model.user')
const bcrypt = require("bcrypt")

createAdmin = async () => {

    const hash_password = await bcrypt.hash("admin123", 10)

    const admin = new User({
        "enable": true,
        "isAdmin": true,
        "hash_password": hash_password,
        "fullName": "admin",
        "studentCode": "000",
        "phoneNumber":"000",
        "email": "admin@gmail.com"
    })

    await admin.save((err, user) => {
        if (err) {
            console.error(err)
            return null
        }
        return {email: user.email, password: user.password}
    })

}

module.exports = createAdmin