import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
dotenv.config();

app.get('/',(req,res)=>{
    res.json({
        message:"Hello from Server"
    })
})

app.use("/api/auth",authRouter);
app.listen(PORT, (err) => {
    if(err){
        console.log("Error in Server", err.message);
    }else{
        console.log("Server is running on port 5000")
        connectMongoDB();
    }
});