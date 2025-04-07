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
        if (username && role) {
            try {
                const userRef = ref(db, `users/${username}`);
                await set(userRef, {
                    username,
                    role,
                    score: 0,
                    completedQuestions: [],
                    isPlaying: false
                });
                navigate('/#/quiz');
            } catch (error) {
                console.error('Error logging in:', error);
                setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
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