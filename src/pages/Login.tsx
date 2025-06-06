import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await login(username, password);
        if (res.ok) {
            navigate('/dashboard');
        } else {
            const data = await res.json();
            setError(data.message || 'Invalid username or password');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
            />

            <button type="submit">Log In</button>

            <p>Don't have an account? <button type="button" onClick={() => navigate('/register')}>Sign Up</button></p>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}
