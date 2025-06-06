// import express from "express";
// import fileRoutes from "./routes/fileRoutes";

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Mount file routes
// app.use("/api/files", fileRoutes);

// export default app;

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import fileRoutes from "./routes/fileRoutes";
import authRoutes from "./routes/auth"; // <-- login/register маршрути

const app = express();

// ✅ Свързване с MongoDB
mongoose.connect("mongodb://localhost:27017/webtex")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middlewares
app.use(cors({
  origin: "http://localhost:3000", // React frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session (ако искаш да пазиш потребителски сесии)
app.use(session({
  secret: "supersecret", // смени с по-сигурен ключ
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // ако не си на HTTPS
}));

// ✅ Роутери
app.use("/api/files", fileRoutes);  // съществуваща логика
app.use("/api/auth", authRoutes);   // login / register

export default app;
