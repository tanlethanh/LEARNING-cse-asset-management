const express = require('express')
const router = express.Router()
const isAuthenticated = require('../helpers/isAuth.js')

const { getAuth, register, login, logout, changePassword } = require('../controllers/controller.auth')

router.get('/', getAuth)
router.post('/register', register)
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)
router.post('/password', isAuthenticated, changePassword)


module.exports = router