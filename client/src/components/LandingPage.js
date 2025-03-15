import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const features = [
        { title: 'Area 1', description: 'Suitable for Bike Parking' },
        { title: 'Area 2', description: 'Suitable for Car Parking' },
        { title: 'Area 3', description: 'Suitable for Scooty Parking' },
        { title: 'Area 4', description: 'Suitable for Bike Parking' },
        { title: 'Area 5', description: 'Suitable for Car Parking' },
        { title: 'Area 6', description: 'Suitable for Scooty Parking' }
    ];

    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1 className="welcome-text">🚗 Welcome to the Parking Portal Dashboard, {user?.username}! 🅿️</h1>
                <p>Effortlessly manage parking slots, track vehicles, and streamline operations.</p>
            </header>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div 
                        key={index} 
                        className="feature-card" 
                        onClick={() => navigate('/request-parking', { state: { parkingArea: feature.title } })} 
                        style={{ cursor: 'pointer' }}
                    >
                        <h3>🅿️ {feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>

            <section className="getting-started">
                <h2>🚀 Get Started with Smart Parking</h2>
                <p>
                    Use this dashboard to manage parking operations efficiently. Explore the sections above 
                    to book slots, track vehicles, and analyze parking data. 
                </p>
                <p>📌 Need help? Visit our <a href="/documentation">Documentation</a> for step-by-step guides.</p>
            </section>
        </div>
    );
};

export default LandingPage;
