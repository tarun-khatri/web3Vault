const ethers = require("ethers")
require("dotenv").config()
const UserModel = require("../models/User.js")
const {PINATA_APIKEY, PINATA_SECRETKEY} = require("../config/serverConfig.js")
const {generateEncryptionKey} = require("../utils/generateKey.js")
const {encryptFile} = require("../utils/encryption.js")

async function uploadImageController(req,res,next) {
try {
    if (!req.user || !req.user.address) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const address = req.user.address.toLowerCase()

    const userAddress = address.toLowerCase()
    const user = await UserModel.findOne({userAddress: userAddress})
        if (!user) {
            throw new Error("User does not exist")
        }

        if(user.encryptionKey === null){
            const encryptionKey = generateEncryptionKey(32)
            user.encryptionKey= encryptionKey
            await user.save()
        }

        const {encryptedData, iv} = encryptFile(req.file.buffer, user.encryptionKey);
        console.log(encryptedData)

        const pinataSDK = require('@pinata/sdk');
        const pinata = new pinataSDK({ pinataApiKey: PINATA_APIKEY, pinataSecretApiKey: PINATA_SECRETKEY });
        const resPinata = await pinata.pinJSONToIPFS({encryptedData, iv})
        
        console.log(resPinata)
        res.status(200).json({ipfsHash:resPinata.IpfsHash, message:"Image Uplaoded"})
        

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
   
}

module.exports = {uploadImageController}