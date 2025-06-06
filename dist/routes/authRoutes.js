"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel")); // моделът от MongoDB
const router = express_1.default.Router();
// 📌 POST /api/auth/register
router.post("/register", async (req, res) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    const existing = await userModel_1.default.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        return res.status(400).json({ message: "Email or username already exists" });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = new userModel_1.default({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Registered successfully" });
});
// 📌 POST /api/auth/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password" });
    }
    const user = await userModel_1.default.findOne({ username });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    // Записваме в сесията
    req.session.user = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
    };
    res.status(200).json({ message: "Login successful" });
});
// 📌 GET /api/auth/me
router.get("/me", (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    }
    else {
        res.status(401).json({ message: "Not logged in" });
    }
});
// 📌 POST /api/auth/logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "Logged out" });
    });
});
exports.default = router;
