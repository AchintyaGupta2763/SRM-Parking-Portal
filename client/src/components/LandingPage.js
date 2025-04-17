import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const features = [
        { title: 'Main Campus'},
        { title: 'Tech Park' },
        { title: 'Tech Tower' },
        { title: 'T.P Ganesan Auditorium' },
        { title: 'C.V Raman Block' },
        { title: 'MBA Building' },
        { title: 'School Of Law' }
    ];

    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1 className="welcome-text">🚗 Welcome to the Visitor Pass Portal Dashboard, {user?.username}! 🅿️</h1>
            </header>
            <h1>Select Your Parking Spot 👇</h1>
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
                    to book slots. 
                </p>
                {/* <p>📌 Need help? Visit our <a href="/documentation">Documentation</a> for step-by-step guides.</p> */}
            </section>
        </div>
    );
};

export default LandingPage;
