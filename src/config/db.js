import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongo_uri = process.env.MONGO_URI;

async function connectDB(){
    try{
        await mongoose.connect(mongo_uri)
        console.log('MongoDB connected successfully');
    }catch(err){
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
}

export default connectDB;