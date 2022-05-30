const express = require('express');
const router = express.Router()
const isAuthenticated = require('../helpers/isAuth.js')

const {getAllItems, getItemById, addNewItem, updateItemById, deleteItemById} = require('../controllers/controller.item')

router
    .get('/', getAllItems)
    .get('/:id', getItemById)
    .post('/', isAuthenticated, addNewItem)
    .patch('/:id', isAuthenticated, updateItemById)
    .delete('/:id', isAuthenticated, deleteItemById)

module.exports = router