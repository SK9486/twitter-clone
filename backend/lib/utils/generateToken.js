import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (id, res) => {
    try {
        // Ensure that 'userId' is used in the payload
        const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "15d" });

        // Set the secure flag based on the environment (true for production)
        let secure = process.env.NODE_ENV === "production" ? true : false;

        res.cookie("jwt", token, {
            httpOnly: true,  // Prevent client-side JS from accessing the cookie
            sameSite: "strict",  // Prevent cross-site request forgery
            maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days in milliseconds
            secure: secure,  // Use dynamic secure flag based on environment
        });

        console.log(`JWT Token generated: ${token}`);
    } catch (error) {
        console.error("Error generating token or setting cookie:", error.message);
        res.status(500).send("Error in generating Cookies");
    }
};

export default generateTokenAndSetCookie;
