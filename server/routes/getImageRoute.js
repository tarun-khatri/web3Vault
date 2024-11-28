const express = require("express")
const router = express.Router()
const {getImageController} = require("../controllers/getImageController.js")
const {authenticateToken} = require("../middleware/authenticateToken.js")


router.post("/getImage",authenticateToken, getImageController)

module.exports = router