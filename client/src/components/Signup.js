import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        otp: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOTPSignup, setIsOTPSignup] = useState(false); // Toggle between OTP and password signup

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!isOTPSignup && !formData.password) {
            newErrors.password = 'Password is required';
        } else if (!isOTPSignup && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (isOTPSignup && !formData.otp) {
            newErrors.otp = 'OTP is required';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                let response;
                if (isOTPSignup) {
                    response = await axios.post('http://localhost:5000/api/auth/verify-signup-otp', {
                        username: formData.username,
                        email: formData.email,
                        otp: formData.otp
                    });
                } else {
                    response = await axios.post('http://localhost:5000/api/auth/signup', {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password
                    });
                }
                if (response.data.success) {
                    login(response.data.user, response.data.token);
                    navigate('/dashboard');
                }
            } catch (error) {
                setErrors({
                    submit: error.response?.data?.message || 'An error occurred during signup'
                });
            }
            setIsSubmitting(false);
        } else {
            setErrors(newErrors);
        }
    };

    const handleGenerateOTP = async () => {
        if (!formData.email) {
            setErrors({ email: 'Email is required' });
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/auth/signup-with-otp', {
                username: formData.username,
                email: formData.email
            });
            alert('OTP sent to your email');
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || 'Error generating OTP' });
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">SRM PARKING PORTAL</h1>
            <h2 className="auth-title">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>

                {!isOTPSignup && (
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                )}

                {isOTPSignup && (
                    <div className="form-group">
                        <label htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                        />
                        {errors.otp && <div className="error">{errors.otp}</div>}
                        <button type="button" onClick={handleGenerateOTP} className="otp-button">
                            Send OTP
                        </button>
                    </div>
                )}

                {errors.submit && <div className="error">{errors.submit}</div>}

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <div className="auth-link">
                <button 
                    type="button" 
                    onClick={() => setIsOTPSignup(!isOTPSignup)}
                    className="toggle-button"
                >
                    {isOTPSignup ? 'Sign Up with Password' : 'Sign Up with OTP'}
                </button>
                <br />
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default Signup;