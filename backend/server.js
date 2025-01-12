import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
// console.log(process.env.MONGO_URL);
app.use("/api/auth", authRoutes);
app.use(express.json());

app.get("/", (res, req) => {
  req.send("Hello from Server");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
