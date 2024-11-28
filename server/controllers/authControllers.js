const ethers = require("ethers");
const UserModel = require("../models/User.js");
const jwt = require("jsonwebtoken")
const {JWT_SECRETKEY} = require("../config/serverConfig.js")

async function authController(req, res) {
    try {
        const { signature, address } = req.body;

        if (!signature || !address) {
            console.error("Missing signature or address");
            return res.status(400).json({ message: "Signature and Address are required" });
        }

        const recoveredAddress = ethers.utils.verifyMessage("Welcome to Crypto Vault Website", signature);
        console.log("Recovered Address:", recoveredAddress);

        if (address.toLowerCase() !== recoveredAddress.toLowerCase()) {
            console.error("Address mismatch");
            return res.status(400).json({ message: "Authentication Failed: Address mismatch" });
        }

        const normalizedAddress = recoveredAddress.toLowerCase();

        let user = await UserModel.findOne({ userAddress: normalizedAddress });
        if (!user) {

            user = await UserModel.create({ userAddress: normalizedAddress });
            console.log("New user created:", user);
        }

        const token = jwt.sign({
           address: normalizedAddress
        }, JWT_SECRETKEY)

        return res.status(200).json({ message: "Authentication Successful", user, token });

    } catch (error) {
        console.error("Error in authController:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { authController };
