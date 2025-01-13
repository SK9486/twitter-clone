import Notification from "../models/notification.model.js";
export const getNotifications = async (req, res) => {
    const id = req.user._id;
    try{
        if(!id){
            return res.status(400).json({error:"User not found"});
        }
        const notifications = await Notification.find({to:id}).populate({
            path:'from',
            select:"username profileImg"
    });
    await Notification.updateMany({to:id},{$set:{read:true}});
    res.status(200).json(notifications);
    }catch(error){
        console.log("Error in getNotifications controller", error.message);
        return res.status(500).json({error:"Internal Server Error"});
    }
};

export const deleteNotifications = async(req,res) => {
    const id = req.user._id;
    try{
        if(!id){
            return res.status(400).json({error:"User not found"});
        }
        await Notification.deleteMany({to:id});
        res.status(200).json({message:"Notifications deleted successfully"});
    }catch(error){
        console.log("Error in deleteNotifications controller", error.message);
        return res.status(500).json({error:"Internal Server Error"});
    }
};
