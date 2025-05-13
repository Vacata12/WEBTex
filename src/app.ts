import express from "express";
import fileRoutes from "./routes/fileRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount file routes
app.use("/api/files", fileRoutes);

export default app;