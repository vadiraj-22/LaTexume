import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI.replace(/\/+$/, '');
        await mongoose.connect(`${uri}/${DB_NAME}`);
        console.log(`MongoDB Connected DB HOST: ${mongoose.connection.host}`);

        // Automatically drop legacy username_1 index if present in users collection
        try {
            await mongoose.connection.collection('users').dropIndex('username_1');
            console.log('Legacy index username_1 dropped from users collection');
        } catch (indexError) {
            // Error code 27 (IndexNotFound) means the index was already removed or collection is new
            if (indexError.code !== 27 && indexError.codeName !== 'IndexNotFound') {
                // Ignore if collection doesn't exist yet
            }
        }

        // Automatically delete any legacy accounts containing username or missing fullName
        try {
            await mongoose.connection.collection('users').deleteMany({
                $or: [
                    { username: { $exists: true } },
                    { fullName: { $exists: false } }
                ]
            });
        } catch (cleanupError) {
            // Ignore if collection does not exist yet
        }
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}

export default connectDB;