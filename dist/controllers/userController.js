"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel")); // твоят модел
// 📌 POST /api/auth/register
const register = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password)
        return res.status(400).json({ message: "All fields are required." });
    // Проверки за уникалност
    const existingEmail = await userModel_1.default.findOne({ email });
    if (existingEmail)
        return res.status(400).json({ message: "Email already in use." });
    const existingUsername = await userModel_1.default.findOne({ username });
    if (existingUsername)
        return res.status(400).json({ message: "Username already taken." });
    // Хеширане на парола
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = new userModel_1.default({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Registration successful." });
};
exports.register = register;
// 📌 POST /api/auth/login
const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: "Missing username or password." });
    const user = await userModel_1.default.findOne({ username });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials." });
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials." });
    // Обновяване на lastLogin
    user.lastLogin = new Date();
    await user.save();
    // Създаване на сесия (ако използваш express-session)
    req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
    };
    res.status(200).json({ message: "Login successful." });
};
exports.login = login;
