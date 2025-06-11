import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel"; 


export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password)
    return res.status(400).json({ message: "All fields are required." });


  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    return res.status(400).json({ message: "Email already in use." });

  const existingUsername = await User.findOne({ username });
  if (existingUsername)
    return res.status(400).json({ message: "Username already taken." });


  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json({ message: "Registration successful." });
};

// 📌 POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Missing username or password." });

  const user = await User.findOne({ username });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials." });


  user.lastLogin = new Date();
  await user.save();

  req.session.user = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  };


  res.status(200).json({ 
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
};
