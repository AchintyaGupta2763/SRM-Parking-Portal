import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import ParkingForm from './components/ParkingForm';
import AdminApproval from "./components/AdminApproval";
import UserHistory from './components/UserHistory';
import AdminHistory from './components/AdminHistory';
import Access from './components/Access';
import QRScanner from "./components/QRScanner";
import Document from "./components/Document";

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();
    
    return (
        <>
            {user && <Navbar />}
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
                <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} /> 
                <Route path="/documentation" element={<Document />} />
                <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
                
                {/* New Route for Parking Form */}
                <Route path="/request-parking" element={<ProtectedRoute><ParkingForm /></ProtectedRoute>} />
                <Route path="/approval" element={<ProtectedRoute><AdminApproval /></ProtectedRoute>} />
                <Route path="/user-history" element={<ProtectedRoute><UserHistory /></ProtectedRoute>} />
                <Route path="/admin-history" element={<ProtectedRoute><AdminHistory /></ProtectedRoute>} />
                <Route path="/access" element={<ProtectedRoute><Access /></ProtectedRoute>} />
                <Route path="/scan-qr" element={<ProtectedRoute><QRScanner /></ProtectedRoute>} />

                <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
