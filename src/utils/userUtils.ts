import fs from 'fs';
import path from 'path';

// Тип за потребител
export interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string; // hashed password
}

const USERS_FILE = path.join(__dirname, '../../users.json');

export function getUsers(): User[] {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, '[]');
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

export function saveUsers(users: User[]) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

