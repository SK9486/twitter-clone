import express from "express";
import { getMe, login, logout, signup} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();
router.get("/", (req, res) => {
    res.json({
        message:"Hello from auth Route"
    })
})

router.post("/signup",signup)
router.post("/login", login)
router.post("/logout",logout)
router.get('/me',protectedRoute,getMe)

export default router;