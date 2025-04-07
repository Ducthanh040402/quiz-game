import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, ref, onValue } from './firebase';
import '../styles/index.css';

const Admin = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const playersRef = ref(db, 'players');

        // Set up real-time listener
        const unsubscribe = onValue(playersRef, (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const playersData = snapshot.val();
                    const playersArray = Object.entries(playersData)
                        .filter(([_, data]) => data !== null) // Filter out null entries
                        .map(([username, data]) => ({
                            username,
                            ...data
                        }));

                    // Sort by score (highest first)
                    playersArray.sort((a, b) => (b.score || 0) - (a.score || 0));
                    setPlayers(playersArray);
                } else {
                    setPlayers([]);
                }
            } catch (error) {
                console.error('Error processing player data:', error);
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error('Error fetching players:', error);
            setLoading(false);
            setPlayers([]);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('currentPlayer');
        navigate('/#/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="admin-container fade-in">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                    >
                        Logout
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Current Score</th>
                                <th>Questions Answered</th>
                                <th>Current Question</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, index) => (
                                <tr key={player.username}>
                                    <td>{index + 1}</td>
                                    <td>{player.username}</td>
                                    <td>{player.score || 0}</td>
                                    <td>{player.completedQuestions?.length || 0}</td>
                                    <td>
                                        {player.currentQuestion ? `Question ${player.currentQuestion}` : 'Not started'}
                                    </td>
                                    <td>
                                        {player.isPlaying ? (
                                            <span className="text-success">Playing</span>
                                        ) : (
                                            <span className="text-muted">Completed</span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(player.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {players.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No players found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin; 