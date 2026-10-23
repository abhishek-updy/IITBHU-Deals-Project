import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Load variables from the .env file
dotenv.config();

// Connect to the MongoDB database
connectDB();

// Fix for using __dirname with ES modules (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security: Protect app from common vulnerabilities but allow images to load on the frontend
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
  })
);

// Logging: See details of every API request in the terminal (cleaner logs in production)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Allow the React frontend to talk to this API and safely send/receive cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Read JSON data from requests and understand cookies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Make the 'uploads' folder publicly accessible so product images can load on the website
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// A simple route to check if the server is alive
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "IITBHU Deals API is running" });
});

// Connect our route files to the main app
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Catch any wrong URLs or server errors (these must always be at the very bottom)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});