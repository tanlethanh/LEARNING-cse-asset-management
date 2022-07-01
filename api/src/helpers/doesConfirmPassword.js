const bcrypt = require('bcrypt')

async function doesConfirmPassword(password, hash_password) {
    const matchPassword =  await bcrypt.compare(password, hash_password)
    return matchPassword
}

module.exports = doesConfirmPassword