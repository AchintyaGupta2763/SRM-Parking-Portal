import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Access.css";

const Access = () => {
    const [filters, setFilters] = useState({ username: "", email: "", role: "" });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch users based on filters
    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/access/users", {
                headers: { Authorization: token },
                params: filters,
            });
            setUsers(response.data.users || []);
        } catch (err) {
            setError("Failed to fetch users.");
        }
        setLoading(false);
    };

    // Update user role
    const updateRole = async (id, currentRole) => {
        try {
            const newRole = currentRole === "user" ? "admin" : "user";
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/access/update-role/${id}`,
                { role: newRole },
                { headers: { Authorization: token } }
            );

            setUsers(users.map(user => (user._id === id ? { ...user, role: newRole } : user)));
        } catch (err) {
            alert("Error updating role");
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Clear filters after search
    const handleSearch = () => {
        fetchUsers();
        setFilters({ username: "", email: "", role: "" });
    };

    return (
        <div className="access-container">
            <h2>Access Management</h2>

            <div className="filter-section">
                <input type="text" name="username" placeholder="Search by Username" value={filters.username} onChange={handleChange} />
                <input type="email" name="email" placeholder="Search by Email" value={filters.email} onChange={handleChange} />
                <select name="role" value={filters.role} onChange={handleChange}>
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="table-container">
                {loading ? (
                    <p className="no-results">Loading...</p>
                ) : error ? (
                    <p className="no-results">{error}</p>
                ) : users.length === 0 ? (
                    <p className="no-results">No users found</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {user.role !== "super-admin" && (
                                            <button onClick={() => updateRole(user._id, user.role)}>
                                                {user.role === "user" ? "Make Admin" : "Revoke Admin"}
                                            </button>
                                        )}
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

export default Access;
