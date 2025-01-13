import express from "express";
import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

app.get('/',(req,res)=>{
    res.json({
        message:"Hello from Server"
    })
})

app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/posts",postRouter);
app.use('/api/notifications',notificationRouter)
app.listen(PORT, (err) => {
    if(err){
        console.log("Error in Server", err.message);
    }else{
        console.log("Server is running on port 5000")
        connectMongoDB();
    }
});