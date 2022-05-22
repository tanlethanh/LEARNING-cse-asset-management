const express = require("express")

const router = express.Router()

const {addItem, removeItem, editItem} = require('../controllers/admin-controller');

router.post("/add-item", addItem)

router.post("/remove-item", removeItem)

router.post("/edit-item", editItem)

module.exports = router