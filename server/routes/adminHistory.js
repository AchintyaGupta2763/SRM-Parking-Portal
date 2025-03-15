const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");
const ParkingRequest = require("../models/ParkingRequest");

// Fetch parking requests based on filters
router.get("/history", verifyAdmin, async (req, res) => {
    try {
        const { name, month, year, status } = req.query;
        let filter = {};

        // Filter by name (if provided)
        if (name) filter.name = new RegExp(name, "i"); // Case-insensitive search

        // Filter by status (accepted/rejected)
        if (status) filter.status = status;

        // Filter by month and year (if provided)
        if (month || year) {
            filter.createdAt = {};
            if (year) filter.createdAt.$gte = new Date(`${year}-01-01T00:00:00.000Z`);
            if (year) filter.createdAt.$lte = new Date(`${year}-12-31T23:59:59.999Z`);
            if (month) {
                const startOfMonth = new Date(`${year}-${month}-01T00:00:00.000Z`);
                const endOfMonth = new Date(startOfMonth);
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                endOfMonth.setDate(0); // Last day of the month
                filter.createdAt.$gte = startOfMonth;
                filter.createdAt.$lte = endOfMonth;
            }
        }

        // Fetch the filtered parking requests
        const requests = await ParkingRequest.find(filter).sort({ createdAt: -1 });

        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
});

module.exports = router;
