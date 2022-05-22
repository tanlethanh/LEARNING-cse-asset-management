const express = require("express")

const router = express.Router()

const {getAllItem} = require('../controllers/main');

router.get("/all-item", getAllItem)

module.exports = router