const express = require('express')
const router = express.Router()

const { getAuth, register, login, logout } = require('../controllers/controller.auth')

router.get('/', getAuth)
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)


module.exports = router