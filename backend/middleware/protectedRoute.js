import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectedRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized: No Token Provided"})
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({message:"Unauthorized : Invalid Token"})
        }
        const user = await User.findById(decode.userId).select("-password");
        console.log("Authenticated user:", user);
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        req.user = user;
        next();
    }catch(error){
        console.log("Error occur in Protected Middleware", error.message);
        return res.status(500).json({ error:"Internet Server Error" });
    }
}