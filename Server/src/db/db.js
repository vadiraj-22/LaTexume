import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try {
        const uri = process.env.MONGODB_URI.replace(/\/+$/, '');
        await mongoose.connect(`${uri}/${DB_NAME}`)
        console.log(`MongoDB Connected DB HOST: ${mongoose.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1)

    }
}

export default connectDB;