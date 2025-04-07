import React, { useEffect, useState } from 'react';
import '../styles/weather.css';

const WeatherEffect = ({ type, duration = 2000 }) => {
    const [visible, setVisible] = useState(true);
    const [randomOffset, setRandomOffset] = useState({
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        rotation: Math.random() * 360
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    const renderRain = () => {
        const drops = [];
        for (let i = 0; i < 10; i++) {
            drops.push(
                <div
                    key={i}
                    className="raindrop"
                    style={{
                        animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                        transform: `translateX(${Math.random() * 100}%) rotate(${Math.random() * 30 - 15}deg)`
                    }}
                />
            );
        }
        return <div className="rain">{drops}</div>;
    };

    const renderSun = () => {
        const rays = [];
        for (let i = 0; i < 10; i++) {
            rays.push(
                <div
                    key={i}
                    className="sun-ray"
                    style={{
                        animationDuration: `${Math.random() * 2 + 2}s`,
                        transform: `rotate(${i * 36}deg) translateZ(${Math.random() * 20 + 10}px)`
                    }}
                />
            );
        }
        return (
            <div className="sun">
                <div className="sun-rays" style={{ transform: `rotateX(${randomOffset.rotation}deg) rotateY(${randomOffset.rotation}deg)` }}>
                    {rays}
                    <div className="sun-core" />
                </div>
            </div>
        );
    };

    return (
        <div
            className="weather-effect"
            style={{
                transform: `translate(${randomOffset.x}px, ${randomOffset.y}px)`
            }}
        >
            {type === 'rain' ? renderRain() : renderSun()}
        </div>
    );
};

export default WeatherEffect; 