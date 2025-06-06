import express from 'express';
import bcrypt from 'bcryptjs';
import { getUsers, saveUsers, User } from '../utils/userUtils';

const router = express.Router();

//Разширяване на сесията
declare module 'express-session' {
    interface SessionData {
        user?: { username: string };
    }
}

// Регистрация
router.post('/register', (req, res) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;
    const users = getUsers();

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (users.some(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long, contain a digit and an uppercase letter' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser: User = {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword
    };

    users.push(newUser);
    saveUsers(users);

    return res.status(200).json({ message: 'Registered successfully' });
});

// Вход (Login)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = { username: user.username };

    return res.status(200).json({ message: 'Logged in successfully' });
});

// Данни за текущия логнат потребител
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user.username });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

// Изход (Logout)
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: 'Logged out' });
    });
});

export default router;



