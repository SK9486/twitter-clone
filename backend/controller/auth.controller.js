import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import generateTokenAndSetCookie from "./../lib/utils/generateToken.js";

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        // Save user and generate token
        if (newUser) {
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, res);
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                coverImg: newUser.coverImg,
                profileImg: newUser.profileImg
            });
        } else {
            console.error("Error creating new user");
            return res.status(400).json({ error: "Error creating user" });
        }
    } catch (error) {
        console.error("Error in signup controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log("Invalid username or password");
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Invalid username or password");
            return res.status(400).json({ error: "Invalid username or password" });
        }
        console.log("ID : ", user._id);
        // Generate token and send response
        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            coverImg: user.coverImg,
            profileImg: user.profileImg
        });
    } catch (error) {
        console.error("Error in login controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Logout Controller
export const logout = async (req, res) => {
    try{
        res.cookie('jwt', '', {
            maxAge: 0,
        })
        res.status(200).json({ message: "Logged out successful" });
    }catch(error){
        console.error("Error in logout controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        console.log("Authenticated user:", req.user);
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        // Fetch the user and exclude the password field
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user data
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in getMe controller", error.message);
        return res.status(500).json({ error: error.message });
    }
};
