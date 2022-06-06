const User = require('../models/model.user.js')

isAdmin = async (userid) => {
    try {
        const user = await User.findById(userid)
        if (!user) return false
        return user.isAdmin
    } catch (error) {
        return false
    }

}

module.exports = isAdmin