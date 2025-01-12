import { generateTokenAndSetCookie } from "../lib/utils/generateTokenAndSetCookie.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        message: "User created successfully",
        data: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          followers: newUser.followers,
          following: newUser.following,
          profileImg: newUser.profileImg,
          coverImg: newUser.coverImg
        }
      });
    } else {
      console.log("Error from Signup while creating new User : ", error);
      res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    console.log("Error from Signup: ", error);
    res.status(500).json({ message: "Internet Server error" });
  }
};

export const login = async (req, res) => {
  res.json({ message: "login endpoint" });
};

export const logout = async (req, res) => {
  res.json({ message: "logout endpoint" });
};
