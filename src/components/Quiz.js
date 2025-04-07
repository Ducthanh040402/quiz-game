import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, ref, set, get } from './firebase';
import WeatherEffect from './WeatherEffect';
import '../styles/index.css';
import questionsData from '../data/questions.json';

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [username, setUsername] = useState('');
    const [showWeatherEffect, setShowWeatherEffect] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [showStoryInput, setShowStoryInput] = useState(false);
    const [story, setStory] = useState('');
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [timerActive, setTimerActive] = useState(true);
    const [imageRevealClass, setImageRevealClass] = useState('reveal-image');
    const [isRevealComplete, setIsRevealComplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentPlayer = sessionStorage.getItem('currentPlayer');
        if (!currentPlayer) {
            navigate('/');
            return;
        }
        setUsername(currentPlayer);

        // Initialize player status
        const playerRef = ref(db, `players/${currentPlayer}`);
        set(playerRef, {
            score: 0,
            completedQuestions: [],
            currentQuestion: 1,
            isPlaying: true,
            timestamp: Date.now(),
            stories: {}
        }).catch(error => {
            console.error('Error initializing player status:', error);
        });

        // Select random questions
        const allQuestions = questionsData.questions;
        const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffledQuestions.slice(0, 10);
        setQuestions(selectedQuestions);
    }, [navigate]);

    // Timer effect
    useEffect(() => {
        if (timerActive && timeLeft > 0 && !showStoryInput && !showScore) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && timerActive) {
            // Time's up, handle as incorrect answer
            setTimerActive(false);
            setCurrentQuestionId(questions[currentQuestion].id);
            setShowStoryInput(true);
        }
    }, [timeLeft, timerActive, currentQuestion, questions, showStoryInput, showScore]);

    // Reset timer when moving to next question
    useEffect(() => {
        if (!showStoryInput && !showScore) {
            setTimeLeft(15);
            setTimerActive(true);
        }
    }, [currentQuestion, showStoryInput, showScore]);

    // Reset hiệu ứng khi chuyển câu hỏi
    useEffect(() => {
        setImageRevealClass('reveal-image');
        setIsRevealComplete(false);
    }, [currentQuestion]);

    const handleTimeUp = () => {
        setTimerActive(false);
        setCurrentQuestionId(questions[currentQuestion].id);
        setShowStoryInput(true);
    };

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && !showStoryInput && !showScore) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    const newTime = prev - 1;
                    // Cập nhật hiệu ứng hiển thị hình ảnh
                    const revealPercentage = Math.floor((1 - newTime / 20) * 100);
                    setImageRevealClass(`reveal-image-${Math.min(revealPercentage, 100)}`);

                    if (revealPercentage >= 100) {
                        setIsRevealComplete(true);
                    }

                    return newTime;
                });
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !showStoryInput && !showScore) {
            handleTimeUp();
        }
    }, [timeLeft, showStoryInput, showScore]);

    const handleAnswerClick = async (selectedAnswer) => {
        setTimerActive(false);
        const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        if (isCorrect) {
            // Randomly choose between rain and sun effect
            const effect = Math.random() > 0.5 ? 'rain' : 'sun';
            setShowWeatherEffect(effect);
            setTimeout(() => setShowWeatherEffect(null), 2000);
        } else {
            // Show story input for incorrect answer
            setCurrentQuestionId(questions[currentQuestion].id);
            setShowStoryInput(true);
            return; // Don't proceed to next question until story is submitted
        }

        const nextQuestion = currentQuestion + 1;
        const playerRef = ref(db, `players/${username}`);

        try {
            if (nextQuestion < questions.length) {
                await set(playerRef, {
                    score: newScore,
                    completedQuestions: [...Array(currentQuestion + 1).keys()].map(i => i + 1),
                    currentQuestion: nextQuestion + 1,
                    isPlaying: true,
                    timestamp: Date.now()
                });
                setCurrentQuestion(nextQuestion);
            } else {
                await set(playerRef, {
                    score: newScore,
                    completedQuestions: questions.map(q => q.id),
                    currentQuestion: null,
                    isPlaying: false,
                    timestamp: Date.now()
                });
                setShowScore(true);
            }
        } catch (error) {
            console.error('Error updating player status:', error);
        }
    };

    const handleStorySubmit = async (e) => {
        e.preventDefault();
        if (!story.trim()) return;

        const playerRef = ref(db, `players/${username}`);
        try {
            // Get current player data
            const snapshot = await get(playerRef);
            const playerData = snapshot.val() || {};
            const currentStories = playerData.stories || {};

            // Add new story
            currentStories[currentQuestionId] = {
                story: story.trim(),
                timestamp: Date.now(),
                questionId: currentQuestionId
            };

            // Update player data with new story
            await set(playerRef, {
                ...playerData,
                stories: currentStories
            });

            // Reset story input and proceed to next question
            setStory('');
            setShowStoryInput(false);
            setCurrentQuestionId(null);

            // Move to next question
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
            } else {
                setShowScore(true);
            }
        } catch (error) {
            console.error('Error saving story:', error);
        }
    };

    const handleRetry = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setShowStoryInput(false);
        setTimeLeft(20);
        setTimerActive(true);
        navigate('/quiz');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('currentPlayer');
        navigate('/');
    };

    if (!username || questions.length === 0) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="container">
            {showWeatherEffect && <WeatherEffect type={showWeatherEffect} />}
            <div className="quiz-container fade-in">
                <div className="quiz-header">
                    <span>Question {currentQuestion + 1}/{questions.length}</span>
                    <div className="timer-container">
                        <div className="timer-text">
                            <span>Time Left: </span>
                            <span className={timeLeft <= 5 ? 'time-warning' : ''}>{timeLeft}s</span>
                        </div>
                        <div className="timer-progress">
                            <div
                                className={`timer-progress-bar ${timeLeft <= 5 ? 'warning' : ''}`}
                                style={{ width: `${(timeLeft / 15) * 100}%` }}
                            />
                        </div>
                    </div>
                    <span>Score: {score}</span>
                </div>

                {showScore ? (
                    <div className="quiz-score">
                        <h2>Quiz Completed!</h2>
                        <p>You scored {score} out of {questions.length}</p>
                        <div className="quiz-actions">
                            <button onClick={handleRetry} className="btn btn-primary">
                                Try Again
                            </button>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                Logout
                            </button>
                        </div>
                    </div>
                ) : showStoryInput ? (
                    <div className="story-input">
                        <h2>Oops! {timeLeft === 0 ? "Time's up!" : "That's not correct."}</h2>
                        <p>Please share a short story or experience related to this question:</p>
                        <form onSubmit={handleStorySubmit}>
                            <textarea
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                placeholder="Share your story here..."
                                className="story-textarea"
                                required
                            />
                            <button type="submit" className="btn btn-primary">
                                Submit Story
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="quiz-question">
                            <div className={`question-image-container ${isRevealComplete ? 'reveal-complete' : ''}`}>
                                <img
                                    src={questions[currentQuestion].imageUrl}
                                    alt="Gợi ý câu hỏi"
                                    className={`question-image ${imageRevealClass}`}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                    }}
                                />
                            </div>
                            <h2 className="question-text">{questions[currentQuestion].question}</h2>
                        </div>
                        <div className="quiz-options">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(option)}
                                    className="option-button"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Quiz; 