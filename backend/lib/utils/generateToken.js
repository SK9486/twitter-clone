import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (id, res) => {
    try {
        // Ensure that 'userId' is used in the payload
        const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "15d" });
        let secure = process.env.NODE_ENV === "production" ? true : false;
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 24 * 60 * 60 * 1000, 
            // TODO: set secure to secure variable
            secure: false // Set to `true` in production with HTTPS
        });
        console.log(`JWT Token generated: ${token}`);
    } catch (error) {
        console.error("Error generating token or setting cookie:", error.message);
        res.status(500).send("Error in generating Cookies");
    }
};

export default generateTokenAndSetCookie;
