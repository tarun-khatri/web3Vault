const express = require("express")
const router = express.Router()
const {uploadImageController} = require("../controllers/uploadImageController.js")
const {uploadUserImage} = require("../middleware/multer.js")
const {authenticateToken} = require("../middleware/authenticateToken.js")


router.post("/uploadImage",authenticateToken, uploadUserImage, uploadImageController)

module.exports = router