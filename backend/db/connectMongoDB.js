import mongoose from "mongoose";

const connectMongoDB = async () => {
    try{
        const MONGODB_URI = process.env.MONGODB_URI;
        const connection = await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB", connection.connection.host);
    }catch(error){
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}
export default connectMongoDB;