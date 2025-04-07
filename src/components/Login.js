import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, ref, get, set } from './firebase';
import '../styles/index.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('player');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        try {
            // Check if admin credentials are correct
            if (role === 'admin') {
                if (username !== 'admin123') {
                    setError('Invalid admin credentials');
                    return;
                }
                navigate('/admin');
            } else {
                // For players, create/update player record
                const playerRef = ref(db, `players/${username}`);
                const snapshot = await get(playerRef);

                if (!snapshot.exists()) {
                    // If player doesn't exist, initialize their score
                    await set(playerRef, {
                        score: 0,
                        completedQuestions: [],
                        timestamp: Date.now()
                    });
                }

                // Store username in sessionStorage
                sessionStorage.setItem('currentPlayer', username);
                navigate('/quiz');
            }
        } catch (error) {
            setError('Error logging in. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className="login-container fade-in">
                <h1>Quiz Game Login</h1>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="player">Player</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login; 