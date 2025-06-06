"use strict";
// import express from "express";
// import fileRoutes from "./routes/fileRoutes";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Mount file routes
// app.use("/api/files", fileRoutes);
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // ако клиентът ти е на порт 5173
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use("/api/files", fileRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
exports.default = app;
