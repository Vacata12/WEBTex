import React from 'react';
import { useEffect, useState } from 'react';
import { getUser, logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [user, setUser] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUser().then(data => {
            if (data) setUser(data.user);
            else navigate('/login');
        });
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div>
            <h2>Welcome, {user}!</h2>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}
