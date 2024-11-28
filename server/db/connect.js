const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URL;
    if (!uri) {
        throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
};

module.exports = connectDB;
