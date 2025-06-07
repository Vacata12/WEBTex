const API_BASE = 'http://localhost:5000';

export async function login(email: string, password: string) {
    return fetch(`${API_BASE}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
}

export async function register(firstName: string, lastName: string, username: string, email: string, password: string, confirmPassword: string) {
    return fetch(`${API_BASE}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, email, password, confirmPassword })
    });
}

export async function logout() {
    return fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include'
    });
}

export async function getUser() {
    const res = await fetch(`${API_BASE}/me`, { credentials: 'include' });
    return res.ok ? res.json() : null;
}
