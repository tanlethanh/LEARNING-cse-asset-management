const express = require('express')
const router = express.Router()
const isAuthenticated = require('../helpers/isAuth')

const {getAllUsers, getUserById, togglePermission, deleteUserById} = require('../controllers/controller.user')

router
    .get('/', isAuthenticated, getAllUsers)
    .get('/:id', isAuthenticated , getUserById)
    .patch('/:id', isAuthenticated, togglePermission)
    .delete('/:id', isAuthenticated, deleteUserById)


module.exports = router