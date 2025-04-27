import express from "express";
import fileRoutes from "./routes/fileRoutes";
import connectDB from "./db/connection";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()

app.use("/api/files", fileRoutes);

export default app;