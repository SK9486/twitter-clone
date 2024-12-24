import express from "express";
import { login, logout, signup} from "../controller/auth.controller.js";

const router = express.Router();
router.get("/", (req, res) => {
    res.json({
        message:"Hello from auth Route"
    })
})

router.get("/signup",signup)

router.get("/login", login)

router.get("/logout",logout)

export default router;