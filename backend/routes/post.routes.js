import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPost, getLikedPosts, getUserPosts, likeAndUnLikePost } from "../controller/post.controller.js";
import { get } from "mongoose";
const router = express.Router();
router.get('/',(req,res)=>{
    res.json({
        message:"Hello from post Route"
    })
})
router.get('/likes/:id',protectedRoute,getLikedPosts);
router.get('/following',protectedRoute,getFollowingPost)
router.get('/all',protectedRoute,getAllPosts);
router.get("/user/:username", protectedRoute, getUserPosts);
router.post('/create',protectedRoute,createPost);
router.post('/like/:id',protectedRoute,likeAndUnLikePost);
router.post('/comment/:id',protectedRoute,commentOnPost);
router.delete('/:id',protectedRoute,deletePost);

export default router;