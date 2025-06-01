import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    console.log('function invoked');
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`Connection successfull to database : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('Error while connection to database :: ', error);
        process.exit(1)
    }
}

export default connectDB