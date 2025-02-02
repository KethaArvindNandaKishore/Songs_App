const mongoose = require('mongoose');

const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI||'mongodb://localhost:27017/musicApp')
        console.log('Successfully connected to MongoDb');
        
    } catch (error) {
        console.log('MongoDb connection failed');
        console.log(error);
        
    }
}

module.exports = connectDb;