import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import QRCode from "qrcode";
import "./AdminApproval.css";

const AdminApproval = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [signatureUploaded, setSignatureUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);
  const localStorageKey = `adminSignature_${user?.id}_${today}`;

  // Load signature (QR code) from localStorage on mount
  useEffect(() => {
    const storedSignature = localStorage.getItem(localStorageKey);
    if (storedSignature) {
      setAdminSignature(storedSignature);
      setSignatureUploaded(true);
    }
  }, [localStorageKey]);

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_URL}/admin/pending-requests`, {
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

    fetchPendingRequests();
  }, []);

  // Generate QR code and store it in localStorage
  const generateQrCode = async (request) => {
    const qrCodeData = JSON.stringify({
      requestId: request._id,
      adminId: user.id,
      date: today,
      status: "approved",
    });

    try {
      const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);
      setAdminSignature(qrCodeBase64);
      localStorage.setItem(localStorageKey, qrCodeBase64);
      setSignatureUploaded(true);
      return qrCodeBase64;
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Error generating QR code");
      return null;
    }
  };

  // Approve or decline request
  const handleApproval = async (id, action) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    if (action === "approved" && !signatureUploaded) {
      const request = requests.find((req) => req._id === id);
      const qrCodeBase64 = await generateQrCode(request);
      if (!qrCodeBase64) return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/admin/approve/${id}`,
        { status: action, adminSignature: action === "approved" ? adminSignature : "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests(requests.filter((req) => req._id !== id));
      alert(`Request ${action} successfully!`);
    } catch (error) {
      console.error("Error updating request:", error.response?.data || error.message);
      alert("Error updating request");
    }
  };

  return (
    <div className="admin-approval-container">
      <h2>Pending Parking Approvals</h2>

      {/* QR Code Section */}
      <div className="signature-upload-section">
        {signatureUploaded ? (
          <div className="signature-preview">
            <p>Your QR code for today:</p>
            <img src={adminSignature} alt="Admin QR Code" className="signature-image" />
          </div>
        ) : (
          <div className="upload-container">
            <p>QR code will be generated upon approval.</p>
          </div>
        )}
      </div>

      {error && <div className="error-message">Error: {error}</div>}
      {loading ? (
        <p>Loading pending requests...</p>
      ) : requests.length === 0 ? (
        <p>No pending approvals.</p>
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
                <strong>Duration:</strong> {new Date(request.fromDate).toLocaleDateString()} to {new Date(request.toDate).toLocaleDateString()}
              </p>
              <p><strong>Parking Area:</strong> {request.parkingArea}</p>
              <div className="button-group">
                <button className="approve-btn" onClick={() => handleApproval(request._id, "approved")}>
                  Approve
                </button>
                <button className="decline-btn" onClick={() => handleApproval(request._id, "rejected")}>
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApproval;