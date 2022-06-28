const express = require('express')
const isAuthenticated = require('../helpers/isAuth')

const router = express.Router()

const {getAllOrder, getOrderById, createNewOrder, updateStateOrderByID, deleteOrderById} = require('../controllers/controller.order')

router
    .get('/', isAuthenticated, getAllOrder)
    .get('/:id', getOrderById)
    .post('/', isAuthenticated, createNewOrder)
    .patch('/:id', isAuthenticated, updateStateOrderByID)
    .delete('/:id', isAuthenticated, deleteOrderById)

module.exports = router







