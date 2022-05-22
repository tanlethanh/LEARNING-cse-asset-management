const express = require("express")
const router = express.Router()

// import controller
const {addToBasket, reqToReturn, memberInfor} = require("../controllers/member")

router.get("/member-infor", memberInfor)
router.post("/add-to-basket", addToBasket)
router.post("/request-to-borrow", reqToReturn)
router.post("/request-to-return", reqToReturn)

module.exports = router
