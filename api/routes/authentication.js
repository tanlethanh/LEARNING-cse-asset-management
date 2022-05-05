const express = require("express")

const router = express.Router()

// import controller
const {signup, signin, signout} = require("../controllers/authentication")


router.post("/signup", signup)

router.post("/signin", signin)

router.post("/signout", signout)



module.exports = router