import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminHistory.css";

const AdminHistory = () => {
    const [filters, setFilters] = useState({
        name: "",
        month: "",
        year: "",
        status: "",
    });

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch requests based on filters
    const fetchRequests = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token"); // Ensure token is included
            const response = await axios.get("http://localhost:5000/api/admin-history/history", {
                headers: { Authorization: `Bearer ${token}` },
                params: filters,
            });
            setRequests(response.data.requests || []);
        } catch (err) {
            setError("Failed to fetch applications.");
        }
        setLoading(false);
    };

    // Handle input changes
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="admin-history-container">
            <h2>Admin History</h2>

            {/* Filters Section */}
            <div className="filter-section">
                <div className="filters">
                    <input type="text" name="name" placeholder="Search by Name" value={filters.name} onChange={handleChange} />
                    {/* <select name="month" value={filters.month} onChange={handleChange}>
                        <option value="">Select Month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select> */}
                    <input type="number" name="year" placeholder="Enter Year" value={filters.year} onChange={handleChange} />
                    <select name="status" value={filters.status} onChange={handleChange}>
                        <option value="">Select Status</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button onClick={fetchRequests}>Search</button>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-container">
                {loading ? (
                    <p className="no-results">Loading...</p>
                ) : requests.length === 0 ? (
                    <p className="no-results">No results found</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Duration</th>
                                <th>Vehicle Type</th>
                                <th>Brand</th>
                                <th>Number</th>
                                <th>Color</th>
                                <th>Parking Area</th>
                                <th>Category</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id}>
                                    <td>{req.name}</td>
                                    <td>{new Date(req.fromDate).toLocaleDateString()}</td>
                                    <td>{new Date(req.toDate).toLocaleDateString()}</td>
                                    <td>{Math.ceil((new Date(req.toDate) - new Date(req.fromDate)) / (1000 * 60 * 60 * 24))} days</td>
                                    <td>{req.vehicleType}</td>
                                    <td>{req.vehicleBrand}</td>
                                    <td>{req.vehicleNumber}</td>
                                    <td>{req.vehicleColor}</td>
                                    <td>{req.parkingArea}</td>
                                    <td>{req.category}</td>
                                    <td className={req.status === "approved" ? "status-approved" : "status-rejected"}>
                                        {req.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminHistory;
