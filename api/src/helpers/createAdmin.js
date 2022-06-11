const mongoose = require('mongoose')
const User = require('../models/model.user')
const bcrypt = require("bcrypt")

createAdmin = async () => {

    try {
        const users = await User.find()

        if (users.length === 0) {
            const hash_password = await bcrypt.hash("123456", 10)

            const admin = new User({
                "enable": true,
                "isAdmin": true,
                "hash_password": hash_password,
                "fullName": "admin",
                "studentCode": "000",
                "phoneNumber": "000",
                "email": "admin@hcmut.edu.vn"
            })

            await admin.save((err, user) => {
                if (err) {
                    console.error(err)
                    return null
                }
                return { email: user.email, password: user.password }
            })

        }
    } catch (error) {
        console.log(error)
    }

}

module.exports = createAdmin