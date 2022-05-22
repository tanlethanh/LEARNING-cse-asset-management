const express = require("express")
const router = express.Router()
const {adminInfor, addItem, removeItem, editItem, acceptMember, removeMember, enableAdmin, acceptOrder, deniedOrder, doneOder} = require('../controllers/admin');

// To get information of admin - render admin page
router.get("/admin-infor", adminInfor)

// manage item
router.post("/add-item", addItem)
router.post("/remove-item", removeItem)
router.post("/edit-item", editItem)

// manage account
router.post("/accept-new-member", acceptMember)
router.post("/remove-member", removeMember)
router.post("/enable-admin", enableAdmin)

// manage order
router.post("/accept-order", acceptOrder)
router.post("/denied-order", deniedOrder)
router.post("/done-order", doneOder)

module.exports = router