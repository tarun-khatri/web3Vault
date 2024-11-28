const express = require("express")
const router = express.Router()
const {authController} = require("../controllers/authControllers.js")

router.post("/authentication", authController)

module.exports = router