const express = require("express");
const ParkingRequest = require("../models/ParkingRequest");
const router = express.Router();

// Submit Parking Request
router.post("/request", async (req, res) => {
    try {
        const newRequest = new ParkingRequest(req.body);
        await newRequest.save();
        res.json({ success: true, message: "Request submitted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Fetch Pending Requests (Admin)
router.get("/requests", async (req, res) => {
    try {
        const requests = await ParkingRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Approve/Reject Request
router.put("/request/:id", async (req, res) => {
    try {
        const { status } = req.body;
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        await ParkingRequest.findByIdAndUpdate(req.params.id, { status });
        res.json({ success: true, message: `Request ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
