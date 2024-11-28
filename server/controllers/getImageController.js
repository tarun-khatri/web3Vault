const UserModel = require("../models/User.js")
const {decryptData} = require("../utils/decryption.js")
const axios = require("axios")
const PINATA_GATEWAY_URL= "https://gateway.pinata.cloud/ipfs/"

async function returnIpfsResponse(ipfsHash) {
    const res = await axios(`${PINATA_GATEWAY_URL}${ipfsHash}`)
    return res.data
}

async function getImageController(req,res,next) {
try {

    const address = req.user.address.toLowerCase()

    const userAddress = address.toLowerCase()
    const user = await UserModel.findOne({userAddress: userAddress})
        if (!user) {
            throw new Error("User does not exist")
        }

    const {page, limit} = req.query

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 1;

    if (pageNumber<1 || limitNumber<1) {
        throw new Error("Pagination error")
    }
    const startIndex= (pageNumber-1)*limitNumber
    const endIndex = pageNumber*limitNumber

    const ipfsHashArray = req.body.slice(startIndex, Math.min(req.body.length, endIndex))
    const decryptedImageArr = []

    if (ipfsHashArray.length!==0) {
        const encryptedDataarr = await Promise.all(ipfsHashArray.map(async(ipfsHash)=>{
            const res= await returnIpfsResponse(ipfsHash)
            return res
        }))

        for(const img of encryptedDataarr){
            const decryptedImgData = decryptData(img.encryptedData, img.iv, user.encryptionKey)
            decryptedImageArr.push(decryptedImgData.toString("base64"))
        }
    }

    console.log(decryptedImageArr)

    res.status(200).json({message:"Image Sent", decryptedImageArr})

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
   
}

module.exports = {getImageController}