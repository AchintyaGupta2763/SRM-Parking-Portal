const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyUser } = require("../middleware/authMiddleware");

// Fetch users based on filters (Only Super Admin can access)
router.get("/users", verifyUser, async (req, res) => {
    try {
        if (req.user.role !== "super-admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { username, email, role } = req.query;
        let filter = {};

        if (username) filter.username = new RegExp(username, "i");
        if (email) filter.email = new RegExp(email, "i");
        if (role) filter.role = role;

        const users = await User.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
    }
});

// Update user role (Only Super Admin can update)
router.put("/update-role/:id", verifyUser, async (req, res) => {
    try {
        if (req.user.role !== "super-admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { id } = req.params;
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User role updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating role", error: error.message });
    }
});

module.exports = router;