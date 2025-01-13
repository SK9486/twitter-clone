import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { followAndUnFollowUser, getSuggestedUsers, getUserProfile, updateUserProfile } from "../controller/user.controller.js";

const router = express.Router();
router.get('/',(req,res)=>{
    res.json({
        message:"Hello from user Route"
    })
})
router.get('/profile',protectedRoute,(req,res)=>{
    res.json({
        message:"Hello from Profile Route"
    })
});
router.get('/profile/:username',protectedRoute,getUserProfile);
router.get('/suggested',protectedRoute,getSuggestedUsers);
router.post('/follow/:id',protectedRoute,followAndUnFollowUser);
router.post('/update',protectedRoute,updateUserProfile);

export default router;