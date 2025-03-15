const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/authMiddleware");
const ParkingRequest = require("../models/ParkingRequest");

// Fetch all parking requests for the logged-in user (based on name)
router.get("/user-requests", verifyUser, async (req, res) => {
    try {
      if (!req.user || !req.user.username) {
        return res.status(401).json({ success: false, message: "User not found or name missing" });
      }
  
      const userName = req.user?.username; // Extract name from req.user
      console.log("Fetching requests for:", userName); // Debugging
  
      // Find all parking requests for this user (latest first)
      const requests = await ParkingRequest.find({ name: userName }).sort({ createdAt: -1 });
  
      if (requests.length === 0) {
        return res.json({ success: true, message: "No parking requests found", requests: [] });
      }
  
      res.json({ success: true, requests });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
  });
  

module.exports = router;