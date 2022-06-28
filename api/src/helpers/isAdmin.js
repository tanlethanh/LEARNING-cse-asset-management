const User = require('../models/model.user.js')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.isAdmin = async (userid) => {
    // this function used to check user who is admin
    try {
        const user = await User.findById(userid)
        if (!user) return false
        return user.isAdmin
    } catch (error) {
        return false
    }

}

exports.isAdminWithPassword = async (userid, adminPassword) => {
    // this function used to check user who is admin, and confirm password of this admin
    try {
        const user = await User.findById(userid)

        if (user.isAdmin) {
            // compare password using bcrypt.compare, dont create new hash password to compare
            const matchPassword = await bcrypt.compare(adminPassword, user.hash_password)
            return matchPassword
        }

        return false
    } catch (error) {
        return false
    }

}
