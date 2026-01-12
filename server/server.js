// server.js
import dotenv from "dotenv";
import interviewRoutes from "./routes/interviewRoutes.js";
// 🚨 dotenv MUST be first
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
// import authRoutes from "./middleware/auth.js";
import authRoutes from "./routes/authRoutes.js";

console.log("ENV CHECK:", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/interviews", interviewRoutes);


connectDB();

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});



