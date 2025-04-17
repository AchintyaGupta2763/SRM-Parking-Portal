import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <div className='navbar-heading'>
                <h1>SRM VISITOR PASS PORTAL</h1>
            </div>
            <nav className="navbar">
                {/* Hamburger Menu for Mobile */}
                <div className="hamburger-menu" onClick={toggleMobileMenu}>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </div>

                {/* Navbar Links */}
                <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/home" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>

                    {user?.role === 'user' && (
                        <>
                            <Link to="/request-parking" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Request Parking</Link>
                            <Link to="/user-history" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>History</Link>
                        </>
                    )}
                    
                    {user?.role === 'guard' && (
                        <>
                            <Link to="/scan-qr" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Scan QR</Link>
                        </>
                    )}

                    {user?.role === 'admin' && (
                        <>
                            <Link to="/admin-history" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>History</Link>
                            <Link to="/approval" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Approval</Link>
                            {/* <Link to="/access" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Access</Link> */}
                        </>
                    )}
                    {user?.role === 'super-admin' && (
                        <>
                            <Link to="/admin-history" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>History</Link>
                            <Link to="/approval" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Approval</Link>
                            <Link to="/access" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Access</Link>
                        </>
                    )}
                </div>

                {/* Logout Button */}
                <button onClick={handleLogout} className="navbar-button">Logout</button>
            </nav>
        </>
    );
};

export default Navbar;