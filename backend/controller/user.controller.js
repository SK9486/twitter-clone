import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req,res) => {
    const {username} = req.params;
    try{
        const user = await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json(user);
    }catch(err){
            console.log("Error in getUserProfile controller", err.message);
            return res.status(500).json({message:"Internal Server Error"});
    }
};

export const followAndUnFollowUser = async (req,res) => {
    try{
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    if(!userToModify || !currentUser){
        return res.status(404).json({message:"User not found"});
    }
    if(id===req.user._id.toString()){
        return res.status(400).json({message:"You cannot follow or unfollow yourself"});
    }
    const isFollowing = currentUser.following.includes(id);
    if(isFollowing){
        // UnFollow the user
        await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
        await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
        const newNotification = new Notification({from:req.user._id,to:id,type:"unFollow"});
        await newNotification.save();
        res.status(200).json({message:"UnFollowed successfully"});
    }else{
        // follow the user
        await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
        await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
        const newNotification = new Notification({from:req.user._id,to:userToModify._id,type:"follow"});
        await newNotification.save();
        res.status(200).json({message:"Followed successfully"});
        // send notification to tht user
    }
    }
    catch(err){
        console.log("Error in followAndUnFollowUser controller", err.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

export const getSuggestedUsers = async (req,res) => {
    try{
        const UserId = req.user._id;
        const usersFollow = await User.findById(UserId).select("following");
        const users = await User.aggregate([
            {
                $match:{
                    _id:{$ne:UserId},
                }
            },
            {$sample:{size:10}},
        ])
        const filterUsers = users.filter((user) => !usersFollow.following.includes(user._id));
        const suggestedUsers = filterUsers.slice(0,4);
        suggestedUsers.forEach((user) => {
            user.password=null;
        })
        res.status(200).json(filterUsers);
    }catch(err){
        console.log("Error in getSuggestedUsers controller", err.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

export const updateUserProfile = async (req,res) => {
    let {username,fullName,email,currentPassword,newPassword,bio,link} = req.body;
    let {profileImg,coverImg} = req.body;
    let userId = req.user._id
    try{
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(!username && !fullName && !email && !currentPassword && !newPassword && !profileImg && !coverImg && !bio && !link){
            return res.status(400).json({message:"No fields to update"});
        }
        if((!newPassword && currentPassword)||(newPassword && !currentPassword)){
            return res.status(400).json({message:"Please provide both current password and new password"});
        }
        if(currentPassword && newPassword){
            if(currentPassword === newPassword){
                return res.status(400).json({message:"New password cannot be same as current password"});
            }
            let isMatch = await bcrypt.compare(currentPassword,user.password);
            if(!isMatch){
                return res.status(400).json({message:"Invalid current password"});
            }
            if(newPassword.length<6){
                return res.status(400).json({message:"Password must be at least 6 characters long"});
            }
            let salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword,salt);
            return res.status(200).json({message:"Password updated successfully"});
        }
        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            let uploadImg = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadImg.secure_url;
        }
        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            let uploadImg = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadImg.secure_url;
        }
        if(email){
            let validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!validEmail.test(email)){
                return res.status(400).json({message:"Invalid email format"});
            }
            const emailExists = await User.findOne({email});
            if(emailExists){
                return res.status(400).json({message:"Email already exists"});
            }
            return res.status(200).json({message:"Email updated successfully"});
            user.email = email;
        }
        user.fullName = fullName || user.fullName;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.coverImg = coverImg || user.coverImg;
        user.profileImg = profileImg || user.profileImg;
        user = await user.save();
        user.password = null;
        res.status(200).json(user);
    }catch(err){
        console.log("Error in updateUserProfile controller", err.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
};