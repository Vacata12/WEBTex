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
import session from "express-session";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // ако клиентът ти е на порт 5173
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);

export default app;
