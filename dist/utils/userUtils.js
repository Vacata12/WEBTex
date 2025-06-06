"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.saveUsers = saveUsers;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const USERS_FILE = path_1.default.join(__dirname, '../../users.json');
function getUsers() {
    if (!fs_1.default.existsSync(USERS_FILE)) {
        fs_1.default.writeFileSync(USERS_FILE, '[]');
    }
    return JSON.parse(fs_1.default.readFileSync(USERS_FILE, 'utf-8'));
}
function saveUsers(users) {
    fs_1.default.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
