import express from "express";
import fileRoutes from "./routes/fileRoutes";
import connectDB from "./config/db";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB()

// Routes
app.use("/api/files", fileRoutes);

export default app;