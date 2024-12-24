import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongoDB.js";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
dotenv.config();

app.get('/',(req,res)=>{
    res.json({
        message:"Hello from Server"
    })
})

app.use("/api/auth",authRouter);
app.listen(PORT, () => {
    console.log("Server is running on port 5000")
    connectMongoDB();
});