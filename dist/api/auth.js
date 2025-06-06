"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.logout = logout;
exports.getUser = getUser;
const API_BASE = 'http://localhost:5000';
async function login(email, password) {
    return fetch(`${API_BASE}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
}
async function register(firstName, lastName, username, email, password, confirmPassword) {
    return fetch(`${API_BASE}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, email, password, confirmPassword })
    });
}
async function logout() {
    return fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include'
    });
}
async function getUser() {
    const res = await fetch(`${API_BASE}/me`, { credentials: 'include' });
    return res.ok ? res.json() : null;
}
