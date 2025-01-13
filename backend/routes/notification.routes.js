import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { deleteNotifications, getNotifications } from "../controller/notification.controller.js";
const router = express.Router();
// router.get("/",(req,res)=>{
//     res.json({
//         message:"Hello from notification Route"
//     })
// });

router.get('/',protectedRoute,getNotifications);
router.delete('/',protectedRoute,deleteNotifications)

export default router;