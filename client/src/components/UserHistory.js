import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./UserHistory.css";
import jsPDF from "jspdf"; // Library for generating PDFs
import autoTable from "jspdf-autotable"; // Plugin for creating tables in PDFs

const UserHistory = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to format date as DD-MM-YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Fetch user's parking requests
    useEffect(() => {
        const fetchUserRequests = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token is missing. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${process.env.REACT_APP_URL}/user/user-requests`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.success && Array.isArray(res.data.requests)) {
                    setRequests(res.data.requests);
                } else {
                    setError("Unexpected response structure from server.");
                }
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserRequests();
    }, []);

    // Function to generate a PDF for approved requests
    const generatePDF = (application) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("SRM PARKING APPLICATION", 14, 20);
        doc.setFontSize(12);
    
        // Use autoTable to create a table for application details
        autoTable(doc, {
            startY: 30,
            head: [["Field", "Details"]],
            body: [
                ["Name", application.name],
                ["Category", application.category],
                ["Vehicle", `${application.vehicleBrand} (${application.vehicleType})`],
                ["Number", application.vehicleNumber],
                ["Color", application.vehicleColor],
                [
                    "Duration",
                    `${formatDate(application.fromDate)} to ${formatDate(application.toDate)}`
                ],
                ["Parking Area", application.parkingArea],
                ["Status", application.status],
            ],
        });
    
        // Add QR code if adminSignature exists
        if (application.adminSignature) {
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60; // Add some spacing after the table
    
            // Add a title for the QR code
            doc.setFontSize(12);
            doc.text("Admin Approval QR Code:", 14, finalY + 5);
    
            // Add a border around the QR code
            doc.setDrawColor(0); // Set border color to black
            doc.setLineWidth(0.5); // Set border thickness
            doc.rect(14, finalY + 10, 50, 50); // Draw a rectangle around the QR code
    
            // Add the QR code image inside the border
            doc.addImage(application.adminSignature, "PNG", 16, finalY + 12, 46, 46); // Adjust size and position
        }
    
        // Save the PDF with a unique name
        doc.save(`Parking_Application_${application.name}.pdf`);
    }; 

    return (
        <div className="user-history-container">
            <h2>Your Parking Requests</h2>

            {error && <div className="error-message">Error: {error}</div>}
            {loading ? (
                <p>Loading your requests...</p>
            ) : requests.length === 0 ? (
                <p>No parking requests found.</p>
            ) : (
                <div className="requests-list">
                    {requests.map((request) => (
                        <div key={request._id} className="request-card">
                            <p><strong>Name:</strong> {request.name}</p>
                            <p><strong>Category:</strong> {request.category}</p>
                            <p><strong>Vehicle:</strong> {request.vehicleBrand} ({request.vehicleType})</p>
                            <p><strong>Number:</strong> {request.vehicleNumber}</p>
                            <p><strong>Color:</strong> {request.vehicleColor}</p>
                            <p>
                                <strong>Duration:</strong> {formatDate(request.fromDate)} to {formatDate(request.toDate)}
                            </p>
                            <p><strong>Parking Area:</strong> {request.parkingArea}</p>
                            <p><strong>Status:</strong> <span className={`status-${request.status}`}>{request.status}</span></p>

                            {request.status === "approved" && (
                                <button className="download-btn" onClick={() => generatePDF(request)}>
                                    Download as PDF
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserHistory;