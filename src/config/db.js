const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL);

        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit();
    };
}

module.exports = connectDB;